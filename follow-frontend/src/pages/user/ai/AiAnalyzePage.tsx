import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  Search,
  Sparkles,
  Link as LinkIcon,
  Video,
  Music2,
  BarChart3,
  Lightbulb,
  Rocket,
  AlertTriangle,
  ClipboardList,
  Users,
  Heart,
  Eye,
  BadgeCheck,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Clock3,
  Hash,
  Volume2,
  Target,
  Layers3,
} from "lucide-react";

type PlatformType = "tiktok" | "unknown";

type AnalyzePostAction =
  | "increase_like"
  | "increase_view"
  | "increase_comment"
  | "keep_natural";

type ProfileData = {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  likes?: number;
  posts_count?: number;
};

type PostData = {
  id?: string | number;
  title?: string;
  thumbnail?: string;
  views?: number;
  likes?: number;
  comments?: number;
  is_pinned?: boolean;
  url?: string;
};

type PostRecommendation = {
  title: string;
  views?: number;
  action: AnalyzePostAction;
  reason: string;
};

type ContentPillar = {
  pillar?: string;
  description?: string;
  priority?: string;
};

type ChannelPositioning = {
  main_theme?: string;
  target_audience?: string;
  strongest_signal?: string;
  weakest_signal?: string;
};

type PostingStrategy = {
  videos_per_week?: string;
  best_time_slots?: string[];
  formats_to_test?: string[];
};

type GrowthAction = {
  title?: string;
  current_views?: number;
  suggested_target_range?: string;
  reason?: string;
};

type HashtagStrategy = {
  core_hashtags?: string[];
  niche_hashtags?: string[];
  branded_hashtags?: string[];
};

type AudioStrategy = {
  should_use_trending_audio?: string;
  recommended_audio_styles?: string[];
  notes?: string;
};

type AnalyzeResult = {
  platform?: PlatformType;
  account_name?: string;
  account_url?: string;
  summary?: string;
  mentor_note?: string;
  health_score?: number;
  issues?: string[];
  opportunities?: string[];
  plan_7_days?: string[];
  service_suggestions?: string[];
  profile?: ProfileData;
  posts?: PostData[];
  account_summary?: string;
  channel_diagnosis?: string[];
  post_recommendations?: PostRecommendation[];
  final_strategy?: string[];
  channel_positioning?: ChannelPositioning;
  content_pillars?: ContentPillar[];
  posting_strategy?: PostingStrategy;
  growth_actions?: GrowthAction[];
  hashtag_strategy?: HashtagStrategy;
  audio_strategy?: AudioStrategy;
};

const platformCards = [
  {
    key: "tiktok",
    label: "TikTok",
    icon: Music2,
    color: "text-cyan-300",
    badge: "bg-cyan-400/10 text-cyan-200",
    desc: "Phân tích kênh TikTok, định vị nội dung, video gần đây và cơ hội tăng trưởng.",
  },
] as const;

function normalizeFullUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function detectPlatform(url: string): PlatformType {
  const lower = url.toLowerCase();

  if (lower.includes("tiktok.com")) return "tiktok";

  return "unknown";
}

function isFullUrl(value: string): boolean {
  const lower = value.trim().toLowerCase();

  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.includes("tiktok.com")
  );
}

function getPlatformMeta(platform: string) {
  return (
    platformCards.find((item) => item.key === platform) || {
      key: "unknown",
      label: "Chưa xác định",
      icon: LinkIcon,
      color: "text-white/80",
      badge: "bg-white/10 text-white/80",
      desc: "Dán link TikTok đầy đủ để hệ thống nhận diện.",
    }
  );
}

function formatCompactNumber(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "0";

  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;

  return `${value}`;
}

function getActionMeta(action: AnalyzePostAction) {
  switch (action) {
    case "increase_like":
      return {
        label: "Nên tăng like",
        className: "bg-pink-400/10 text-pink-200 border-pink-400/20",
      };
    case "increase_view":
      return {
        label: "Nên tăng view",
        className: "bg-cyan-400/10 text-cyan-200 border-cyan-400/20",
      };
    case "increase_comment":
      return {
        label: "Nên tăng comment",
        className: "bg-amber-400/10 text-amber-200 border-amber-400/20",
      };
    default:
      return {
        label: "Giữ tự nhiên",
        className: "bg-white/10 text-white/75 border-white/15",
      };
  }
}

