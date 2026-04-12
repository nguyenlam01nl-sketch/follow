import playwright from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

playwright.use(stealth());

async function scrapeTikTokProfile(url) {
  const browser = await playwright.chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
    locale: "en-US",
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // chờ thêm để load script
    await page.waitForTimeout(4000);

    // detect block
    const html = await page.content();
    if (
      html.includes("login") ||
      html.includes("verify") ||
      html.includes("captcha")
    ) {
      throw new Error("TikTok chặn (cần proxy hoặc IP sạch hơn)");
    }

    // scroll
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const get = (sel) =>
        document.querySelector(sel)?.textContent?.trim() || "";

      const posts = Array.from(
        document.querySelectorAll('[data-e2e="user-post-item"]')
      )
        .map((el, i) => {
          const link = el.querySelector("a")?.href || "";
          const img = el.querySelector("img")?.src || "";
          const views =
            el.querySelector('[data-e2e="video-views"]')?.textContent || "";

          return {
            id: i + 1,
            url: link,
            thumbnail: img,
            viewsText: views,
          };
        })
        .filter((p) => p.url)
        .slice(0, 10);

      return {
        name: get('[data-e2e="user-title"]'),
        username: get('[data-e2e="user-subtitle"]'),
        followers: get('[data-e2e="followers-count"]'),
        likes: get('[data-e2e="likes-count"]'),
        posts,
      };
    });

    return {
      platform: "tiktok",
      profile: {
        name: data.name,
        username: data.username.replace("@", ""),
        followers: parseCount(data.followers),
        likes: parseCount(data.likes),
      },
      posts: data.posts.map((p) => ({
        url: p.url,
        thumbnail: p.thumbnail,
        views: parseCount(p.viewsText),
      })),
    };
  } finally {
    await browser.close();
  }
}