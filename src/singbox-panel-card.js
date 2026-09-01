import { LitElement, html } from "lit";
import { cardStyles } from "./singbox-panel-card-style.js";

const CARD_VERSION = "0.1.8";

// unique_id formats used by the ha-singbox integration:
//   select: "{entry_id}_group_{group_tag}"
//   ping:   "{entry_id}_ping_{proxy_tag}"
//   mode:   "{entry_id}_clash_mode"
const GROUP_MARK = "_group_";
const PING_MARK = "_ping_";
const CLASH_MODE_SUFFIX = "_clash_mode";

const DEFAULT_TITLE = "Sing-box";

class SingBoxPanelCard extends LitElement {
    static properties = {
        // _hass must be reactive: HA pushes a new hass object on every state
        // change and without a re-render the card would show stale values
        // until the user interacts with it.
        _hass: { state: true },
        _state: { state: true }, // "loading" | "error" | "ready"
        _message: { state: true },
        _model: { state: true },
        _testing: { state: true }, // { [groupTag]: true }
    };

    static styles = cardStyles;

    constructor() {
        super();
        this._hass = null;
        this._config = {};
        this._discovered = false;
        this._state = "loading";
        this._message = "";
        this._model = null;
        this._testing = {};
        this._fallbackNote = null;
    }

    static getStubConfig() {
        return { title: DEFAULT_TITLE };
    }

    setConfig(config) {
        if (!config || typeof config !== "object") {
            throw new Error("Invalid configuration");
        }
        const next = { title: DEFAULT_TITLE, ...config };
        // Changing the pin (device/entity) re-runs discovery.
        if (
            next.device_id !== this._config.device_id ||
            next.entity !== this._config.entity
        ) {
            this._discovered = false;
        }
        this._config = next;
    }

    getCardSize() {
        return 4;
    }

