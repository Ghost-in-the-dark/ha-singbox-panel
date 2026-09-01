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
    check("two groups", groups === 2, `${groups} groups`);
    check(
        "group names",
        (await page.locator(".group").nth(0).locator(".group-name").textContent()) ===
            "telaga-out" &&
            (await page.locator(".group").nth(1).locator(".group-name").textContent()) ===
                "Ru-out"
    );

    const nodes = await page.locator(".node").count();
    check("seven nodes", nodes === 7, `${nodes} nodes`);

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
                c.data.outbound_tag === "telaga-1-out"
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
            (c) => c.service === "url_test" && c.data.outbound_tag === "telaga-1-out"
        ),
        JSON.stringify(calls)
    );
    check("node ping button disabled while running", await nodePingBtn.isDisabled());

    const firstTestBtn = page.locator(".group").nth(0).locator(".test-btn");
    await firstTestBtn.click();
    await page.waitForTimeout(150);
    calls = await page.evaluate(() => window.__calls);
    check(
        "click test -> url_test",
        calls.some((c) => c.service === "url_test" && c.data.outbound_tag === "telaga-out"),
        JSON.stringify(calls)
    );
    check("test button disabled while running", await firstTestBtn.isDisabled());

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
