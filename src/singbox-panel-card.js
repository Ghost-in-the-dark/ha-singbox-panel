import { LitElement, html } from "lit";
import { cardStyles } from "./singbox-panel-card-style.js";
import { resolveLanguage, translate } from "./singbox-panel-i18n.js";
import "./singbox-panel-card-editor.js";

const CARD_VERSION = "0.1.13";

// unique_id formats used by the ha-singbox integration:
//   select: "{entry_id}_group_{group_tag}"
//   ping:   "{entry_id}_ping_{proxy_tag}"
//   mode:   "{entry_id}_clash_mode"
const GROUP_MARK = "_group_";
const PING_MARK = "_ping_";
const CLASH_MODE_SUFFIX = "_clash_mode";
// Synthetic clash-API group present in /proxies but with no backing outbound
// (url-test on it always fails with 404) — never surfaced by the card.
const SYNTHETIC_GLOBAL = "GLOBAL";
// How long an optimistic outbound selection is shown before the card falls
// back to the entity state when the integration never confirms the change.
const PENDING_SELECT_TTL_MS = 10000;

const DEFAULT_TITLE = "Sing-box";

class SingBoxPanelCard extends LitElement {
    // _hass is intentionally NOT a reactive property: HA hands us a fresh
    // hass object on every state change and we decide when to re-render
    // ourselves (see _scheduleRender), so the configurable update interval
    // actually throttles the work. Lit would otherwise re-render on its own
    // whenever the hass object identity changes.
    static properties = {
        _state: { state: true }, // "loading" | "error" | "ready"
        _model: { state: true },
        _testing: { state: true }, // { [groupTag]: true }
        _testingAll: { state: true }, // batch url-test in progress
    };

    static styles = cardStyles;

    constructor() {
        super();
        this._hass = null;
        this._config = {};
        this._discovered = false;
        this._state = "loading";
        this._model = null;
        this._testing = {};
        this._testingAll = false;
        this._fallbackNote = null; // { key, params }
        this._error = null; // { key, params }
        // Rendering throttle state (update_interval > 0).
        this._lastRenderAt = 0;
        this._renderTimer = null;
        // Optimistic outbound selections: entity_id -> { tag, ts }.
        this._pendingSelections = {};
    }

    static getStubConfig() {
        return {
            title: DEFAULT_TITLE,
            show_test_all: true,
            exclude_outbounds: [],
            update_interval: 0,
            language: "auto",
        };
    }

    static getConfigElement() {
        return document.createElement("singbox-panel-card-editor");
    }

    setConfig(config) {
        if (!config || typeof config !== "object") {
            throw new Error("Invalid configuration");
        }
        const prev = this._config || {};
        const next = {
            title: DEFAULT_TITLE,
            show_test_all: true,
            exclude_outbounds: [],
            update_interval: 0,
            language: "auto",
            ...config,
        };
        // exclude_outbounds accepts a comma-separated string in YAML and an
        // array from the editor; normalize to a trimmed string array.
        next.exclude_outbounds = (Array.isArray(next.exclude_outbounds)
            ? next.exclude_outbounds
            : String(next.exclude_outbounds ?? "")
                  .split(",")
        )
            .map((t) => String(t).trim())
            .filter(Boolean);
        // update_interval: seconds; 0 = live (render on every HA push).
        const interval = Number(next.update_interval);
        next.update_interval =
            Number.isFinite(interval) && interval > 0
                ? Math.min(interval, 3600)
                : 0;
        this._config = next;

        // A pin (device/entity) or an exclusion-list change alters which
        // entities the card shows; the discovered model must be rebuilt.
        // Exclusions previously only applied on the very first discovery,
        // so editing the config did not hide the tags until a full reload.
        if (this._discovered && this._needsRediscovery(prev, next)) {
            this._discovered = false;
            if (this._hass) this._discover();
        }
        // Config edits (visual editor / YAML) render right away; a re-render
        // triggered by a later hass push would otherwise show stale values.
        this.requestUpdate();
    }

    _needsRediscovery(prev, next) {
        if (prev.device_id !== next.device_id || prev.entity !== next.entity) {
            return true;
        }
        const prevList = prev.exclude_outbounds || [];
        const nextList = next.exclude_outbounds || [];
        return (
            prevList.length !== nextList.length ||
            nextList.some((tag) => !prevList.includes(tag))
        );
    }

    getCardSize() {
        return 4;
    }

    get hass() {
        return this._hass;
    }

