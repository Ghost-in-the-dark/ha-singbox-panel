/**
 * Headless render check for the sing-box panel card.
 *
 * Serves nothing by itself: expects the test stand to be reachable at
 * STAND_URL (default http://127.0.0.1:8877/tests/stand.html).
 *
 * Usage: node tests/stand_check.mjs
 * Exits non-zero on any failed assertion.
 */
import { chromium } from "playwright-core";

const STAND_URL =
    process.env.STAND_URL || "http://127.0.0.1:8877/tests/stand.html";

const results = [];
function check(name, condition, detail = "") {
    results.push({ name, ok: Boolean(condition) });
    console.log(`  ${condition ? "ok" : "FAIL"}: ${name}${detail ? ` (${detail})` : ""}`);
}

const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    chromiumSandbox: false,
    headless: true,
});

try {
    const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
    page.on("console", (msg) => {
        if (msg.type() === "error") console.log("  [console.error]", msg.text());
    });
    page.on("pageerror", (err) => console.log("  [pageerror]", err.message));

    await page.goto(STAND_URL, { waitUntil: "networkidle" });

    // The card discovers entities asynchronously; wait for the node buttons.
    await page.waitForSelector(".node", { timeout: 5000 });
    await page.waitForTimeout(300);

    check("header title", (await page.textContent("h2")) === "Sing-box");
    check("version meta", (await page.textContent(".meta")).includes("1.13.18"));
    check("mode meta", (await page.textContent(".meta")).includes("Rule"));

    const speeds = await page.locator(".tile-value").allTextContents();
    check("speed tiles rendered", speeds.length === 2, speeds.join(" | "));
    check("speed value+unit", speeds[0].includes("1,641") && speeds[0].includes("B/s"), speeds[0]);
    check("downlink value", speeds[1].includes("18,234"), speeds[1]);

    const totals = await page.locator(".chip-stat b").allTextContents();
    check(
        "totals formatted",
        totals.length === 4 &&
            totals[0] === "19.6 MiB" &&
            totals[1] === "962.6 MiB" &&
            totals[2] === "29.9 MiB",
        totals.join(" | ")
    );

    const groups = await page.locator(".group").count();
    check("three blocks", groups === 3, `${groups} blocks`);
    check(
        "group names",
        (await page.locator(".group").nth(0).locator(".group-name").textContent()) ===
            "telaga-out" &&
            (await page.locator(".group").nth(1).locator(".group-name").textContent()) ===
                "Ru-out"
    );

    const groupNodes = await page.locator(".group .node").count();
    check("nine nodes total", groupNodes === 9, `${groupNodes} nodes`);

    // -- standalone outbounds block ------------------------------------------
    const standaloneNames = await page
        .locator(".group", { hasText: "Outbound" })
        .locator(".node-name")
        .allTextContents();
    check(
        "standalone outbounds",
        standaloneNames.length === 2 &&
            standaloneNames.includes("EU-out") &&
            standaloneNames.includes("main-out"),
        standaloneNames.join(", ")
    );
    const standalonePing = await page
        .locator(".node", { hasText: "EU-out" })
        .locator(".ping")
        .textContent();
    check("standalone ping badge", standalonePing.trim() === "160 ms", standalonePing.trim());
    check(
        "synthetic GLOBAL hidden",
        (await page.locator(".node", { hasText: "GLOBAL" }).count()) === 0,
        "GLOBAL still visible"
    );

    const activeNodes = await page.locator(".node.active .node-name").allTextContents();
    check(
        "active nodes",
        activeNodes.length === 2 &&
            activeNodes.includes("telaga-urltest-out") &&
            activeNodes.includes("Ru-2-out"),
        activeNodes.join(", ")
    );

    // -- live updates without interaction ------------------------------------
    await page.evaluate(() => {
        window.__pushState("sensor.telaga_1_out_ping", "95");
        window.__pushState("sensor.singbox_uplink", "5000");
    });
    await page.waitForTimeout(200);
    const livePing = await page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".ping")
        .textContent();
    check("live ping update", livePing.trim() === "95 ms", livePing.trim());
    const liveUp = await page.locator(".tile-value").nth(0).textContent();
    check("live uplink update", liveUp.includes("5,000"), liveUp);
    await page.evaluate(() => {
        window.__pushState("sensor.telaga_1_out_ping", "180");
        window.__pushState("sensor.singbox_uplink", "1641");
    });
    await page.waitForTimeout(200);

    const pingText = await page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".ping")
        .textContent();
    check("ping badge", pingText.trim() === "180 ms", pingText.trim());
    const pingClass = await page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".ping")
        .getAttribute("class");
    check("ping color class", pingClass.includes("warn"), pingClass);

    // -- interactions -------------------------------------------------------
    await page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".node-select")
        .click();
    await page.waitForTimeout(150);
    let calls = await page.evaluate(() => window.__calls);
    check(
        "click node -> select_outbound",
        calls.some(
            (c) =>
                c.service === "select_outbound" &&
                c.data.group_tag === "telaga-out" &&
                c.data.outbound_tag === "telaga-1-out" &&
                c.data.entity_id === "select.telaga_out"
        ),
        JSON.stringify(calls)
    );

    // ping button on a node -> url_test of that node
    const nodePingBtn = page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".node-ping");
    await nodePingBtn.click();
    await page.waitForTimeout(150);
    calls = await page.evaluate(() => window.__calls);
    check(
        "node ping button -> url_test",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "telaga-1-out" &&
                c.data.entity_id === "sensor.telaga_1_out_ping"
        ),
        JSON.stringify(calls)
    );
    check("node ping button disabled while running", await nodePingBtn.isDisabled());

    // standalone ping button -> url_test of that outbound
    const standalonePingBtn = page
        .locator(".node", { hasText: "EU-out" })
        .locator(".node-ping");
    await standalonePingBtn.click();
    await page.waitForTimeout(150);
    calls = await page.evaluate(() => window.__calls);
    check(
        "standalone ping button -> url_test",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "EU-out" &&
                c.data.entity_id === "sensor.eu_out_ping"
        ),
        JSON.stringify(calls)
    );

    const firstTestBtn = page.locator(".group").nth(0).locator(".test-btn");
    await firstTestBtn.click();
    await page.waitForTimeout(150);
    calls = await page.evaluate(() => window.__calls);
    // The first group (telaga-out) currently has the urltest auto-entry
    // selected. A group test must url-test every node individually — testing
    // the group tag would only test the current selection and refresh nothing
    // (the bug being fixed).
    check(
        "group test with urltest selected -> per-node url_test",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "telaga-2-out" &&
                c.data.entity_id === "sensor.telaga_2_out_ping"
        ) &&
            calls.some(
                (c) =>
                    c.service === "url_test" &&
                    c.data.outbound_tag === "telaga-urltest-out" &&
                    c.data.entity_id === "sensor.telaga_urltest_out_ping"
            ) &&
            !calls.some(
                (c) =>
                    c.service === "url_test" &&
                    c.data.outbound_tag === "telaga-out"
            ),
        JSON.stringify(calls.slice(-6))
    );
    check("test button disabled while running", await firstTestBtn.isDisabled());

    // -- strict schema (integration v0.3.8): retry without entity_id --------
    await page.evaluate(() => {
        window.__failOnEntityId = true;
    });
    await page
        .locator(".node", { hasText: "telaga-1-out" })
        .locator(".node-select")
        .click();
    await page.waitForTimeout(150);
    calls = await page.evaluate(() => window.__calls);
    check(
        "retry without entity_id on strict schema",
        calls.some(
            (c) =>
                c.service === "select_outbound" &&
                c.data.group_tag === "telaga-out" &&
                c.data.outbound_tag === "telaga-1-out" &&
                !("entity_id" in c.data)
        ),
        JSON.stringify(calls.slice(-2))
    );
    await page.evaluate(() => {
        window.__failOnEntityId = false;
    });

    // -- second card pinned via device_id ------------------------------------
    await page.evaluate(() => window.__addCard2());
    await page.waitForSelector("#card2 .node", { timeout: 5000 });
    check(
        "device-pinned card finds groups",
        (await page.locator("#card2 .group").count()) === 3 &&
            (await page.locator("#card2 .node").count()) === 9,
        `${await page.locator("#card2 .group").count()} blocks / ${await page.locator("#card2 .node").count()} nodes`
    );
    check(
        "device-pinned card title",
        (await page.locator("#card2 h2").textContent()) === "Pinned"
    );

    // -- third card: pin matches nothing, registry not device-linked ---------
    // emulates the user's HA where sing-box entities have device_id: null
    await page.evaluate(() => window.__addCard3());
    await page.waitForSelector("#card3 .node", { timeout: 5000 });
    check(
        "fallback card renders groups",
        (await page.locator("#card3 .group").count()) === 3 &&
            (await page.locator("#card3 .node").count()) === 9,
        `${await page.locator("#card3 .group").count()} blocks / ${await page.locator("#card3 .node").count()} nodes`
    );
    const fallbackNote = await page
        .locator("#card3 .fallback-note")
        .textContent();
    check(
        "fallback warning shown",
        fallbackNote.includes("показаны все экземпляры sing-box"),
        fallbackNote
    );

    // -- fourth card: pin hits a foreign device with no sing-box entities ----
    await page.evaluate(() => window.__addCard4());
    await page.waitForSelector("#card4 .state-msg", { timeout: 5000 });
    const foreignMsg = await page.locator("#card4 .state-msg").textContent();
    check(
        "foreign device error message",
        foreignMsg.includes("записей реестра: 3") &&
            foreignMsg.includes("sensor.wg_status (sensor) [wg_status]"),
        foreignMsg
    );

    // -- "Проверить все" batch button on the main card ----------------------
    const testAllBtn = page.locator(".test-all-btn").first();
    check("test-all button rendered", (await testAllBtn.count()) > 0);
    await page.evaluate(() => {
        window.__calls = [];
    });
    await testAllBtn.click();
    await page.waitForTimeout(200);
    calls = await page.evaluate(() => window.__calls);
    check(
        "test-all -> url_test for every group node",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "telaga-2-out" &&
                c.data.entity_id === "sensor.telaga_2_out_ping"
        ) &&
            calls.some(
                (c) =>
                    c.service === "url_test" &&
                    c.data.outbound_tag === "Ru-3-out" &&
                    c.data.entity_id === "sensor.ru_3_out_ping"
            ),
        JSON.stringify(calls.slice(-12))
    );
    check(
        "test-all -> url_test for every standalone",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "main-out" &&
                c.data.entity_id === "sensor.main_out_ping"
        ) &&
            calls.some(
                (c) =>
                    c.service === "url_test" &&
                    c.data.outbound_tag === "EU-out" &&
                    c.data.entity_id === "sensor.eu_out_ping"
            ),
        JSON.stringify(calls.slice(-12))
    );
    check(
        "test-all never targets group tags or GLOBAL",
        !calls.some(
            (c) =>
                c.service === "url_test" &&
                (c.data.outbound_tag === "GLOBAL" ||
                    /^(telaga-out|Ru-out)$/.test(c.data.outbound_tag))
        ) &&
            !calls.some(
                (c) => c.service === "url_test" && /^select\./.test(c.data.entity_id)
            ),
        JSON.stringify(calls.slice(-12))
    );
    check("test-all button disabled while running", await testAllBtn.isDisabled());

    // -- fifth card: excluded outbounds are hidden --------------------------
    await page.evaluate(() => window.__addCard5());
    await page.waitForSelector("#card5 .node", { timeout: 5000 });
    check(
        "filtered card: hidden group is dropped",
        (await page.locator("#card5 .group").count()) === 2,
        `${await page.locator("#card5 .group").count()} blocks`
    );
    const filteredGroupNodes = await page.locator("#card5 .group .node").count();
    check(
        "filtered card: excluded node removed from group",
        filteredGroupNodes === 3,
        `${filteredGroupNodes} nodes`
    );
    check(
        "filtered card: no excluded node anywhere",
        (await page.locator("#card5 .node", { hasText: "telaga-1-out" }).count()) ===
            0,
        "telaga-1-out still visible"
    );
    const filteredStandalone = await page
        .locator("#card5 .group", { hasText: "Outbound" })
        .locator(".node-name")
        .allTextContents();
    check(
        "filtered card: standalone keeps only EU-out",
        filteredStandalone.length === 1 && filteredStandalone[0] === "EU-out",
        filteredStandalone.join(", ")
    );

    // -- sixth card: show_test_all: false hides the batch button -------------
    await page.evaluate(() => window.__addCard6());
    await page.waitForSelector("#card6 .node", { timeout: 5000 });
    check(
        "show_test_all: false hides batch button",
        (await page.locator("#card6 .test-all-btn").count()) === 0
    );

    // -- seventh card: English UI + update_interval render throttle ----------
    await page.evaluate(() => window.__addCard7());
    await page.waitForSelector("#card7 .node", { timeout: 5000 });
    const enLabels = await page.locator("#card7 .tile-label").allTextContents();
    check(
        "en locale: speed labels",
        enLabels.length === 2 &&
            enLabels[0] === "Upload" &&
            enLabels[1] === "Download",
        enLabels.join(" | ")
    );
    const enTestAll = await page.locator("#card7 .test-all-btn").textContent();
    check("en locale: test-all label", enTestAll.includes("Test all"), enTestAll);
    const c7Up = page.locator("#card7 .tile-value").nth(0);
    check("throttle: initial value shown", (await c7Up.textContent()).includes("1,641"));

    // A pushed state change must NOT re-render immediately (interval 60 s)...
    await page.evaluate(() =>
        window.__pushStateFor("card7", "sensor.singbox_uplink", "7777")
    );
    await page.waitForTimeout(400);
    check(
        "throttle: pushed value held until interval",
        (await c7Up.textContent()).includes("1,641"),
        await c7Up.textContent()
    );

    // ...but selecting an outbound forces an immediate refresh: the switch is
    // visible at once and the throttled values follow in the same render.
    await page
        .locator("#card7 .node", { hasText: "telaga-1-out" })
        .locator(".node-select")
        .click();
    await page.waitForTimeout(250);
    const c7Active = await page
        .locator("#card7 .node.active .node-name")
        .allTextContents();
    check(
        "outbound switch updates instantly",
        c7Active.includes("telaga-1-out"),
        c7Active.join(", ")
    );
    check(
        "instant refresh flushes throttled values",
        (await c7Up.textContent()).includes("7,777"),
        await c7Up.textContent()
    );

    // -- eighth card: exclusion edits on a running card apply immediately ----
    await page.evaluate(() => window.__addCard8());
    await page.waitForSelector("#card8 .node", { timeout: 5000 });
    check(
        "reconfig card: telaga-1-out hidden initially",
        (await page.locator("#card8 .node", { hasText: "telaga-1-out" }).count()) ===
            0,
        "telaga-1-out still visible"
    );
    check(
        "reconfig card: telaga-2-out visible initially",
        (await page.locator("#card8 .node", { hasText: "telaga-2-out" }).count()) ===
            1,
        "telaga-2-out missing"
    );

    // Change the exclusion list on the running card: the model must rebuild
    // without a dashboard reload (the bug being fixed).
    await page.evaluate(() => window.__reconfigCard8(["telaga-2-out"]));
    await page.waitForTimeout(300);
    check(
        "exclusion edit: newly excluded node hidden",
        (await page.locator("#card8 .node", { hasText: "telaga-2-out" }).count()) ===
            0,
        "telaga-2-out still visible"
    );
    check(
        "exclusion edit: previously excluded node restored",
        (await page.locator("#card8 .node", { hasText: "telaga-1-out" }).count()) ===
            1,
        "telaga-1-out still hidden"
    );

    // -- visual editor is registered -----------------------------------------
    check(
        "editor element registered",
        await page.evaluate(
            () =>
                typeof customElements.get("singbox-panel-card-editor") ===
                "function"
        )
    );
    check(
        "getConfigElement returns an editor",
        await page.evaluate(() => {
            const Card = customElements.get("singbox-panel-card");
            const el = Card.getConfigElement();
            return el instanceof customElements.get("singbox-panel-card-editor");
        })
    );

    // -- visual editor renders translated interval options -------------------
    // Lit renders the editor into its shadow DOM, so read the option labels
    // through a shadow-piercing locator (textContent of the host is empty).
    await page.evaluate(() => window.__addEditor("ru"));
    await page.waitForSelector("#editor1 mwc-list-item");
    const editorItemsRu = await page
        .locator("#editor1 mwc-list-item")
        .allTextContents();
    check(
        "editor ru: interval options translated",
        editorItemsRu.some((t) => t.includes("5 сек")) &&
            editorItemsRu.some((t) => t.includes("Авто (как в Home Assistant)")) &&
            !editorItemsRu.some((t) => t.includes("intervalSec")) &&
            !editorItemsRu.some((t) => t.includes("intervalLive")),
        editorItemsRu.map((t) => t.trim()).join(" | ")
    );
    await page.evaluate(() => window.__addEditor("en"));
    await page.waitForTimeout(150);
    const editorItemsEn = await page
        .locator("#editor1 mwc-list-item")
        .allTextContents();
    check(
        "editor en: interval options translated",
        editorItemsEn.some((t) => t.includes("5 s")) &&
            !editorItemsEn.some((t) => t.includes("intervalSec")) &&
            !editorItemsEn.some((t) => t.includes("intervalLive")),
        editorItemsEn.map((t) => t.trim()).join(" | ")
    );

    // -- editor: exclude list is built from the discovered outbounds ---------
    // (the stand's ha-select/mwc-list-item/ha-switch are plain unknown
    // elements, so interaction is exercised by dispatching the exact events
    // the real elements fire: `change` on legacy mwc selects, `selected`
    // {value} on the current ha-select, `change` on switches.)
    await page.waitForFunction(() => {
        const ed = document.querySelector("#editor1 singbox-panel-card-editor");
        if (!ed || !ed.shadowRoot) return false;
        return ed.shadowRoot.querySelectorAll(".exclude-row").length > 0;
    });
    const excludeTags = await page.evaluate(() => {
        const ed = document.querySelector("#editor1 singbox-panel-card-editor");
        return [...ed.shadowRoot.querySelectorAll(".exclude-row .label")].map(
            (n) => n.textContent.trim()
        );
    });
    check(
        "editor exclude: lists discovered outbounds",
        excludeTags.includes("main-out") &&
            excludeTags.includes("EU-out") &&
            excludeTags.includes("telaga-urltest-out") &&
            excludeTags.includes("Ru-1-out") &&
            !excludeTags.includes("GLOBAL") &&
            excludeTags.length === 9,
        excludeTags.join(", ")
    );
    await page.evaluate(() => {
        window.__editorConfigs = [];
        const ed = document.querySelector(
            "#editor1 singbox-panel-card-editor"
        );
        ed.addEventListener("config-changed", (e) =>
            window.__editorConfigs.push(e.detail.config)
        );
    });
    await page.evaluate(() => {
        const ed = document.querySelector(
            "#editor1 singbox-panel-card-editor"
        );
        const selects = ed.shadowRoot.querySelectorAll("ha-select");
        // legacy mwc contract: `change` with target.value
        const lang = selects[0];
        lang.value = "ru";
        lang.dispatchEvent(new Event("change", { bubbles: true }));
        const interval = selects[1];
        interval.value = "30";
        interval.dispatchEvent(new Event("change", { bubbles: true }));
        // current ha-select contract: `selected` with detail.value
        lang.dispatchEvent(
            new CustomEvent("selected", {
                detail: { value: "en" },
                bubbles: true,
                composed: true,
            })
        );
        interval.dispatchEvent(
            new CustomEvent("selected", {
                detail: { value: "10" },
                bubbles: true,
                composed: true,
            })
        );
    });
    await page.waitForTimeout(50);
    const selectConfig = await page.evaluate(
        () => window.__editorConfigs.at(-1)
    );
    check(
        "editor selects: both event contracts update the config",
        selectConfig &&
            selectConfig.language === "en" &&
            selectConfig.update_interval === 10,
        JSON.stringify(selectConfig)
    );
    await page.evaluate(() => {
        const ed = document.querySelector(
            "#editor1 singbox-panel-card-editor"
        );
        for (const row of ed.shadowRoot.querySelectorAll(".exclude-row")) {
            if (row.querySelector(".label").textContent.trim() === "main-out") {
                const sw = row.querySelector("ha-switch");
                sw.checked = true;
                sw.dispatchEvent(new Event("change", { bubbles: true }));
                break;
            }
        }
    });
    await page.waitForTimeout(50);
    const excludeConfig = await page.evaluate(
        () => window.__editorConfigs.at(-1)
    );
    check(
        "editor exclude: switch toggles the tag in exclude_outbounds",
        Array.isArray(excludeConfig.exclude_outbounds) &&
            excludeConfig.exclude_outbounds.length === 1 &&
            excludeConfig.exclude_outbounds[0] === "main-out",
        JSON.stringify(excludeConfig)
    );

    // -- traffic chart -------------------------------------------------------
    const chartLines = await page.locator("#card .chart-line").count();
    check("chart: both series drawn", chartLines === 2, `${chartLines} lines`);

    const chartPoints = await page.evaluate(async () => {
        const card = document.querySelector("#card > singbox-panel-card");
        const setSpeed = (id, value) => {
            window.__fakeHass.states[id].state = String(value);
        };
        for (const v of [1000, 2000, 3000]) {
            setSpeed("sensor.singbox_uplink", v);
            setSpeed("sensor.singbox_downlink", v * 2);
            card.hass = { ...window.__fakeHass, states: window.__fakeHass.states };
            await new Promise((r) => setTimeout(r, 30));
        }
        await new Promise((r) => setTimeout(r, 80));
        const line = card.shadowRoot.querySelector(".chart-line.up");
        return line ? (line.getAttribute("points") || "").trim() : "";
    });
    check(
        "chart: polyline has points",
        chartPoints.split(/\s+/).filter(Boolean).length >= 2,
        chartPoints.slice(0, 40)
    );

    // -- connections ---------------------------------------------------------
    await page.waitForTimeout(400);
    const connRows = await page.locator("#card .conn-row").count();
    check("connections: rows rendered", connRows === 2, `${connRows} rows`);

    const connHosts = (
        await page.locator("#card .conn-host").allTextContents()
    ).map((t) => t.trim());
    check(
        "connections: hosts shown",
        connHosts.includes("example.com") && connHosts.includes("dns.google"),
        connHosts.join(" | ")
    );

    const connCount = (
        await page.textContent("#card .conn-count")
    ).trim();
    check("connections: counter", /2/.test(connCount), connCount);

    await page.evaluate(() => {
        const card = document.querySelector("#card > singbox-panel-card");
        const input = card.shadowRoot.querySelector(".conn-search");
        input.value = "curl";
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(120);
    const filteredHosts = (
        await page.locator("#card .conn-host").allTextContents()
    ).map((t) => t.trim());
    check(
        "connections: text filter",
        filteredHosts.length === 1 && filteredHosts[0] === "example.com",
        filteredHosts.join(" | ")
    );

    await page.evaluate(() => {
        const card = document.querySelector("#card > singbox-panel-card");
        const input = card.shadowRoot.querySelector(".conn-search");
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        const select = card.shadowRoot.querySelectorAll(".conn-select")[0];
        select.value = "udp";
        select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.waitForTimeout(120);
    const netHosts = (
        await page.locator("#card .conn-host").allTextContents()
    ).map((t) => t.trim());
    check(
        "connections: network filter",
        netHosts.length === 1 && netHosts[0] === "dns.google",
        netHosts.join(" | ")
    );

    await page.evaluate(() => {
        const card = document.querySelector("#card > singbox-panel-card");
        card.shadowRoot.querySelector(".conn-reset").click();
    });
    await page.waitForTimeout(120);
    check(
        "connections: reset restores all",
        (await page.locator("#card .conn-row").count()) === 2
    );

    await page.evaluate(() => {
        const card = document.querySelector("#card > singbox-panel-card");
        card.shadowRoot.querySelector(".conn-close-all").click();
    });
    await page.waitForTimeout(150);
    const closeAllCall = await page.evaluate(() =>
        window.__calls.find((c) => c.service === "close_all_connections")
    );
    check("connections: close-all service", Boolean(closeAllCall));

    // -- section switches ----------------------------------------------------
    await page.evaluate(() => {
        const el = document.createElement("singbox-panel-card");
        el.setConfig({
            title: "Sections",
            show_chart: false,
            show_connections: false,
            show_speeds: false,
            show_totals: false,
            show_groups: false,
        });
        const host = document.createElement("div");
        host.id = "sec";
        host.appendChild(el);
        document.body.appendChild(host);
        el.hass = window.__fakeHass;
    });
    await page.waitForTimeout(300);
    const sectionState = await page.evaluate(() => {
        const card = document.querySelector("#sec > singbox-panel-card");
        const root = card.shadowRoot;
        return {
            chart: root.querySelectorAll(".chart").length,
            conn: root.querySelectorAll(".connections").length,
            speeds: root.querySelectorAll(".speeds").length,
            totals: root.querySelectorAll(".totals").length,
            groups: root.querySelectorAll(".group").length,
            header: root.querySelectorAll("h2").length,
        };
    });
    check(
        "sections: disabled blocks are hidden",
        sectionState.chart === 0 &&
            sectionState.conn === 0 &&
            sectionState.speeds === 0 &&
            sectionState.totals === 0 &&
            sectionState.groups === 0,
        JSON.stringify(sectionState)
    );
    check("sections: header survives", sectionState.header === 1);

    // -- unsupported backend -------------------------------------------------
    await page.evaluate(() => {
        window.__connectionsMode = "unsupported";
        const el = document.createElement("singbox-panel-card");
        el.setConfig({ title: "Unsupported" });
        const host = document.createElement("div");
        host.id = "unsup";
        host.appendChild(el);
        document.body.appendChild(host);
        el.hass = window.__fakeHass;
    });
    await page.waitForTimeout(400);
    const unsupText = await page.evaluate(() => {
        const card = document.querySelector("#unsup > singbox-panel-card");
        const note = card.shadowRoot.querySelector(".conn-empty");
        return note ? note.textContent.trim() : "";
    });
    check(
        "connections: unsupported backend note",
        unsupText.length > 0 && !/boom/i.test(unsupText),
        unsupText
    );
    await page.evaluate(() => {
        window.__connectionsMode = "ok";
    });


    // -- ping chips: a failed url-test is a chip, not a dialog ---------------
    await page.evaluate(() => {
        const st = window.__fakeHass.states;
        st["sensor.telaga_1_out_ping"] = {
            state: "unknown",
            attributes: { last_test_failed: true },
        };
        document.querySelector("#card singbox-panel-card").hass = window.__fakeHass;
    });
    await page.waitForTimeout(250);
    const failChip = page.locator("#card .node", { hasText: "telaga-1-out" }).locator(".ping");
    const failChipText = (await failChip.textContent()).trim();
    const failChipClass = await failChip.getAttribute("class");
    const failChipTitle = await failChip.getAttribute("title");
    check("failed url-test: x chip", failChipText === "\u2715", failChipText);
    check("failed url-test: fail class", (failChipClass || "").includes("fail"), failChipClass);
    check(
        "failed url-test: localized title",
        /Тест не прошёл/.test(failChipTitle || ""),
        failChipTitle
    );

    // A sensor that was never tested (unknown, no flag) keeps the grey dash.
    await page.evaluate(() => {
        window.__fakeHass.states["sensor.telaga_2_out_ping"] = {
            state: "unknown",
            attributes: {},
        };
        document.querySelector("#card singbox-panel-card").hass = window.__fakeHass;
    });
    await page.waitForTimeout(250);
    const untestedChip = page
        .locator("#card .node", { hasText: "telaga-2-out" })
        .locator(".ping");
    check(
        "never tested: dash chip",
        (await untestedChip.textContent()).trim() === "\u2014",
        await untestedChip.textContent()
    );
    check(
        "never tested: none class",
        ((await untestedChip.getAttribute("class")) || "").includes("none"),
        await untestedChip.getAttribute("class")
    );

    // -- live pings over websocket (no ping sensors at all) ------------------
    const liveChips = await page.evaluate(async () => {
        // history recording off: the integration creates no ping sensors
        window.__foreignRegistry = [
            {
                entity_id: "sensor.singbox_version",
                platform: "singbox",
                unique_id: "abc123_version",
            },
            {
                entity_id: "select.telaga_out",
                platform: "singbox",
                unique_id: "abc123_group_telaga-out",
            },
        ];
        window.__statusProxies = [
            {
                tag: "telaga-1-out",
                type: "shadowsocks",
                delay: 77,
                test_time: Date.now(),
                failed: false,
            },
            {
                tag: "telaga-2-out",
                type: "shadowsocks",
                delay: 0,
                test_time: Date.now(),
                failed: true,
            },
            // a standalone outbound (a VPN interface): with no ping sensor it
            // must still show up in the Outbound block, from the command alone
            {
                tag: "wg-interface",
                type: "wireguard",
                delay: 42,
                test_time: Date.now(),
                failed: false,
            },
        ];
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "Live" });
        const host = document.createElement("div");
        host.id = "live";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        // one status poll tick (the card polls at 2 s when unthrottled)
        await new Promise((r) => setTimeout(r, 2600));
        return [...card.shadowRoot.querySelectorAll(".node")].map((n) => {
            const ping = n.querySelector(".ping");
            return {
                name: n.querySelector(".node-name").textContent.trim(),
                text: ping ? ping.textContent.trim() : null,
                cls: ping ? ping.getAttribute("class") : null,
            };
        });
    });
    const liveOk = liveChips.find((n) => n.name === "telaga-1-out");
    const liveFail = liveChips.find((n) => n.name === "telaga-2-out");
    check(
        "websocket ping: delay chip without sensors",
        liveOk && liveOk.text === "77 ms",
        JSON.stringify(liveOk)
    );
    check(
        "websocket ping: good class",
        liveOk && (liveOk.cls || "").includes("good"),
        JSON.stringify(liveOk)
    );
    check(
        "websocket ping: failed chip",
        liveFail && liveFail.text === "\u2715",
        JSON.stringify(liveFail)
    );
    check(
        "websocket ping: fail class",
        liveFail && (liveFail.cls || "").includes("fail"),
        JSON.stringify(liveFail)
    );
    const liveStandalone = liveChips.find((n) => n.name === "wg-interface");
    check(
        "websocket: standalone outbound without sensors",
        liveStandalone && liveStandalone.text === "42 ms",
        JSON.stringify(liveStandalone)
    );
    check(
        "websocket: group members are not duplicated as standalone",
        liveChips.filter((n) => n.name === "telaga-1-out").length === 1,
        JSON.stringify(liveChips.map((n) => n.name))
    );

    // An older integration has no singbox/status: the card must log the fact
    // once, stop polling, and keep drawing the sensor chips.
    const oldIntegration = await page.evaluate(async () => {
        window.__statusMode = "unknown";
        window.__foreignRegistry = null;
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "Old" });
        const host = document.createElement("div");
        host.id = "old";
        host.appendChild(card);
        document.body.appendChild(host);
        let warns = 0;
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (String(args[0]).includes("singbox/status")) warns += 1;
        };
        card.hass = window.__fakeHass;
        // Every card already on the page attempts the command once as well, so
        // let them all settle, then prove the warnings stop for good.
        await new Promise((r) => setTimeout(r, 3000));
        const settled = warns;
        await new Promise((r) => setTimeout(r, 2500));
        console.warn = originalWarn;
        return {
            warned: settled >= 1,
            warnedAgain: warns !== settled,
            supported: card._statusSupported,
            timer: Boolean(card._statusTimer),
            chips: [...card.shadowRoot.querySelectorAll(".ping")].map((p) =>
                p.textContent.trim()
            ),
        };
    });
    check(
        "old integration: warns once, then silent",
        oldIntegration.warned === true && oldIntegration.warnedAgain === false,
        JSON.stringify(oldIntegration)
    );
    check(
        "old integration: stops polling",
        oldIntegration.supported === false && oldIntegration.timer === false,
        JSON.stringify(oldIntegration)
    );
    check(
        "old integration: sensor chips intact",
        oldIntegration.chips.includes("180 ms"),
        JSON.stringify(oldIntegration.chips)
    );
    await page.evaluate(() => {
        window.__statusMode = "ok";
        window.__foreignRegistry = null;
        window.__statusProxies = [];
    });


    // -- per-outbound traffic (singbox/status "traffic" block) ---------------
    // Real numbers from the production router, in bytes per second. Two tags
    // carry spaces and a colon on purpose: the card must put them in the DOM
    // as text, never as markup.
    const TRAFFIC_FIXTURE = {
        available: true,
        now: "2026-11-16T22:00:00+03:00",
        outbounds: {
            "telaga-out": { up: 4100, down: 447000 },
            "telaga-urltest-out": { up: 4100, down: 447000 },
            "eu vless: EU2": { up: 980, down: 116085 },
            "main-out": { up: 120, down: 2200 },
            "EU2-out": { up: 0, down: 0 },
            "youtube-out": { up: 55, down: 10400 },
        },
        total: { up: 5255, down: 565685 },
    };
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    // (а)(б)(в) block, ordering, total, per-node rates
    const traffic = await page.evaluate(async (fixture) => {
        window.__statusTraffic = fixture;
        window.__statusProxies = [
            { tag: "telaga-out", type: "Selector", delay: 120, test_time: 1, failed: false },
            { tag: "main-out", type: "VLESS", delay: 90, test_time: 1, failed: false },
            { tag: "EU2-out", type: "VLESS", delay: 0, test_time: 0, failed: false },
        ];
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "Traffic" });
        const host = document.createElement("div");
        host.id = "traffic";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        // one status poll tick delivers the fixture
        await new Promise((r) => setTimeout(r, 2600));
        const root = card.shadowRoot;
        const rows = [...root.querySelectorAll("[data-traffic-row]")].map((row) => ({
            tag: row.querySelector(".traffic-tag").textContent,
            down: row.querySelector('[data-dir="down"]').textContent.trim(),
            up: row.querySelector('[data-dir="up"]').textContent.trim(),
            bar: row.querySelector(".traffic-bar i").style.width,
        }));
        const nodeRates = [...root.querySelectorAll("[data-rate-for]")].map((el) => ({
            tag: el.dataset.rateFor,
            text: el.textContent.replace(/\s+/g, " ").trim(),
        }));
        return {
            present: root.querySelectorAll(".traffic").length,
            title: root.querySelector(".traffic-title")?.textContent.trim(),
            total: root.querySelector(".traffic-total b")?.textContent.trim(),
            rows,
            nodeRates,
            nodes: root.querySelectorAll(".node").length,
        };
    }, TRAFFIC_FIXTURE);

    check(
        "traffic: block is drawn",
        traffic.present === 1 && traffic.title === "Трафик по outbound",
        JSON.stringify({ present: traffic.present, title: traffic.title })
    );
    check(
        "traffic: exactly top-5 rows",
        traffic.rows.length === 5,
        `${traffic.rows.length} rows: ${traffic.rows.map((r) => r.tag).join(", ")}`
    );
    check(
        "traffic: rows sorted by up+down",
        traffic.rows.map((r) => r.tag).join(" | ") ===
            "telaga-out | telaga-urltest-out | eu vless: EU2 | youtube-out | main-out",
        traffic.rows.map((r) => r.tag).join(" | ")
    );
    check(
        "traffic: tag with spaces and colon kept as text",
        traffic.rows.some((r) => r.tag === "eu vless: EU2"),
        JSON.stringify(traffic.rows.map((r) => r.tag))
    );
    check(
        "traffic: header shows the connection total, not the overlapping sum",
        traffic.total === "557.6 KiB/s",
        traffic.total
    );
    check(
        "traffic: biggest row is a full bar, next one is not",
        traffic.rows[0].bar === "100%" &&
            parseInt(traffic.rows[1].bar, 10) === 100 &&
            parseInt(traffic.rows[2].bar, 10) > 0 &&
            parseInt(traffic.rows[2].bar, 10) < 100,
        JSON.stringify(traffic.rows.map((r) => r.bar))
    );
    check(
        "traffic: row shows both directions",
        traffic.rows[0].down.includes("KiB/s") && /B\/s/.test(traffic.rows[0].up),
        JSON.stringify(traffic.rows[0])
    );
    check(
        "traffic: every node carries a rate line with both arrows",
        traffic.nodeRates.length === traffic.nodes &&
            traffic.nodeRates.every((r) => /↓/.test(r.text) && /↑/.test(r.text)),
        JSON.stringify(traffic.nodeRates.slice(0, 3))
    );

    // (в cont.) live update: numbers move in place, the DOM nodes do not
    const trafficLive = await page.evaluate(async () => {
        const card = document.querySelector("#traffic > singbox-panel-card");
        const root = card.shadowRoot;
        const nodeBefore = root.querySelector(".node");
        const rateElBefore = root.querySelector('[data-rate-for="telaga-out"]');
        card.setConfig({ title: "Traffic", update_interval: 30 });
        window.__statusTraffic = {
            available: true,
            now: "2026-11-16T22:00:01+03:00",
            outbounds: {
                "telaga-out": { up: 4100, down: 447000 },
                "main-out": { up: 999, down: 999 },
            },
        };
        await new Promise((r) => setTimeout(r, 1500));
        return {
            sameNode: nodeBefore === root.querySelector(".node"),
            sameRate: rateElBefore === root.querySelector('[data-rate-for="telaga-out"]'),
            mainOut: root
                .querySelector('[data-rate-for="main-out"]')
                .textContent.replace(/\s+/g, " ").trim(),
        };
    });
    check(
        "traffic: refresh patches the DOM instead of repainting",
        trafficLive.sameNode === true && trafficLive.sameRate === true,
        JSON.stringify(trafficLive)
    );
    check(
        "traffic: numbers actually moved",
        /999 B\/s/.test(trafficLive.mainOut) && trafficLive.mainOut.includes("↓"),
        trafficLive.mainOut
    );

    // (б cont.) an answer with traffic but without the "total" key: the header
    // must fall back to the sum over every outbound, not stay empty.
    const noTotalKey = await page.evaluate(async (fixture) => {
        const { total, ...withoutTotal } = fixture;
        window.__statusTraffic = withoutTotal;
        window.__statusProxies = [
            { tag: "main-out", type: "VLESS", delay: 90, test_time: 1, failed: false },
        ];
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "NoTotal" });
        const host = document.createElement("div");
        host.id = "nototal";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        await new Promise((r) => setTimeout(r, 2600));
        const root = card.shadowRoot;
        return {
            total: root.querySelector(".traffic-total b")?.textContent.trim(),
            rows: root.querySelectorAll("[data-traffic-row]").length,
        };
    }, TRAFFIC_FIXTURE);
    check(
        "traffic: no total key falls back to the per-outbound sum",
        noTotalKey.total === "1,007.9 KiB/s" && noTotalKey.rows === 5,
        JSON.stringify(noTotalKey)
    );

    // (г) old integration: no "traffic" key at all
    const noTrafficKey = await page.evaluate(async () => {
        window.__statusTraffic = null;
        window.__statusProxies = [
            { tag: "main-out", type: "VLESS", delay: 90, test_time: 1, failed: false },
        ];
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "NoTraffic" });
        const host = document.createElement("div");
        host.id = "notraffic";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        await new Promise((r) => setTimeout(r, 2600));
        const root = card.shadowRoot;
        return {
            blocks: root.querySelectorAll(".traffic").length,
            rates: root.querySelectorAll(".node-rate").length,
            nodes: root.querySelectorAll(".node").length,
        };
    });
    check(
        "traffic: old integration draws nothing and still shows nodes",
        noTrafficKey.blocks === 0 &&
            noTrafficKey.rates === 0 &&
            noTrafficKey.nodes > 0,
        JSON.stringify(noTrafficKey)
    );

    // (д) backend that cannot report counters (gRPC): available = false
    const unavailable = await page.evaluate(async () => {
        window.__statusTraffic = {
            available: false,
            now: "2026-11-16T22:00:00+03:00",
            outbounds: { "main-out": { up: 120, down: 2200 } },
            total: { up: 120, down: 2200 },
        };
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "Unavailable" });
        const host = document.createElement("div");
        host.id = "unavail";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        await new Promise((r) => setTimeout(r, 2600));
        const root = card.shadowRoot;
        return {
            blocks: root.querySelectorAll(".traffic").length,
            rates: root.querySelectorAll(".node-rate").length,
            nodes: root.querySelectorAll(".node").length,
        };
    });
    check(
        "traffic: available=false draws nothing",
        unavailable.blocks === 0 &&
            unavailable.rates === 0 &&
            unavailable.nodes > 0,
        JSON.stringify(unavailable)
    );

    // (е) the editor switch hides it
    const trafficOff = await page.evaluate(async (fixture) => {
        window.__statusTraffic = fixture;
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "TrafficOff", show_traffic: false });
        const host = document.createElement("div");
        host.id = "trafficoff";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        await new Promise((r) => setTimeout(r, 2600));
        const root = card.shadowRoot;
        return {
            blocks: root.querySelectorAll(".traffic").length,
            rates: root.querySelectorAll(".node-rate").length,
            nodes: root.querySelectorAll(".node").length,
        };
    }, TRAFFIC_FIXTURE);
    check(
        "traffic: show_traffic=false hides block and node rates",
        trafficOff.blocks === 0 &&
            trafficOff.rates === 0 &&
            trafficOff.nodes > 0,
        JSON.stringify(trafficOff)
    );
    check(
        "traffic: no page errors while switching traffic on and off",
        pageErrors.length === 0,
        JSON.stringify(pageErrors)
    );
    check(
        "traffic: editor exposes the show_traffic switch",
        await page.evaluate(async () => {
            const editor = document.createElement("singbox-panel-card-editor");
            editor.setConfig({});
            editor.hass = window.__fakeHass;
            const host = document.createElement("div");
            host.id = "editorTraffic";
            host.appendChild(editor);
            document.body.appendChild(host);
            await new Promise((r) => setTimeout(r, 200));
            const labels = [...editor.shadowRoot.querySelectorAll(".row .label")];
            const idx = labels.findIndex((l) => /Трафик по outbound/.test(l.textContent));
            const switches = [...editor.shadowRoot.querySelectorAll(".row ha-switch")];
            return idx >= 0 && switches[idx] && switches[idx].checked === true;
        }),
        "switch present and on by default"
    );

    // The cards above are still mounted and poll the shared fake backend, so
    // they must go before the poll-lifecycle checks count calls globally.
    await page.evaluate(() => {
        for (const id of ["traffic", "nototal", "notraffic", "unavail", "trafficoff", "editorTraffic"]) {
            document.getElementById(id)?.remove();
        }
        window.__statusTraffic = null;
        window.__statusProxies = [];
    });
    await page.waitForTimeout(200);

    // -- the status poll starts and stops with the card ----------------------
    const statusLifecycle = await page.evaluate(async () => {
        let calls = 0;
        const originalCall = window.__fakeHass.callWS.bind(window.__fakeHass);
        window.__fakeHass.callWS = async (msg) => {
            if (msg.type === "singbox/status") calls += 1;
            return originalCall(msg);
        };
        const card = document.createElement("singbox-panel-card");
        card.setConfig({ title: "Life", update_interval: 1 });
        const host = document.createElement("div");
        host.id = "life";
        host.appendChild(card);
        document.body.appendChild(host);
        card.hass = window.__fakeHass;
        await new Promise((r) => setTimeout(r, 3500));
        const whileAttached = calls;
        host.removeChild(card);
        await new Promise((r) => setTimeout(r, 250));
        const timerAfterRemove = Boolean(card._statusTimer);
        const baseline = calls;
        await new Promise((r) => setTimeout(r, 2500));
        const afterDetach = calls - baseline;
        host.appendChild(card);
        await new Promise((r) => setTimeout(r, 1500));
        const timerOnReattach = Boolean(card._statusTimer);
        window.__fakeHass.callWS = originalCall;
        return { whileAttached, timerAfterRemove, afterDetach, timerOnReattach };
    });
    check(
        "status poll: runs while attached",
        statusLifecycle.whileAttached >= 2,
        JSON.stringify(statusLifecycle)
    );
    check(
        "status poll: timer cleared on disconnect",
        statusLifecycle.timerAfterRemove === false,
        JSON.stringify(statusLifecycle)
    );
    check(
        "status poll: silent after disconnect",
        statusLifecycle.afterDetach === 0,
        JSON.stringify(statusLifecycle)
    );
    check(
        "status poll: resumes on reconnect",
        statusLifecycle.timerOnReattach === true,
        JSON.stringify(statusLifecycle)
    );

    await page.screenshot({ path: "tests/stand.png", fullPage: true });
    console.log("  screenshot: tests/stand.png");
} finally {
    await browser.close();
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
    console.log(`\nFAILED: ${failed.length}/${results.length} checks`);
    process.exit(1);
}
console.log(`\nAll ${results.length} render checks passed.`);