function toSafeString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value === null || value === undefined) return fallback;

  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function toSafeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return String(item);
      if (item === null || item === undefined) return "";
      try {
        return JSON.stringify(item);
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

function toSafeProfile(value: unknown): ProfileData {
  if (!value || typeof value !== "object") return {};

  const profile = value as Record<string, unknown>;

  return {
    name: toSafeString(profile.name),
    username: toSafeString(profile.username),
    avatar: toSafeString(profile.avatar),
    bio: toSafeString(profile.bio),
    followers: toSafeNumber(profile.followers, 0),
    following: toSafeNumber(profile.following, 0),
    likes: toSafeNumber(profile.likes, 0),
    posts_count: toSafeNumber(profile.posts_count, 0),
  };
}

function isValidImageUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;

  const v = value.trim().toLowerCase();

  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("data:image/")
  );
}

function toSafeId(value: unknown, fallback: string | number): string | number {
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function toSafePosts(value: unknown): PostData[] {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const post =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    const thumbnail = isValidImageUrl(post.thumbnail)
      ? String(post.thumbnail)
      : "";

    return {
      id: toSafeId(post.id, index),
      title: toSafeString(post.title, "Nội dung gần đây"),
      thumbnail,
      views: toSafeNumber(post.views, 0),
      likes: toSafeNumber(post.likes, 0),
      comments: toSafeNumber(post.comments, 0),
      is_pinned: Boolean(post.is_pinned),
      url: toSafeString(post.url),
    };
  });
}

function isValidAction(action: unknown): action is AnalyzePostAction {
  return (
    action === "increase_like" ||
    action === "increase_view" ||
    action === "increase_comment" ||
    action === "keep_natural"
  );
}

function toSafeRecommendations(value: unknown): PostRecommendation[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const rec =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    return {
      title: toSafeString(rec.title, "Nội dung"),
      views: toSafeNumber(rec.views, 0),
      action: isValidAction(rec.action) ? rec.action : "keep_natural",
      reason: toSafeString(
        rec.reason,
        "Hệ thống hiện chưa có khuyến nghị riêng cho nội dung này."
      ),
    };
  });
}

function toSafeContentPillars(value: unknown): ContentPillar[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const row =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    return {
      pillar: toSafeString(row.pillar),
      description: toSafeString(row.description),
      priority: toSafeString(row.priority),
    };
  });
}

function toSafeChannelPositioning(value: unknown): ChannelPositioning {
  if (!value || typeof value !== "object") return {};

  const row = value as Record<string, unknown>;

  return {
    main_theme: toSafeString(row.main_theme),
    target_audience: toSafeString(row.target_audience),
    strongest_signal: toSafeString(row.strongest_signal),
    weakest_signal: toSafeString(row.weakest_signal),
  };
}

function toSafePostingStrategy(value: unknown): PostingStrategy {
  if (!value || typeof value !== "object") return {};

  const row = value as Record<string, unknown>;

  return {
    videos_per_week: toSafeString(row.videos_per_week),
    best_time_slots: toStringArray(row.best_time_slots),
    formats_to_test: toStringArray(row.formats_to_test),
  };
}

function toSafeGrowthActions(value: unknown): GrowthAction[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const row =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    return {
      title: toSafeString(row.title),
      current_views: toSafeNumber(row.current_views, 0),
      suggested_target_range: toSafeString(row.suggested_target_range),
      reason: toSafeString(row.reason),
    };
  });
}

function toSafeHashtagStrategy(value: unknown): HashtagStrategy {
  if (!value || typeof value !== "object") return {};

  const row = value as Record<string, unknown>;

  return {
    core_hashtags: toStringArray(row.core_hashtags),
    niche_hashtags: toStringArray(row.niche_hashtags),
    branded_hashtags: toStringArray(row.branded_hashtags),
  };
}

function toSafeAudioStrategy(value: unknown): AudioStrategy {
  if (!value || typeof value !== "object") return {};

  const row = value as Record<string, unknown>;

  return {
    should_use_trending_audio: toSafeString(row.should_use_trending_audio),
    recommended_audio_styles: toStringArray(row.recommended_audio_styles),
    notes: toSafeString(row.notes),
  };
}

