# Sing-box Panel Card

A Lovelace card that turns the [ha-singbox](https://github.com/Ghost-in-the-dark/ha-singbox)
integration into a clean monitoring + control panel for sing-box: live speeds,
traffic totals, per-proxy pings and one-click proxy switching.

![Preview](images/preview.png)

## Features

- **Live speeds** — upload / download tiles with the unit configured in the
  integration options (B/s, KiB/s, MB/s, …).
- **Session totals & memory** — download/upload totals, memory usage, active
  connections.
- **Proxy groups** — one block per selector group (`telaga-out`, `Ru-out`, …),
  each proxy rendered as a chip with its last url-test ping (color-coded:
  green ≤ 100 ms, amber ≤ 300 ms, red above).
- **One-click switching** — tap a chip to select that proxy in its group.
- **URL test button** — re-run the group's url-test from the card.
- **«Проверить все»** — one tap re-tests every group and standalone outbound.
- **Update interval** — optional render throttle (1–60 s); with the default
  `0` the card stays fully live. Outbound switching is never delayed by it.
- **RU / EN interface** — follows the Home Assistant UI language by default;
  can be overridden per card with `language: ru` / `language: en`.
- **Zero configuration** — the card discovers the sing-box entities
  automatically via the entity registry. No entity IDs to type.

## Installation

### HACS (recommended)

1. In HACS go to **Frontend** → **⋮** → **Custom repositories** and add
   `https://github.com/Ghost-in-the-dark/ha-singbox-panel` with category
   **Frontend**.
2. Search for **Sing-box Panel Card** and download it.
3. Reload the Lovelace resources (or refresh the page).
4. Add the resource: **Settings → Dashboards → ⋮ → Resources → Add resource**:
   `/hacsfiles/ha-singbox-panel/singbox-panel-card.js` (type: JavaScript
   Module). This step is automatic in newer Home Assistant versions.

### Manual

Copy `singbox-panel-card.js` (from the release or `npm run build`) into
`config/www/` and add the resource `/local/singbox-panel-card.js` (type:
JavaScript Module).

## Usage

Add the card from the card picker (visual editor available) or manually with
type `custom:singbox-panel-card`:

```yaml
type: custom:singbox-panel-card
title: Sing-box            # optional, default "Sing-box"
language: auto             # optional: "auto" (follow Home Assistant UI,
                           # default), "ru" or "en"
update_interval: 0         # optional: refresh rate of the values on the card,
                           # in seconds. 0 = live (re-render on every HA state
                           # change, default). Larger values (1, 2, 3, 5, 10,
                           # 30, 60) throttle re-renders to at most every N
                           # seconds on busy instances. Outbound selection and
                           # the test buttons always apply instantly.
show_test_all: true        # optional: show the «Проверить все» batch-test
                           # button in the header (default true)
exclude_outbounds:         # optional: outbound tags hidden from groups and
  - telaga-urltest-out     # the Outbound block; a group whose every outbound
  - main-out               # is excluded is hidden entirely
# device_id: 4df21e9e7ffc2b82acdefad2eaf6ce6e   # optional: pin to the sing-box
#                                               # device (from its HA device
#                                               # page URL) when several
#                                               # instances are configured
# entity: sensor.telaga_1_out_ping   # optional: pin via an entity instead
                                    # instance when several are configured
```

No other configuration is needed — groups, pings, speeds and totals are
discovered from the ha-singbox integration automatically. When you edit the
config (YAML or the visual editor), exclusion changes apply immediately —
no dashboard reload required.

### Requirements

- The [ha-singbox](https://github.com/Ghost-in-the-dark/ha-singbox) integration
  (≥ 0.3.7, for the ping sensors) configured and running.
- Home Assistant with a recent version (entity registry WS API).

## Development

```bash
npm install
npm run build     # bundles singbox-panel-card.js at the repo root
npm run dev       # minified build (or BUILD_DEV_PATH)
```

The render smoke test runs the card headlessly against a fake HA object:

```bash
python3 -m http.server 8877 &   # serve the repo root
node tests/stand_check.mjs      # asserts rendering + interactions
```

## License

MIT
