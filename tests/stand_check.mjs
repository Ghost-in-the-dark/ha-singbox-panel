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
