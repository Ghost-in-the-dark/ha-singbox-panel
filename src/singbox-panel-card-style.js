import { css } from "lit";

export const cardStyles = css`
    :host {
        display: block;
        font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .card {
        background: var(--ha-card-background, var(--card-background-color));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, none);
        padding: 16px;
        color: var(--primary-text-color);
    }

    /* ---------- header ---------- */
    .header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
    }
    .header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
    }
    .header .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ---------- speed tiles ---------- */
    .speeds {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 14px;
    }
    .tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        min-width: 0;
    }
    .tile ha-icon {
        --mdc-icon-size: 22px;
        flex: none;
    }
    .tile .tile-body {
        min-width: 0;
    }
    .tile .tile-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--secondary-text-color);
    }
    .tile .tile-value {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.15;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tile .tile-value .unit {
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 3px;
    }
    .tile.up ha-icon { color: #ff7043; }
    .tile.down ha-icon { color: var(--success-color, #2e7d32); }

    /* ---------- totals strip ---------- */
    .totals {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-bottom: 14px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
    .totals .chip-stat {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    .totals .chip-stat b {
        color: var(--primary-text-color);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    /* ---------- groups ---------- */
    .group {
        margin-top: 14px;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 12px;
    }
    .group-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    .group-head .group-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
    }
    .group-head .group-current {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .group-head .group-current b {
        color: var(--primary-color);
        font-weight: 600;
    }
    .group-head .test-btn {
        margin-left: auto;
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: none;
        border-radius: 8px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
        transition: background 0.15s ease, opacity 0.15s ease;
    }
    .group-head .test-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
    }
    .group-head .test-btn[disabled] {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .group-head .test-btn ha-icon {
        --mdc-icon-size: 14px;
    }

    .nodes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .node {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 10px;
        overflow: hidden;
        background: transparent;
        transition: border-color 0.15s ease, background 0.15s ease;
    }
    .node:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }
    .node.active {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    }
    .node.active .node-name {
        font-weight: 600;
        color: var(--primary-color);
    }
    .node-select {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: none;
        background: transparent;
        padding: 6px 6px 6px 11px;
        font-size: 13px;
        cursor: pointer;
        color: var(--primary-text-color);
        font-family: inherit;
    }
    .node-name {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .node-name.standalone {
        padding: 6px 0 6px 11px;
    }
    .node-ping {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        background: transparent;
        padding: 0 8px;
        cursor: pointer;
        color: var(--secondary-text-color);
        transition: color 0.15s ease, background 0.15s ease;
    }
    .node-ping:hover {
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .node-ping[disabled] {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .node-ping ha-icon {
        --mdc-icon-size: 15px;
    }
    .ping {
        font-size: 12px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        border-radius: 6px;
        padding: 1px 6px;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    }
    .ping.good { color: var(--success-color, #2e7d32); }
    .ping.warn { color: #f9a825; }
    .ping.bad { color: var(--error-color, #c62828); }
    .ping.none { color: var(--disabled-text-color); }

    /* ---------- states ---------- */
    .state-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 28px 12px;
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
    }
    .spinner {
        width: 26px;
        height: 26px;
        border: 3px solid var(--divider-color, rgba(0, 0, 0, 0.2));
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: singbox-spin 0.9s linear infinite;
    }
    @keyframes singbox-spin {
        to { transform: rotate(360deg); }
    }
    .footer {
        margin-top: 12px;
        font-size: 11px;
        color: var(--disabled-text-color);
        text-align: right;
    }
`;