    set hass(hass) {
        this._hass = hass;
        if (hass && !this._discovered) {
            this._discovered = true;
            this._discover();
        }
        // Re-render on every hass push, gated by the configured interval.
        if (hass) this._scheduleRender();
    }

    // -- localization --------------------------------------------------------

    _lang() {
        return resolveLanguage(this._config, this._hass);
    }

    _t(key, params = {}) {
        return translate(this._lang(), key, params);
    }

    // -- discovery ----------------------------------------------------------

    async _discover() {
        this._state = "loading";
        this._fallbackNote = null;
        try {
            const registry = await this._hass.callWS({
                type: "config/entity_registry/list",
            });
            if (!Array.isArray(registry)) {
                throw new Error("registry is unavailable");
            }
            const isMarkedGroup = (e) =>
                this._domain(e) === "select" &&
                e.unique_id &&
                e.unique_id.includes(GROUP_MARK) &&
                !e.unique_id.endsWith(CLASH_MODE_SUFFIX);
            const markedGroups = (list) => list.filter(isMarkedGroup);

            // Pin to a specific sing-box instance (device/entity). The pin is
            // a preference, not a hard filter: when the registry does not link
            // the sing-box entities to the device/entry (common with this
            // integration), the card falls back to marker search across the
            // whole registry so it still works.
            let entries = registry;
            if (this._config.device_id) {
                const byDevice = registry.filter(
                    (e) => e.device_id === this._config.device_id
                );
                if (markedGroups(byDevice).length > 0) {
                    entries = byDevice;
                } else {
                    this._fallbackNote = {
                        key: "fallback.device",
                        params: {
                            device: this._config.device_id,
                            count: byDevice.length,
                        },
                    };
                }
            } else if (this._config.entity) {
                const pinned = registry.find(
                    (e) => e.entity_id === this._config.entity
                );
                if (!pinned) {
                    this._fallbackNote = {
                        key: "fallback.entityNotFound",
                        params: { entity: this._config.entity },
                    };
                } else {
                    const byPinned = registry.filter(
                        (e) =>
                            (pinned.config_entry_id &&
                                e.config_entry_id === pinned.config_entry_id) ||
                            (pinned.device_id && e.device_id === pinned.device_id)
                    );
                    if (markedGroups(byPinned).length > 0) {
                        entries = byPinned;
                    } else {
                        this._fallbackNote = {
                            key: "fallback.entityNoGroups",
                            params: { entity: this._config.entity },
                        };
                    }
                }
            }
            // sing-box entities are recognized by their unique_id markers
            // ({entry_id}_group_<tag>, {entry_id}_ping_<tag>, ...) rather than
            // by the config entry, so the card works even when the registry
            // does not link them to an entry.
            this._model = this._buildModel(entries);
            if (this._model.groups.length === 0) {
                const allSelects = registry.filter(
                    (e) => this._domain(e) === "select"
                );
                const markedSelects = markedGroups(registry);
                const pingSensors = registry.filter(
                    (e) =>
                        this._domain(e) === "sensor" &&
                        e.unique_id &&
                        e.unique_id.includes(PING_MARK)
                );
                const deviceCount = this._config.device_id
                    ? registry.filter(
                          (e) => e.device_id === this._config.device_id
                      ).length
                    : null;
                const pinRecords = this._config.device_id
                    ? registry.filter(
                          (e) => e.device_id === this._config.device_id
                      )
                    : [];
                const pinSample = pinRecords
                    .slice(0, 5)
                    .map((e) => {
                        const uid = e.unique_id
                            ? e.unique_id.slice(0, 40)
                            : "—";
                        return `${e.entity_id} (${this._domain(e)}) [${uid}]`;
                    })
                    .join(", ");
                if (pinRecords.length) {
                    console.warn(
                        "singbox-panel: records matched by pin:",
                        pinRecords
                            .map(
                                (e) =>
                                    `${e.entity_id} ${this._domain(e)} ${e.unique_id ?? ""}`
                            )
                            .join("\n")
                    );
                }
                const sample = markedSelects
                    .slice(0, 5)
                    .map((e) => `${e.entity_id} [${e.unique_id}]`)
                    .join(", ");
                this._state = "error";
                if (markedSelects.length === 0 && deviceCount !== null) {
                    this._error = {
                        key: "errors.groupsDevice",
                        params: {
                            count: deviceCount,
                            selects: allSelects.length,
                            pings: pingSensors.length,
                            sample: pinSample,
                        },
                    };
                } else if (markedSelects.length === 0) {
                    this._error = {
                        key: "errors.groupsNone",
                        params: {
                            selects: allSelects.length,
                            pings: pingSensors.length,
                        },
                    };
                } else {
                    this._error = {
                        key: "errors.groupsBadUid",
                        params: { sample },
                    };
                }
                return;
            }
            if (this._fallbackNote) {
                console.warn(
                    `singbox-panel: ${this._t(
                        this._fallbackNote.key,
                        this._fallbackNote.params
                    )}`
                );
            }
            this._state = "ready";
        } catch (err) {
            this._state = "error";
            this._error = {
                key: "errors.loadFailed",
                params: {
                    msg: err && err.message ? err.message : String(err),
                },
            };
        }
    }

