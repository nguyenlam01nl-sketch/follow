import express from "express";
import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs/promises";

dotenv.config();
puppeteer.use(StealthPlugin());

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 3001);
const SCRAPER_TOKEN = process.env.SCRAPER_TOKEN || "super_secret_scraper_token";
const USER_DATA_DIR =
  process.env.PUPPETEER_USER_DATA_DIR ||
  "/var/www/follow/chrome-profile-puppeteer";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("@")) return `https://www.tiktok.com/${value}`;

  return `https://www.tiktok.com/@${value.replace(/^@/, "")}`;
}

async function maybeLoadCookies(browser, url) {
  const cookieFile = "/var/www/follow/scraper-server/tiktok-cookies.json";

  try {
    const raw = await fs.readFile(cookieFile, "utf8");
    const cookies = JSON.parse(raw);

    if (Array.isArray(cookies) && cookies.length > 0) {
      await browser.setCookie(
        ...cookies.map((c) => ({
          ...c,
          domain: c.domain || ".tiktok.com",
        }))
      );
    }
  } catch {
    // Không có file cookie thì bỏ qua
  }
}

async function scrapeTikTokProfile(url) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: USER_DATA_DIR,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1366,768",
    ],
    defaultViewport: {
      width: 1366,
      height: 768,
    },
  });

  try {
    await maybeLoadCookies(browser, url);

    const pages = await browser.pages();
    const page = pages[0] || (await browser.newPage());

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await sleep(5000);

    await page.evaluate(() => {
      window.scrollBy(0, 1800);
    });

    await sleep(2500);

    const html = (await page.content()).toLowerCase();
    const bodyText = (
      (await page.$eval("body", (el) => el.innerText).catch(() => "")) || ""
    ).toLowerCase();

    const blocked =
      html.includes("captcha") ||
      html.includes("verify") ||
      bodyText.includes("captcha") ||
      bodyText.includes("verify") ||
      bodyText.includes("log in") ||
      bodyText.includes("login to tiktok");

    if (blocked) {
      throw new Error(
        "TikTok vẫn chặn ở mode local-like. Có thể cần cookie/profile hợp lệ thay vì proxy."
      );
    }

    const data = await page.evaluate(() => {
      const get = (sel) =>
        document.querySelector(sel)?.textContent?.trim() || "";

      const posts = Array.from(
        document.querySelectorAll('[data-e2e="user-post-item"]')
      )
        .map((el, i) => ({
          id: `tt_${i + 1}`,
          url: el.querySelector("a")?.href || "",
          thumbnail: el.querySelector("img")?.src || "",
          viewsText:
            el.querySelector('[data-e2e="video-views"]')?.textContent || "",
        }))
        .filter((p) => p.url)
        .slice(0, 10);

      return {
        name: get('[data-e2e="user-title"]') || get("h1"),
        username: get('[data-e2e="user-subtitle"]'),
        followers: get('[data-e2e="followers-count"]'),
        likes: get('[data-e2e="likes-count"]'),
        posts,
      };
    });

    return {
      platform: "tiktok",
      profile: {
        name: data.name || "",
        username: String(data.username || "").replace(/^@/, ""),
        followers: parseCount(data.followers),
        likes: parseCount(data.likes),
      },
      posts: data.posts.map((p) => ({
        id: p.id,
        url: p.url,
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