    set hass(hass) {
        this._hass = hass;
        if (hass && !this._discovered) {
            this._discovered = true;
            this._discover();
        }
        // Re-render on every hass push even when HA hands us the same object
        // reference (Lit would otherwise skip the update).
        if (hass) this.requestUpdate();
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
                    this._fallbackNote = `device_id «${this._config.device_id}» не дал групп (записей реестра: ${byDevice.length}) — показаны все экземпляры sing-box.`;
                }
            } else if (this._config.entity) {
                const pinned = registry.find(
                    (e) => e.entity_id === this._config.entity
                );
                if (!pinned) {
                    this._fallbackNote = `entity «${this._config.entity}» не найдена в реестре — показаны все экземпляры sing-box.`;
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
                        this._fallbackNote = `entity «${this._config.entity}» не дала групп — показаны все экземпляры sing-box.`;
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
                this._message =
                    markedSelects.length === 0
                        ? deviceCount !== null
                            ? `Группы прокси не найдены: по device_id найдено записей реестра: ${deviceCount}, но сущностей ha-singbox среди них нет (select во всём реестре: ${allSelects.length}, ping-сенсоров: ${pingSensors.length}). Пример записей по device_id: ${pinSample}. Убедитесь, что установлена интеграция ha-singbox (Ghost-in-the-dark/ha-singbox) и она создала сущности, затем перезапустите HA.`
                            : `Группы прокси не найдены: в реестре нет сущностей sing-box (всего select: ${allSelects.length}, ping-сенсоров: ${pingSensors.length}). Проверьте, что ha-singbox установлена и настроена, затем перезапустите HA.`
                        : `Группы прокси не найдены: select-сущности есть, но с неожиданным форматом unique_id (${sample}). Обновите ha-singbox и перезапустите HA.`;
                return;
            }
            if (this._fallbackNote) {
                console.warn(`singbox-panel: ${this._fallbackNote}`);
            }
            this._state = "ready";
        } catch (err) {
            this._state = "error";
            this._message = `Не удалось загрузить данные: ${err && err.message ? err.message : err}`;
        }
    }

    _buildModel(registryEntries) {
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
            groups.push({
                tag: groupTag,
                entityId: e.entity_id,
                options: options.map((tag) => ({
                    tag,
                    pingEntity: pings[tag] || null,
                })),
            });
        }

        // Standalone outbounds (VPN interfaces, direct links, ...) are proxies
        // with a ping sensor that belong to no group.
        const standalone = Object.keys(pings)
            .filter((tag) => !inGroups.has(tag))
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
        const units = ["B", "KiB", "MiB", "GiB", "TiB"];
        let scaled = value;
        let unit = 0;
        while (scaled >= 1024 && unit < units.length - 1) {
            scaled /= 1024;
            unit += 1;
        }
        const digits = unit ? 1 : 0;
        return `${scaled.toLocaleString(undefined, { maximumFractionDigits: digits })} ${units[unit]}`;
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

    // -- actions ------------------------------------------------------------

    // The integration registers these as entity services, so HA requires a
    // target; pass the most relevant sing-box entity (group select / ping
    // sensor) — the service itself resolves the config entry from it.
    async _selectNode(groupTag, nodeTag, target) {
        if (!this._hass) return;
        try {
            await this._hass.callService("singbox", "select_outbound", {
                group_tag: groupTag,
                outbound_tag: nodeTag,
                entity_id: target,
            });
        } catch (err) {
            console.error("singbox-panel: select_outbound failed", err);
        }
    }

    async _testGroup(groupTag, target) {
        if (!this._hass || this._testing[groupTag]) return;
        this._testing = { ...this._testing, [groupTag]: true };
        try {
            await this._hass.callService("singbox", "url_test", {
                outbound_tag: groupTag,
                entity_id: target,
            });
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
            await this._hass.callService("singbox", "url_test", {
                outbound_tag: nodeTag,
                entity_id: target,
            });
        } catch (err) {
            console.error("singbox-panel: url_test failed", err);
        } finally {
            setTimeout(() => {
                this._testing = { ...this._testing, [nodeTag]: false };
            }, 4000);
        }
    }

    // -- render -------------------------------------------------------------

    render() {
        if (this._state === "error") {
            return html`
                <div class="card">
                    <div class="state-msg">${this._message}</div>
                </div>
            `;
        }
        if (this._state === "loading" || !this._model) {
            return html`
                <div class="card">
                    <div class="state-msg">
                        <div class="spinner"></div>
                        <span>Загрузка данных sing-box…</span>
                    </div>
                </div>
            `;
        }

        const m = this._model;
        const version = this._stateValue(m.version);
        const mode = this._stateValue(m.clashMode);
        return html`
            <div class="card">
                <div class="header">
                    <h2>${this._config.title}</h2>
                    <div class="meta">
                        ${version ? html`<span>${version}</span>` : ""}
                        ${mode ? html`<span> · ${mode}</span>` : ""}
                    </div>
                </div>

                <div class="speeds">
                    ${this._speedTile("up", "mdi:arrow-up-bold", "Загрузка", m.uplink)}
                    ${this._speedTile("down", "mdi:arrow-down-bold", "Скачивание", m.downlink)}
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
                    ? html`<div class="fallback-note">${this._fallbackNote}</div>`
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
                    title="Проверить пинг ${proxy.tag}"
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
        const state = this._entity(group.entityId);
        const current =
            state && state.state !== "unavailable" ? state.state : null;
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
                        ${testing ? "Тест…" : "Тест"}
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
                    title="Выбрать ${option.tag}"
                    @click=${() => this._selectNode(group.tag, option.tag, group.entityId)}
                >
                    <span class="node-name">${option.tag}</span>
                    ${ms !== null
                        ? html`<span class="ping ${this._pingClass(ms)}">${this._pingText(ms)}</span>`
                        : ""}
                </button>
                <button
                    class="node-ping"
                    title="Проверить пинг ${option.tag}"
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
