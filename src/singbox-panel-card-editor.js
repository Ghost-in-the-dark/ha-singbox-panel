import { LitElement, html, css } from "lit";
import { resolveLanguage, translate } from "./singbox-panel-i18n.js";

/**
 * Visual editor for the sing-box panel card. Shown by the Lovelace card
 * editor when the card type is picked from the picker; edits the same config
 * keys that can be set in YAML.
 */

// update_interval selector values (seconds); 0 = live (render on every HA
// state change).
const INTERVAL_OPTIONS = [0, 1, 2, 3, 5, 10, 30, 60];

class SingBoxPanelCardEditor extends LitElement {
    static properties = {
        hass: {},
        _config: { state: true },
    };

    static styles = css`
        .row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
        }
        .row ha-switch {
            flex: none;
        }
        .row .label {
            flex: 1;
            font-size: 13px;
        }
        ha-textfield,
        ha-select {
            width: 100%;
        }
        .block {
            margin-top: 12px;
        }
        .hint {
            font-size: 11px;
            color: var(--secondary-text-color);
            margin: 2px 0 8px;
        }
    `;

    setConfig(config) {
        this._config = { ...config };
    }

    _lang() {
        return resolveLanguage(this._config, this.hass);
    }

    _t(key, params = {}) {
        return translate(this._lang(), key, params);
    }

    _update(key, value) {
        this._config = { ...this._config, [key]: value };
        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config: this._config },
                bubbles: true,
                composed: true,
            })
        );
    }

    _onText(ev, key) {
        this._update(key, ev.target.value);
    }

    _onSwitch(ev, key) {
        this._update(key, ev.target.checked);
    }

    _onSelect(ev, key) {
        this._update(key, ev.target.value);
    }

    _intervalLabel(n) {
        if (n === 0) return this._t("intervalLive");
        return this._t("intervalSec", { n });
    }

    render() {
        const cfg = this._config || {};
        const interval = Number(cfg.update_interval) || 0;
        return html`
            <ha-textfield
                label=${this._t("editor.title")}
                value=${cfg.title || "Sing-box"}
                @change=${(ev) => this._onText(ev, "title")}
            ></ha-textfield>

            <div class="block">
                <ha-select
                    label=${this._t("editor.language")}
                    .value=${cfg.language || "auto"}
                    @change=${(ev) => this._onSelect(ev, "language")}
                >
                    <mwc-list-item value="auto">
                        ${this._t("editor.languageAuto")}
                    </mwc-list-item>
                    <mwc-list-item value="ru">Русский</mwc-list-item>
                    <mwc-list-item value="en">English</mwc-list-item>
                </ha-select>
            </div>

            <div class="block">
                <ha-select
                    label=${this._t("editor.interval")}
                    .value=${String(interval)}
                    @change=${(ev) =>
                        this._update("update_interval", Number(ev.target.value))}
                >
                    ${INTERVAL_OPTIONS.map(
                        (n) => html`
                            <mwc-list-item value=${String(n)}>
                                ${this._intervalLabel(n)}
                            </mwc-list-item>
                        `
                    )}
                </ha-select>
                <div class="hint">${this._t("editor.intervalHint")}</div>
            </div>

            <div class="row block">
                <span class="label">${this._t("editor.showTestAll")}</span>
                <ha-switch
                    .checked=${cfg.show_test_all !== false}
                    @change=${(ev) => this._onSwitch(ev, "show_test_all")}
                ></ha-switch>
            </div>
            <div class="hint">${this._t("editor.showTestAllHint")}</div>

            <ha-textfield
                label=${this._t("editor.exclude")}
                value=${(cfg.exclude_outbounds || []).join(", ")}
                @change=${(ev) =>
                    this._update(
                        "exclude_outbounds",
                        ev.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                    )}
            ></ha-textfield>
            <div class="hint">${this._t("editor.excludeHint")}</div>

            <ha-textfield
                label=${this._t("editor.device")}
                value=${cfg.device_id || ""}
                @change=${(ev) => this._onText(ev, "device_id")}
            ></ha-textfield>
            <div class="hint">${this._t("editor.deviceHint")}</div>

            <ha-textfield
                label=${this._t("editor.entity")}
                value=${cfg.entity || ""}
                @change=${(ev) => this._onText(ev, "entity")}
            ></ha-textfield>
            <div class="hint">${this._t("editor.entityHint")}</div>
        `;
    }
}

customElements.define("singbox-panel-card-editor", SingBoxPanelCardEditor);
