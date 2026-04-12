import express from "express";
import dotenv from "dotenv";
import { chromium } from "playwright";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 3001);
const SCRAPER_TOKEN = process.env.SCRAPER_TOKEN || "super_secret_scraper_token";
const CDP_URL = process.env.CHROME_CDP_URL || "http://127.0.0.1:9222";

function parseCount(value = "") {
  const raw = String(value).trim().toUpperCase().replace(/,/g, "");
  if (!raw) return 0;
  if (raw.endsWith("K")) return Math.round(parseFloat(raw) * 1_000);
  if (raw.endsWith("M")) return Math.round(parseFloat(raw) * 1_000_000);
  if (raw.endsWith("B")) return Math.round(parseFloat(raw) * 1_000_000_000);

  const n = Number(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function absoluteTikTokUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://www.tiktok.com${url}`;
  return url;
}

function extractUsername(url) {
  const match = String(url).match(/@([^/?]+)/);
  return match ? match[1] : null;
}

async function getPageFromOpenChrome() {
  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0] || (await browser.newContext());
  const page = context.pages()[0] || (await context.newPage());
  return { browser, page };
}

async function scrapeTikTokProfile(url) {
  const { browser, page } = await getPageFromOpenChrome();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => null);

    const pageText = (await page.locator("body").innerText().catch(() => "")).toLowerCase();

    const blocked =
      pageText.includes("verify") ||
      pageText.includes("captcha") ||
      pageText.includes("log in") ||
      pageText.includes("login");

    if (blocked) {
      throw new Error(
        "Chrome đang mở nhưng TikTok vẫn yêu cầu xác minh/đăng nhập. Hãy xử lý trực tiếp trong cửa sổ Chrome đang mở ở port 9222 rồi gọi lại."
      );
    }

    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 2200);
    await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
  const text = (sel) =>
    document.querySelector(sel)?.textContent?.trim() || "";

  const attr = (el, name) => el?.getAttribute?.(name)?.trim?.() || "";

  const posts = Array.from(
    document.querySelectorAll('#user-post-item-list [data-e2e="user-post-item"]')
  )
    .map((item, index) => {
      const root = item.closest("div") || item;
      const linkEl = item.querySelector("a[href]");
      const imgEl = root.querySelector("picture img") || item.querySelector("img");
      const sourceEl = root.querySelector("picture source");
      const viewsEl =
        root.querySelector('strong[data-e2e="video-views"]') ||
        item.querySelector('strong[data-e2e="video-views"]');

      const href = attr(linkEl, "href");
      const imgSrc = attr(imgEl, "src");
      const imgAlt = attr(imgEl, "alt");
      const sourceSrcset = attr(sourceEl, "srcset");
      const viewText = viewsEl?.textContent?.trim() || "";

      const firstSrcsetUrl = sourceSrcset
        ? sourceSrcset.split(",")[0]?.trim().split(" ")[0] || ""
        : "";

      return {
        id: `tt_${index + 1}`,
        url: href,
        title: imgAlt || `TikTok post ${index + 1}`,
        thumbnail: imgSrc || firstSrcsetUrl || "",
        viewsText: viewText,
        likes: 0,
        comments: 0,
        is_pinned:
          item.textContent?.toLowerCase().includes("pinned") ||
          item.textContent?.toLowerCase().includes("đã ghim") ||
          false,
      };
    })
    .filter((p) => p.url || p.thumbnail)
    .slice(0, 12);

  const uniquePosts = [];
  const seen = new Set();

  for (const post of posts) {
    const key = post.url || `${post.title}_${post.thumbnail}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePosts.push(post);
    }
  }

  const canonical =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";

  const usernameFromCanonical = canonical.match(/tiktok\.com\/@([^/?]+)/i)?.[1] || "";
  const usernameFromPath = location.pathname.match(/^\/@([^/]+)/)?.[1] || "";

  const profile = {
    name:
      text('[data-e2e="user-title"]') ||
      text("h1") ||
      usernameFromCanonical ||
      usernameFromPath ||
      "",
    username:
      (
        text('[data-e2e="user-subtitle"]') ||
        (usernameFromCanonical ? `@${usernameFromCanonical}` : "") ||
        (usernameFromPath ? `@${usernameFromPath}` : "")
      ).replace(/^@/, ""),
    avatar:
      document.querySelector('[data-e2e="user-avatar"] img')?.getAttribute("src") ||
      "",
    bio:
      text('[data-e2e="user-bio"]') ||
      text('[data-e2e="user-bio-description"]') ||
      "",
    followersText: text('[data-e2e="followers-count"]'),
    followingText: text('[data-e2e="following-count"]'),
    likesText: text('[data-e2e="likes-count"]'),
  };

  return { profile, posts: uniquePosts };
});

    if (!data.posts.length) {
      throw new Error("Không lấy được post nào từ Chrome đang mở.");
    }

    return {
      platform: "tiktok",
      profile: {
        name: data.profile.name || extractUsername(url) || "",
        username: data.profile.username || extractUsername(url) || "",
        avatar: absoluteTikTokUrl(data.profile.avatar || ""),
        bio: data.profile.bio || "",
        followers: parseCount(data.profile.followersText),
        following: parseCount(data.profile.followingText),
        likes: parseCount(data.profile.likesText),
        posts_count: data.posts.length,
      },
      posts: data.posts.map((post) => ({
        id: post.id,
        url: absoluteTikTokUrl(post.url),
        title: post.title || "TikTok post",
        thumbnail: absoluteTikTokUrl(post.thumbnail),
        views: parseCount(post.viewsText),
        likes: 0,
        comments: 0,
        is_pinned: Boolean(post.is_pinned),
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

    const url = String(req.body?.url || "").trim();
    if (!url) {
      return res.status(422).json({ message: "Missing url" });
    }

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