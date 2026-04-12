import express from "express";
import dotenv from "dotenv";
import playwright from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

dotenv.config();
playwright.use(stealth());

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 3001);
const SCRAPER_TOKEN = process.env.SCRAPER_TOKEN || "super_secret_scraper_token";

function parseCount(value = "") {
  const raw = String(value).trim().toUpperCase().replace(/,/g, "");
  if (!raw) return 0;

  if (raw.endsWith("K")) return Math.round(parseFloat(raw) * 1_000);
  if (raw.endsWith("M")) return Math.round(parseFloat(raw) * 1_000_000);
  if (raw.endsWith("B")) return Math.round(parseFloat(raw) * 1_000_000_000);

  const n = Number(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function normalizeTikTokUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("@")) {
    return `https://www.tiktok.com/${value}`;
  }

  if (value.includes("tiktok.com/")) {
    return `https://${value.replace(/^https?:\/\//, "")}`;
  }

  return `https://www.tiktok.com/@${value.replace(/^@/, "")}`;
}

async function scrapeTikTokProfile(url) {
  const browser = await playwright.chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
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
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(4000);

    const html = (await page.content()).toLowerCase();
    const bodyText = (
      (await page.locator("body").innerText().catch(() => "")) || ""
    ).toLowerCase();

    const blocked =
      html.includes("captcha") ||
      html.includes("verify") ||
      bodyText.includes("captcha") ||
      bodyText.includes("verify") ||
      bodyText.includes("log in") ||
      bodyText.includes("login to tiktok");

    if (blocked) {
      throw new Error("TikTok chặn, cần proxy hoặc IP sạch hơn");
    }

    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const get = (sel) =>
        document.querySelector(sel)?.textContent?.trim() || "";

      const attr = (el, name) => el?.getAttribute?.(name)?.trim?.() || "";

      const posts = Array.from(
        document.querySelectorAll('[data-e2e="user-post-item"]')
      )
        .map((el, i) => {
          const linkEl = el.querySelector("a[href]");
          const imgEl = el.querySelector("img");
          const viewsEl = el.querySelector('[data-e2e="video-views"]');

          return {
            id: `tt_${i + 1}`,
            url: attr(linkEl, "href"),
            thumbnail: attr(imgEl, "src"),
            viewsText: viewsEl?.textContent?.trim() || "",
          };
        })
        .filter((p) => p.url)
        .slice(0, 10);

      return {
        name: get('[data-e2e="user-title"]') || get("h1"),
        username: get('[data-e2e="user-subtitle"]'),
        bio:
          get('[data-e2e="user-bio"]') ||
          get('[data-e2e="user-bio-description"]'),
        followers: get('[data-e2e="followers-count"]'),
        following: get('[data-e2e="following-count"]'),
        likes: get('[data-e2e="likes-count"]'),
        posts,
      };
    });

    return {
      platform: "tiktok",
      profile: {
        name: data.name || "",
        username: String(data.username || "").replace(/^@/, ""),
        bio: data.bio || "",
        followers: parseCount(data.followers),
        following: parseCount(data.following),
        likes: parseCount(data.likes),
        posts_count: data.posts.length,
      },
      posts: data.posts.map((p) => ({
        id: p.id,
        url: p.url.startsWith("http") ? p.url : `https://www.tiktok.com${p.url}`,
        thumbnail: p.thumbnail,
        views: parseCount(p.viewsText),
      })),
    };
  } finally {
    await browser.close();
  }
}

app.post("/scrape/tiktok", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    if (auth !== `Bearer ${SCRAPER_TOKEN}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const inputUrl = String(req.body?.url || "").trim();
    if (!inputUrl) {
      return res.status(422).json({ message: "Missing url" });
    }

    const url = normalizeTikTokUrl(inputUrl);
    const data = await scrapeTikTokProfile(url);

    return res.json(data);
  } catch (error) {
    console.error("scrape/tiktok error:", error);

    return res.status(500).json({
      message: "Scrape error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Scraper service running on :${PORT}`);
});