    _buildModel(registryEntries) {
        const excluded = new Set(this._config.exclude_outbounds || []);
        const pings = {}; // proxy tag -> ping sensor entity_id
        for (const e of registryEntries) {
            if (
                this._domain(e) === "sensor" &&
                e.unique_id &&
                e.unique_id.includes(PING_MARK)
            ) {
                const tag = e.unique_id.slice(
                    e.unique_id.lastIndexOf(PING_MARK) + PING_MARK.length
                );
                if (tag === SYNTHETIC_GLOBAL) continue;
                pings[tag] = e.entity_id;
            }
        }

        const groups = [];
        const inGroups = new Set();
        for (const e of registryEntries) {
            if (
                this._domain(e) !== "select" ||
                !e.unique_id ||
                !e.unique_id.includes(GROUP_MARK) ||
                e.unique_id.endsWith(CLASH_MODE_SUFFIX)
            ) {
                continue;
            }
            const groupTag = e.unique_id.slice(
                e.unique_id.lastIndexOf(GROUP_MARK) + GROUP_MARK.length
            );
            const state = this._hass.states[e.entity_id];
            const options =
                state && state.attributes && Array.isArray(state.attributes.options)
                    ? state.attributes.options
                    : [];
            options.forEach((tag) => inGroups.add(tag));
            const visible = options
                .filter((tag) => !excluded.has(tag))
                .map((tag) => ({
                    tag,
                    pingEntity: pings[tag] || null,
                }));
            // A group whose every outbound is excluded is hidden entirely.
            if (visible.length === 0) continue;
            groups.push({
                tag: groupTag,
                entityId: e.entity_id,
                options: visible,
            });
        }

        // Standalone outbounds (VPN interfaces, direct links, ...) are proxies
        // with a ping sensor that belong to no group.
        const standalone = Object.keys(pings)
            .filter((tag) => !inGroups.has(tag) && !excluded.has(tag))
            .sort()
            .map((tag) => ({ tag, pingEntity: pings[tag] }));

        const sensorBySuffix = (suffix) => {
            const e = registryEntries.find(
                (ent) =>
                    this._domain(ent) === "sensor" &&
                    ent.unique_id &&
                    ent.unique_id.endsWith(suffix)
            );
            return e ? e.entity_id : null;
        };
        const clashMode = registryEntries.find(
            (e) =>
                this._domain(e) === "select" &&
                e.unique_id &&
                e.unique_id.endsWith(CLASH_MODE_SUFFIX)
        );

        return {
            version: sensorBySuffix("_version"),
            uplink: sensorBySuffix("_uplink"),
            downlink: sensorBySuffix("_downlink"),
            uplinkTotal: sensorBySuffix("_uplink_total"),
            downlinkTotal: sensorBySuffix("_downlink_total"),
            memory: sensorBySuffix("_memory"),
            connectionsIn: sensorBySuffix("_connections_in"),
            clashMode: clashMode ? clashMode.entity_id : null,
            groups,
            standalone,
        };
    }

    // -- helpers ------------------------------------------------------------

    _entity(id) {
        return id ? this._hass.states[id] : undefined;
    }

    // Real HA registry entries from config/entity_registry/list have no
    // `domain` field (only `platform` + the entity_id) — the domain is the
    // entity_id prefix.
    _domain(e) {
        if (e.entity_id) return e.entity_id.split(".")[0];
        return e.domain || "";
    }

    _stateValue(id) {
        const state = this._entity(id);
        if (!state) return null;
        return state.state === "unavailable" ? null : state.state;
    }

