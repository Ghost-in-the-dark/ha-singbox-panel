import { LitElement, html, css } from "lit";

/**
 * Visual editor for the sing-box panel card. Shown by the Lovelace card
 * editor when the card type is picked from the picker; edits the same config
 * keys that can be set in YAML.
 */
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
        ha-textfield {
            width: 100%;
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

    render() {
        const cfg = this._config || {};
        return html`
            <ha-textfield
                label="Заголовок"
                value=${cfg.title || "Sing-box"}
                @change=${(ev) => this._onText(ev, "title")}
            ></ha-textfield>

            <div class="row" style="margin-top: 12px">
                <span class="label">Кнопка «Проверить все»</span>
                <ha-switch
                    .checked=${cfg.show_test_all !== false}
                    @change=${(ev) => this._onSwitch(ev, "show_test_all")}
                ></ha-switch>
            </div>
            <div class="hint">
                Массовый url-test по всем группам и outbound в один клик.
            </div>

            <ha-textfield
                label="Исключить outbound (через запятую)"
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
            <div class="hint">
                Эти теги будут скрыты из групп и блока Outbound. Например:
                telaga-urltest-out, main-out
            </div>

            <ha-textfield
                label="device_id (необязательно)"
                value=${cfg.device_id || ""}
                @change=${(ev) => this._onText(ev, "device_id")}
            ></ha-textfield>
            <div class="hint">
                Привязка к конкретному устройству sing-box, если их несколько.
            </div>

            <ha-textfield
                label="entity (необязательно)"
                value=${cfg.entity || ""}
                @change=${(ev) => this._onText(ev, "entity")}
            ></ha-textfield>
            <div class="hint">
                Альтернативная привязка через любую сущность ha-singbox.
            </div>
        `;
    }
}

customElements.define("singbox-panel-card-editor", SingBoxPanelCardEditor);
