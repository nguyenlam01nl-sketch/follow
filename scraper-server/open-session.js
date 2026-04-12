import { chromium } from "playwright";

const context = await chromium.launchPersistentContext("./playwright-user-data", {
  headless: false,
  viewport: { width: 1440, height: 1600 },
  locale: "en-US",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
});

const page = context.pages()[0] || await context.newPage();

await page.goto("https://www.tiktok.com/@solavietnam.com", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

console.log("Đã mở TikTok. Hãy login/xác minh xong rồi đóng hẳn browser.");