    _formatSpeed(id) {
        const state = this._entity(id);
        if (!state || state.state === "unavailable" || state.state === "unknown") {
            return { value: "—", unit: "" };
        }
        const value = Number(state.state);
        if (!Number.isFinite(value)) {
            return { value: "—", unit: "" };
        }
        return {
            value: value.toLocaleString(undefined, { maximumFractionDigits: 1 }),
            unit: state.attributes && state.attributes.unit_of_measurement
                ? state.attributes.unit_of_measurement
                : "",
        };
    }

    _formatBytes(id) {
        const state = this._entity(id);
        if (!state || state.state === "unavailable" || state.state === "unknown") {
            return "—";
        }
        const value = Number(state.state);
        if (!Number.isFinite(value)) {
            return "—";
        }
        // HA converts DATA_SIZE sensors (memory, totals) to their suggested
        // unit, so the state may arrive in KiB/MiB/GiB (or kB/MB/GB) — never
        // treat it as raw bytes.
        const unit = (state.attributes && state.attributes.unit_of_measurement) || "B";
        const toBytes = {
            B: 1,
            kB: 1e3,
            MB: 1e6,
            GB: 1e9,
            TB: 1e12,
            KiB: 1024,
            MiB: 1024 ** 2,
            GiB: 1024 ** 3,
            TiB: 1024 ** 4,
        };
        const bytes = value * (toBytes[unit] || 1);
        const units = ["B", "KiB", "MiB", "GiB", "TiB"];
        let scaled = bytes;
        let idx = 0;
        while (scaled >= 1024 && idx < units.length - 1) {
            scaled /= 1024;
            idx += 1;
        }
        const digits = idx ? 1 : 0;
        return `${scaled.toLocaleString(undefined, { maximumFractionDigits: digits })} ${units[idx]}`;
    }

    _ping(option) {
        const state = this._entity(option.pingEntity);
        if (!state || state.state === "unavailable" || state.state === "unknown") {
            return null;
        }
        const ms = Number(state.state);
        return Number.isFinite(ms) ? ms : null;
    }

    _pingClass(ms) {
        if (ms === null) return "none";
        if (ms <= 100) return "good";
        if (ms <= 300) return "warn";
        return "bad";
    }

    _pingText(ms) {
        return ms === null ? "—" : `${ms} ms`;
    }

    // -- render throttle -----------------------------------------------------

    // Seconds between value re-renders; 0 disables the throttle (live).
    _refreshMs() {
        const sec = Number(this._config.update_interval) || 0;
        return Math.min(Math.max(sec, 0), 3600) * 1000;
    }

    // Called on every hass push. With update_interval = 0 the card renders on
    // each push (previous behaviour). With an interval set, renders happen at
    // most every N seconds; `force` (user interaction) bypasses the throttle.
    _scheduleRender(force = false) {
        if (!this._hass) return;
        const interval = this._refreshMs();
        if (interval <= 0 || force) {
            this._requestRender();
            return;
        }
        const now = Date.now();
        const deadline = this._lastRenderAt + interval;
        if (now >= deadline) {
            this._requestRender();
            return;
        }
        if (this._renderTimer) return; // a render is already pending
        this._renderTimer = setTimeout(() => {
            this._renderTimer = null;
            this._requestRender();
        }, deadline - now);
    }

    _requestRender() {
        if (this._renderTimer) {
            clearTimeout(this._renderTimer);
            this._renderTimer = null;
        }
        this.requestUpdate();
    }

    // Selected outbound shown in the group header. Renders the optimistic
    // selection (the tag the user tapped) until the real entity state catches
    // up or the intent expires, so a switch is visible immediately even when
    // the render throttle would otherwise delay the next refresh.
    _groupCurrent(group) {
        const state = this._entity(group.entityId);
        const live =
            state && state.state !== "unavailable" ? state.state : null;
        const pending = this._pendingSelections[group.entityId];
        if (!pending) return live;
        if (pending.tag === live || Date.now() - pending.ts > PENDING_SELECT_TTL_MS) {
            delete this._pendingSelections[group.entityId];
            return live;
        }
        return pending.tag;
    }

    // -- actions ------------------------------------------------------------

    // The integration went through three service schemas: entity services
    // (v0.3.7, target required), a strict schema (v0.3.8, extra keys banned)
    // and ALLOW_EXTRA (v0.3.9). Send the target entity and retry without it
    // when the schema rejects the extra key — works with every version.
    async _callService(domain, service, data, target) {
        try {
            await this._hass.callService(
                domain,
                service,
                target ? { ...data, entity_id: target } : data
            );
        } catch (err) {
            const msg = String(err && err.message ? err.message : err);
            if (target && /extra keys not allowed/.test(msg)) {
                await this._hass.callService(domain, service, data);
                return;
            }
            throw err;
        }
    }