function renderHashtagPill(tags: string[]) {
  return tags.map((item, index) => (
    <span
      key={`${item}-${index}`}
      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-100"
    >
      {item}
    </span>
  ));
}

export default function AiAnalyzePage() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!inputValue.trim()) return "";
    return normalizeFullUrl(inputValue);
  }, [inputValue]);

  const detectedPlatform = useMemo(() => {
    if (!inputValue.trim()) return "unknown";
    return detectPlatform(previewUrl);
  }, [inputValue, previewUrl]);

  const selectedPlatform = getPlatformMeta(result?.platform || detectedPlatform);

  const safeAccountSummary = useMemo(() => {
    const text = result?.account_summary?.trim() || "";
    if (!text) return "";
    if (text.startsWith("{") || text.startsWith("[")) return "";
    return text;
  }, [result?.account_summary]);

  const handleAnalyze = async () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu liên kết",
        text: "Vui lòng nhập link TikTok đầy đủ để hệ thống phân tích.",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    if (!isFullUrl(trimmed)) {
      Swal.fire({
        icon: "warning",
        title: "Phải nhập link TikTok đầy đủ",
        text: "Ví dụ: https://www.tiktok.com/@tenkenh",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    const finalUrl = normalizeFullUrl(trimmed);
    const finalPlatform = detectPlatform(finalUrl);

    if (finalPlatform === "unknown") {
      Swal.fire({
        icon: "warning",
        title: "Link chưa hỗ trợ",
        text: "Hiện tại hệ thống chỉ hỗ trợ phân tích link TikTok.",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    const confirmBefore = await Swal.fire({
      title: "Xác nhận bắt đầu phân tích?",
      text: "Hệ thống sẽ trừ 10.000đ từ số dư để đọc dữ liệu công khai và tạo báo cáo phân tích chi tiết cho kênh TikTok này.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Bắt đầu phân tích",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      background: "#08152d",
      color: "#fff",
    });

    if (!confirmBefore.isConfirmed) return;

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post("/ai-analyze", {
        url: finalUrl,
      });

      const raw = response?.data?.data || response?.data || {};
      const rawRecord =
        raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

      const profileRaw =
        rawRecord.profile && typeof rawRecord.profile === "object"
          ? (rawRecord.profile as Record<string, unknown>)
          : {};

      const safePlatform = detectPlatform(
        toSafeString(rawRecord.platform, finalPlatform)
      );

      const safeResult: AnalyzeResult = {
        platform: safePlatform === "unknown" ? finalPlatform : safePlatform,
        account_name: toSafeString(
          rawRecord.account_name ?? profileRaw.name,
          "Kênh đã phân tích"
        ),
        account_url: toSafeString(rawRecord.account_url, finalUrl),
        summary: toSafeString(
          rawRecord.summary,
          "Kênh đã được phân tích thành công."
        ),
        mentor_note: toSafeString(rawRecord.mentor_note),
        health_score: toSafeNumber(rawRecord.health_score, 72),
        issues: toStringArray(rawRecord.issues),
        opportunities: toStringArray(rawRecord.opportunities),
        plan_7_days: toStringArray(rawRecord.plan_7_days),
        service_suggestions: toStringArray(rawRecord.service_suggestions),
        profile: toSafeProfile(rawRecord.profile),
        posts: toSafePosts(rawRecord.posts),
        account_summary: toSafeString(rawRecord.account_summary),
        channel_diagnosis: toStringArray(rawRecord.channel_diagnosis),
        post_recommendations: toSafeRecommendations(
          rawRecord.post_recommendations
        ),
        final_strategy: toStringArray(rawRecord.final_strategy),
        channel_positioning: toSafeChannelPositioning(
          rawRecord.channel_positioning
        ),
        content_pillars: toSafeContentPillars(rawRecord.content_pillars),
        posting_strategy: toSafePostingStrategy(rawRecord.posting_strategy),
        growth_actions: toSafeGrowthActions(rawRecord.growth_actions),
        hashtag_strategy: toSafeHashtagStrategy(rawRecord.hashtag_strategy),
        audio_strategy: toSafeAudioStrategy(rawRecord.audio_strategy),
      };

      setResult(safeResult);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Phân tích hoàn tất",
        text: "Đã tạo báo cáo chiến lược chi tiết cho kênh TikTok.",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: "#08152d",
        color: "#fff",
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (error: unknown) {
      let message = "Không thể phân tích link này lúc này. Vui lòng thử lại sau.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object" &&
        (error as { response?: { data?: { message?: unknown } } }).response?.data
          ?.message
      ) {
        message = toSafeString(
          (error as { response?: { data?: { message?: unknown } } }).response?.data
            ?.message,
          message
        );
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = toSafeString((error as { message?: unknown }).message, message);
      }

      Swal.fire({
        icon: "error",
        title: "Phân tích thất bại",
        text: message,
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  const recommendationMap = useMemo(() => {
    const map = new Map<string, PostRecommendation>();

    (result?.post_recommendations || []).forEach((item) => {
      map.set((item.title || "").trim().toLowerCase(), item);
    });

    return map;
  }, [result?.post_recommendations]);

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 sm:space-y-5 sm:px-4">
        <div className="border-b border-white/6 pb-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white/35 sm:text-[11px]">
            Trang chủ &nbsp; &gt; &nbsp; Hệ thống phân tích TikTok
          </div>
        </div>

        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                <BarChart3 size={16} className="text-orange-400" />
              </div>

              <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                HỆ THỐNG PHÂN TÍCH TIKTOK
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-medium text-orange-100/90">
              <Sparkles className="h-4 w-4" />
              10.000đ / lần phân tích
            </div>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-[#08152d] px-3 py-3 sm:rounded-[18px] sm:px-4 sm:py-3.5">
            <p className="text-xs leading-5 text-white/65 sm:text-sm">
              Hệ thống tập trung phân tích kênh TikTok dựa trên dữ liệu công khai,
              làm rõ định vị nội dung, tín hiệu tăng trưởng, video nên ưu tiên và
              hướng tối ưu thực tế trong ngắn hạn.
            </p>
          </div>
        </section>

        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
              <Search size={16} className="text-orange-400" />
            </div>

            <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              NỀN TẢNG ĐƯỢC HỖ TRỢ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {platformCards.map((item) => {
              const Icon = item.icon;
              const active = (result?.platform || detectedPlatform) === item.key;

              return (
                <motion.div
                  key={item.key}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className={`rounded-[16px] border p-3 text-left transition sm:rounded-[18px] sm:p-3.5 ${
                    active
                      ? "border-orange-400/30 bg-[#0b1a35]"
                      : "border-white/8 bg-[#08152d]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] sm:h-9 sm:w-9">
                      <Icon size={16} className={item.color} />
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${item.badge}`}
                    >
                      {active ? "đã nhận diện" : "đang hỗ trợ"}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold leading-5 text-white sm:text-sm">
                    {item.label}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-white/40 sm:text-[11px]">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
              <LinkIcon size={16} className="text-orange-400" />
            </div>

            <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              NHẬP LINK TIKTOK
            </h2>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/75">
                  Link TikTok đầy đủ
                </label>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setResult(null);
                  }}
                  placeholder="Ví dụ: https://www.tiktok.com/@tenkenh"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${selectedPlatform.badge}`}
                >
                  {selectedPlatform.label}
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-white/55">
                  Chỉ hỗ trợ TikTok
                </div>

                <div className="rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-orange-100/85">
                  Trừ 10.000đ / lượt
                </div>
              </div>

              {previewUrl && (
                <div className="rounded-xl border border-orange-400/15 bg-orange-400/10 px-3 py-2.5 text-xs leading-5 text-orange-100/85">
                  Link sẽ phân tích: {previewUrl}
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <BarChart3 className="h-4 w-4" />
                {loading ? "Đang phân tích..." : "Bắt đầu phân tích TikTok"}
              </button>
            </div>
          </div>
        </section>

        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4 sm:space-y-5"
          >
            <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                  <Users size={16} className="text-orange-400" />
                </div>

                <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                  THÔNG TIN KÊNH
                </h2>
              </div>

              <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex shrink-0 items-start gap-3">
                    {result.profile?.avatar ? (
                      <img
                        src={result.profile.avatar}
                        alt={result.profile?.name || "avatar"}
                        className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                        <BadgeCheck className="h-8 w-8 text-orange-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-white">
                          {result.profile?.name ||
                            result.account_name ||
                            "Kênh đã phân tích"}
                        </h3>

                        <div
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${selectedPlatform.badge}`}
                        >
                          {selectedPlatform.label}
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-white/55">
                        @{result.profile?.username || "username"}
                      </p>

                      {result.profile?.bio && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/75">
                          {result.profile.bio}
                        </p>
                      )}

                      {result.account_url && (
                        <a
                          href={result.account_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200"
                        >
                          Xem kênh gốc
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="mb-2 flex items-center gap-2 text-white/45">
                        <Users className="h-4 w-4" />
                        <span className="text-[11px] uppercase tracking-wide">
                          Followers
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCompactNumber(result.profile?.followers)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="mb-2 flex items-center gap-2 text-white/45">
                        <Heart className="h-4 w-4" />
                        <span className="text-[11px] uppercase tracking-wide">
                          Likes
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCompactNumber(result.profile?.likes)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="mb-2 flex items-center gap-2 text-white/45">
                        <Users className="h-4 w-4" />
                        <span className="text-[11px] uppercase tracking-wide">
                          Following
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCompactNumber(result.profile?.following)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="mb-2 flex items-center gap-2 text-white/45">
                        <Video className="h-4 w-4" />
                        <span className="text-[11px] uppercase tracking-wide">
                          Posts
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCompactNumber(result.profile?.posts_count)}
                      </div>
                    </div>
                  </div>
                </div>

                {safeAccountSummary && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/80">
                    {safeAccountSummary}
                  </div>
                )}

                {result.mentor_note && (
                  <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-cyan-200">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-bold">
                        Nhận định từ hệ thống phân tích
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-cyan-100/90">
                      {result.mentor_note}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                  <BarChart3 size={16} className="text-orange-400" />
                </div>

                <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                  CHẨN ĐOÁN CHIẾN LƯỢC
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                        Kênh đã phân tích
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-white sm:text-base">
                        {result.account_name || "Kênh của bạn"}
                      </h3>
                      <p className="mt-1 break-all text-xs leading-5 text-white/45">
                        {result.account_url}
                      </p>
                    </div>

                    <div
                      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${selectedPlatform.badge}`}
                    >
                      {selectedPlatform.label}
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-white/75">
                    {result.summary}
                  </p>
                </div>

                <div className="rounded-[16px] border border-orange-400/20 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Độ sẵn sàng tăng trưởng
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-white">
                      {result.health_score ?? 0}
                    </span>
                    <span className="pb-1 text-sm font-semibold text-orange-300">
                      /100
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-orange-400 transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, result.health_score || 0)
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-white/55">
                    Điểm này phản ánh độ rõ ràng của định vị, tín hiệu tăng trưởng
                    ban đầu và khả năng mở rộng nội dung trong ngắn hạn.
                  </p>
                </div>
              </div>
            </section>

            {(result.channel_positioning?.main_theme ||
              result.channel_positioning?.target_audience ||
              result.channel_positioning?.strongest_signal ||
              result.channel_positioning?.weakest_signal) && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                    <Target size={16} className="text-orange-400" />
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                    ĐỊNH VỊ KÊNH
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#08152d] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      Kênh đang thiên về
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {result.channel_positioning?.main_theme || "Chưa có dữ liệu"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#08152d] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      Tệp người xem phù hợp
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {result.channel_positioning?.target_audience || "Chưa có dữ liệu"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#08152d] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      Tín hiệu mạnh nhất
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {result.channel_positioning?.strongest_signal || "Chưa có dữ liệu"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#08152d] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      Điểm nghẽn lớn nhất
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {result.channel_positioning?.weakest_signal || "Chưa có dữ liệu"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {!!result.content_pillars?.length && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                    <Layers3 size={16} className="text-orange-400" />
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                    TRỤ CỘT NỘI DUNG
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {(result.content_pillars || []).map((item, index) => (
                    <div
                      key={`${item.pillar}-${index}`}
                      className="rounded-[18px] border border-white/10 bg-[#08152d] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-bold leading-6 text-white">
                          {item.pillar || "Trụ cột nội dung"}
                        </h3>
                        {item.priority && (
                          <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[10px] font-semibold text-orange-200">
                            {item.priority}
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/75">
                        {item.description || ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {result.posting_strategy && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className="rounded-[18px] border border-white/10 bg-[#08152d] p-4">
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <Clock3 className="h-4 w-4 text-orange-400" />
                      <h2 className="text-base font-extrabold">
                        CHIẾN LƯỢC ĐĂNG VIDEO
                      </h2>
                    </div>

                    <div className="space-y-3 text-sm text-white/80">
                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <span className="text-white/45">Số video/tuần: </span>
                        <span className="font-semibold text-white">
                          {result.posting_strategy?.videos_per_week || "Chưa có dữ liệu"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <div className="mb-2 text-white/45">Khung giờ nên test</div>
                        <div className="flex flex-wrap gap-2">
                          {(result.posting_strategy?.best_time_slots || []).map((item, index) => (
                            <span
                              key={`${item}-${index}`}
                              className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-medium text-orange-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <div className="mb-2 text-white/45">Format nên test</div>
                        <div className="space-y-2">
                          {(result.posting_strategy?.formats_to_test || []).map((item, index) => (
                            <div key={`${item}-${index}`} className="text-sm text-white/80">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!!result.growth_actions?.length && (
                    <div className="rounded-[18px] border border-white/10 bg-[#08152d] p-4">
                      <div className="mb-3 flex items-center gap-2 text-white">
                        <TrendingUp className="h-4 w-4 text-orange-400" />
                        <h2 className="text-base font-extrabold">
                          MỨC TĂNG ĐỀ XUẤT
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {(result.growth_actions || []).map((item, index) => (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
                          >
                            <div className="text-sm font-semibold leading-6 text-white">
                              {item.title}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/55">
                              <div>Hiện tại: {formatCompactNumber(item.current_views)}</div>
                              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-100">
                                Mục tiêu: {item.suggested_target_range || "Chưa có dữ liệu"}
                              </div>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-white/75">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {result.hashtag_strategy && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className="rounded-[18px] border border-white/10 bg-[#08152d] p-4">
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <Hash className="h-4 w-4 text-orange-400" />
                      <h2 className="text-base font-extrabold">
                        CHIẾN LƯỢC HASHTAG
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 text-sm font-semibold text-white/75">
                          Hashtag lõi
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {renderHashtagPill(result.hashtag_strategy?.core_hashtags || [])}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-semibold text-white/75">
                          Hashtag ngách
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {renderHashtagPill(result.hashtag_strategy?.niche_hashtags || [])}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-semibold text-white/75">
                          Hashtag thương hiệu
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {renderHashtagPill(result.hashtag_strategy?.branded_hashtags || [])}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-white/10 bg-[#08152d] p-4">
                    <div className="mb-3 flex items-center gap-2 text-white">
                      <Volume2 className="h-4 w-4 text-orange-400" />
                      <h2 className="text-base font-extrabold">
                        CHIẾN LƯỢC NHẠC / AUDIO
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <span className="text-white/45">Có nên dùng audio trend: </span>
                        <span className="font-semibold text-white">
                          {result.audio_strategy?.should_use_trending_audio || "Chưa có dữ liệu"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <div className="mb-2 text-white/45">Phong cách audio nên dùng</div>
                        <div className="space-y-2">
                          {(result.audio_strategy?.recommended_audio_styles || []).map(
                            (item, index) => (
                              <div key={`${item}-${index}`} className="text-sm text-white/80">
                                • {item}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {result.audio_strategy?.notes && (
                        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/10 px-3 py-2.5 text-sm leading-6 text-cyan-100/90">
                          {result.audio_strategy.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!!result.posts?.length && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                    <Video size={16} className="text-orange-400" />
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                    NỘI DUNG GẦN ĐÂY
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {(result.posts || []).map((post, index) => {
                    const recommendation =
                      recommendationMap.get(
                        (post.title || "").trim().toLowerCase()
                      ) || null;

                    const actionMeta = getActionMeta(
                      recommendation?.action || "keep_natural"
                    );

                    const growthMatch =
                      (result.growth_actions || []).find(
                        (item) =>
                          (item.title || "").trim().toLowerCase() ===
                          (post.title || "").trim().toLowerCase()
                      ) || null;

                    return (
                      <motion.div
                        key={post.id || index}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden rounded-[18px] border border-white/10 bg-[#08152d]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                          {post.thumbnail ? (
                            <>
                              <img
                                src={post.thumbnail}
                                alt={post.title || "post"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback =
                                    e.currentTarget.nextElementSibling as HTMLElement | null;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />

                              <div
                                className="absolute inset-0 hidden items-center justify-center"
                                style={{ display: "none" }}
                              >
                                <Video className="h-10 w-10 text-white/20" />
                              </div>
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Video className="h-10 w-10 text-white/20" />
                            </div>
                          )}

                          {post.is_pinned && (
                            <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                              Đã ghim
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-bold leading-6 text-white">
                              {post.title || "Nội dung gần đây"}
                            </h3>

                            <div
                              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${actionMeta.className}`}
                            >
                              {actionMeta.label}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/55">
                            <div className="inline-flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              {formatCompactNumber(post.views)}
                            </div>

                            <div className="inline-flex items-center gap-1.5">
                              <Heart className="h-4 w-4" />
                              {formatCompactNumber(post.likes)}
                            </div>

                            <div className="inline-flex items-center gap-1.5">
                              <MessageCircle className="h-4 w-4" />
                              {formatCompactNumber(post.comments)}
                            </div>
                          </div>

                          {growthMatch?.suggested_target_range && (
                            <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
                              Mức tăng đề xuất: {growthMatch.suggested_target_range}
                            </div>
                          )}

                          <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                            <p className="text-xs leading-5 text-white/75">
                              {recommendation?.reason ||
                                "Hệ thống hiện chưa có khuyến nghị riêng cho bài này."}
                            </p>
                          </div>

                          {post.url && (
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-medium text-orange-300 hover:text-orange-200"
                            >
                              Xem bài gốc
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                      <AlertTriangle size={16} className="text-orange-400" />
                    </div>

                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      ĐIỂM NGHẼN ĐANG GIỮ KÊNH LẠI
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {(result.channel_diagnosis?.length
                      ? result.channel_diagnosis
                      : result.issues || []
                    ).map((item, index) => (
                      <div
                        key={`issue-${index}`}
                        className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                      >
                        <p className="text-sm leading-6 text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                      <Rocket size={16} className="text-orange-400" />
                    </div>

                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      ĐÒN BẨY TĂNG TRƯỞNG
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {(result.opportunities || []).map((item, index) => (
                      <div
                        key={`opportunity-${index}`}
                        className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                      >
                        <p className="text-sm leading-6 text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                      <ClipboardList size={16} className="text-orange-400" />
                    </div>

                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      KẾ HOẠCH 7 NGÀY
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {(result.plan_7_days || []).map((item, index) => (
                      <div
                        key={`plan-${index}`}
                        className="flex gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                      <Lightbulb size={16} className="text-orange-400" />
                    </div>

                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      HÀNH ĐỘNG ĐỀ XUẤT
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {(result.service_suggestions || []).map((item, index) => (
                      <div
                        key={`service-${index}`}
                        className="rounded-xl border border-orange-400/15 bg-orange-400/10 px-3 py-2.5"
                      >
                        <p className="text-sm leading-6 text-orange-100/90">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {!!result.final_strategy?.length && (
              <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                    <Rocket size={16} className="text-orange-400" />
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                    CHIẾN LƯỢC CHỐT
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {(result.final_strategy || []).map((item, index) => (
                    <div
                      key={`final-${index}`}
                      className="rounded-[16px] border border-white/10 bg-[#08152d] px-4 py-3"
                    >
                      <p className="text-sm leading-6 text-white/85">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!!result.post_recommendations?.length && (
              <section className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                    <TrendingUp size={16} className="text-orange-400" />
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                    KHUYẾN NGHỊ CHI TIẾT THEO TỪNG NỘI DUNG
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {(result.post_recommendations || []).map((item, index) => {
                    const actionMeta = getActionMeta(item.action);

                    const growthMatch =
                      (result.growth_actions || []).find(
                        (row) =>
                          (row.title || "").trim().toLowerCase() ===
                          (item.title || "").trim().toLowerCase()
                      ) || null;

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold leading-6 text-white">
                              {item.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/55">
                              <div className="inline-flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {formatCompactNumber(item.views)}
                              </div>

                              {growthMatch?.suggested_target_range && (
                                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-100">
                                  Mục tiêu: {growthMatch.suggested_target_range}
                                </div>
                              )}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-white/75">
                              {item.reason}
                            </p>
                          </div>

                          <div
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${actionMeta.className}`}
                          >
                            {actionMeta.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}