const { chromium } = require("C:/projects/work/tandem/dtprototype-3d65b675/node_modules/playwright");
const path = require("path");
(async () => {
  const widths = (process.argv[2] || "1366").split(",").map(Number);
  const browser = await chromium.launch({ executablePath: process.env.LOCALAPPDATA + "/ms-playwright/chromium-1148/chrome-win/chrome.exe" });
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(require("url").pathToFileURL(path.resolve("preview.html")).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `shots/w${w}.png`, fullPage: true });
    console.log(w, "horizontal overflow:", overflow);
  }
  await browser.close();
})();