    async _selectNode(groupTag, nodeTag, target) {
        if (!this._hass || !target) return;
        // Show the switch right away; the header uses this until the select
        // entity state confirms the new outbound (see _groupCurrent).
        this._pendingSelections[target] = { tag: nodeTag, ts: Date.now() };
        this._scheduleRender(true);
        try {
            await this._callService(
                "singbox",
                "select_outbound",
                { group_tag: groupTag, outbound_tag: nodeTag },
                target
            );
        } catch (err) {
            console.error("singbox-panel: select_outbound failed", err);
            delete this._pendingSelections[target];
        }
        // Flush again once the service round-trip finished — by then HA has
        // usually pushed the new select state already.
        this._scheduleRender(true);
    }

    async _testGroup(groupTag, target) {
        if (!this._hass || this._testing[groupTag]) return;
        this._testing = { ...this._testing, [groupTag]: true };
        try {
            await this._callService(
                "singbox",
                "url_test",
                { outbound_tag: groupTag },
                target
            );
        } catch (err) {
            console.error("singbox-panel: url_test failed", err);
        } finally {
            setTimeout(() => {
                this._testing = { ...this._testing, [groupTag]: false };
            }, 4000);
        }
    }

    async _pingNode(nodeTag, target) {
        if (!this._hass || this._testing[nodeTag]) return;
        this._testing = { ...this._testing, [nodeTag]: true };
        try {
            await this._callService(
                "singbox",
                "url_test",
                { outbound_tag: nodeTag },
                target
            );
        } catch (err) {
            console.error("singbox-panel: url_test failed", err);
        } finally {
            setTimeout(() => {
                this._testing = { ...this._testing, [nodeTag]: false };
            }, 4000);
        }
    }

    // One tap re-runs the url-test of every visible group and standalone
    // outbound. Errors on individual outbounds don't abort the batch.
    async _testAll() {
        if (!this._hass || !this._model || this._testingAll) return;
        this._testingAll = true;
        const targets = [
            ...this._model.groups.map((g) => ({
                tag: g.tag,
                target: g.entityId,
            })),
            ...this._model.standalone.map((p) => ({
                tag: p.tag,
                target: p.pingEntity,
            })),
        ];
        try {
            await Promise.all(
                targets.map((t) =>
                    this._callService(
                        "singbox",
                        "url_test",
                        { outbound_tag: t.tag },
                        t.target
                    ).catch((err) => {
                        console.error(
                            `singbox-panel: url_test failed for ${t.tag}`,
                            err
                        );
                    })
                )
            );
        } finally {
            setTimeout(() => {
                this._testingAll = false;
            }, 4000);
        }
    }

    // -- render -------------------------------------------------------------

    render() {
        // A render is the moment the throttle measures against: every actual
        // paint (loading/error/data) resets the next-refresh deadline.
        this._lastRenderAt = Date.now();

        if (this._state === "error") {
            const err = this._error || { key: "errors.loadFailed", params: {} };
            return html`
                <div class="card">
                    <div class="state-msg">
                        ${this._t(err.key, err.params)}
                    </div>
                </div>
            `;
        }
        if (this._state === "loading" || !this._model) {
            return html`
                <div class="card">
                    <div class="state-msg">
                        <div class="spinner"></div>
                        <span>${this._t("loading")}</span>
                    </div>
                </div>
            `;
        }

        const m = this._model;
        const version = this._stateValue(m.version);
        const mode = this._stateValue(m.clashMode);
        const showTestAll =
            this._config.show_test_all !== false &&
            (m.groups.length > 0 || m.standalone.length > 0);
        return html`
            <div class="card">
                <div class="header">
                    <h2>${this._config.title}</h2>
                    <div class="meta">
                        ${version ? html`<span>${version}</span>` : ""}
                        ${mode ? html`<span> · ${mode}</span>` : ""}
                    </div>
                    ${showTestAll
                        ? html`
                              <button
                                  class="test-all-btn"
                                  ?disabled=${this._testingAll}
                                  @click=${() => this._testAll()}
                              >
                                  <ha-icon icon="mdi:flash-outline"></ha-icon>
                                  ${this._testingAll
                                      ? this._t("testing")
                                      : this._t("testAll")}
                              </button>
                          `
                        : ""}
                </div>

                <div class="speeds">
                    ${this._speedTile("up", "mdi:arrow-up-bold", this._t("speedUp"), m.uplink)}
                    ${this._speedTile("down", "mdi:arrow-down-bold", this._t("speedDown"), m.downlink)}
                </div>

                <div class="totals">
                    ${this._totalChip("mdi:arrow-up", this._formatBytes(m.uplinkTotal))}
                    ${this._totalChip("mdi:arrow-down", this._formatBytes(m.downlinkTotal))}
                    ${this._totalChip("mdi:memory", this._formatBytes(m.memory))}
                    ${this._totalChip("mdi:lan-connect", this._stateValue(m.connectionsIn))}
                </div>

                ${m.groups.map((g) => this._renderGroup(g))}
                ${m.standalone.length
                    ? this._renderStandalone(m.standalone)
                    : ""}

                ${this._fallbackNote
                    ? html`<div class="fallback-note">${this._t(
                          this._fallbackNote.key,
                          this._fallbackNote.params
                      )}</div>`
                    : ""}
                <div class="footer">sing-box panel · v${CARD_VERSION}</div>
            </div>
        `;
    }

