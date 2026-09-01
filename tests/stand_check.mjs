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
        totals.length === 4 && totals[0].includes("MiB") && totals[1].includes("MiB"),
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

    const activeNodes = await page.locator(".node.active .node-name").allTextContents();
    check(
        "active nodes",
        activeNodes.length === 2 &&
            activeNodes.includes("telaga-urltest-out") &&
            activeNodes.includes("Ru-2-out"),
        activeNodes.join(", ")
    );

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
    check(
        "click test -> url_test",
        calls.some(
            (c) =>
                c.service === "url_test" &&
                c.data.outbound_tag === "telaga-out" &&
                c.data.entity_id === "select.telaga_out"
        ),
        JSON.stringify(calls)
    );
    check("test button disabled while running", await firstTestBtn.isDisabled());

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