    _renderStandalone(proxies) {
        return html`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">Outbound</span>
                </div>
                <div class="nodes">
                    ${proxies.map((p) => this._renderStandaloneNode(p))}
                </div>
            </div>
        `;
    }

    _renderStandaloneNode(proxy) {
        const ms = this._ping(proxy);
        const pinging = Boolean(this._testing[proxy.tag]);
        return html`
            <div class="node">
                <span class="node-name standalone">${proxy.tag}</span>
                ${ms !== null
                    ? html`<span class="ping ${this._pingClass(ms)}">${this._pingText(ms)}</span>`
                    : ""}
                <button
                    class="node-ping"
                    title=${this._t("pingTitle", { tag: proxy.tag })}
                    ?disabled=${pinging}
                    @click=${() => this._pingNode(proxy.tag, proxy.pingEntity)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `;
    }

    _speedTile(kind, icon, label, entityId) {
        const { value, unit } = this._formatSpeed(entityId);
        return html`
            <div class="tile ${kind}">
                <ha-icon icon=${icon}></ha-icon>
                <div class="tile-body">
                    <div class="tile-label">${label}</div>
                    <div class="tile-value">${value}<span class="unit">${unit}</span></div>
                </div>
            </div>
        `;
    }

    _totalChip(icon, text) {
        return html`
            <span class="chip-stat">
                <ha-icon icon=${icon}></ha-icon>
                <b>${text}</b>
            </span>
        `;
    }

    _renderGroup(group) {
        const current = this._groupCurrent(group);
        const testing = Boolean(this._testing[group.tag]);
        return html`
            <div class="group">
                <div class="group-head">
                    <span class="group-name">${group.tag}</span>
                    <span class="group-current">
                        ${current ? html`→ <b>${current}</b>` : ""}
                    </span>
                    <button
                        class="test-btn"
                        ?disabled=${testing}
                        @click=${() => this._testGroup(group.tag, group.entityId)}
                    >
                        <ha-icon icon="mdi:flash-outline"></ha-icon>
                        ${testing ? this._t("testing") : this._t("test")}
                    </button>
                </div>
                <div class="nodes">
                    ${group.options.map(
                        (option) => this._renderNode(group, option, current)
                    )}
                </div>
            </div>
        `;
    }

    _renderNode(group, option, current) {
        const ms = this._ping(option);
        const active = option.tag === current;
        const pinging = Boolean(this._testing[option.tag]);
        return html`
            <div class="node ${active ? "active" : ""}">
                <button
                    class="node-select"
                    title=${this._t("selectTitle", { tag: option.tag })}
                    @click=${() => this._selectNode(group.tag, option.tag, group.entityId)}
                >
                    <span class="node-name">${option.tag}</span>
                    ${ms !== null
                        ? html`<span class="ping ${this._pingClass(ms)}">${this._pingText(ms)}</span>`
                        : ""}
                </button>
                <button
                    class="node-ping"
                    title=${this._t("pingTitle", { tag: option.tag })}
                    ?disabled=${pinging}
                    @click=${() => this._pingNode(option.tag, option.pingEntity || group.entityId)}
                >
                    <ha-icon icon="mdi:radar"></ha-icon>
                </button>
            </div>
        `;
    }
}

customElements.define("singbox-panel-card", SingBoxPanelCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "singbox-panel-card",
    name: "Sing-box Panel",
    description: "Панель мониторинга и управления прокси sing-box",
    preview: false,
});
