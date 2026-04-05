import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  BadgeCheck,
  Eye,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";

type ServiceItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  mode: "api" | "manual";
  price: number;
  min_quantity: number | null;
  max_quantity: number | null;
  unit: string | null;
  requires_quantity: boolean;
  requires_link: boolean;
  requires_note: boolean;
  platform: string;
  group_key: string;
  service_key: string;
};

type ServiceGroup = {
  group_key: string;
  services: ServiceItem[];
};

type ServicePlatform = {
  platform: string;
  groups: ServiceGroup[];
};

function formatLabel(value: string) {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function MusicNoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 18.5C9 19.8807 7.65685 21 6 21C4.34315 21 3 19.8807 3 18.5C3 17.1193 4.34315 16 6 16C7.65685 16 9 17.1193 9 18.5ZM9 18.5V6L19 4V15.5M19 15.5C19 16.8807 17.6569 18 16 18C14.3431 18 13 16.8807 13 15.5C13 14.1193 14.3431 13 16 13C17.6569 13 19 14.1193 19 15.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getPlatformMeta(platform: string) {
  const key = platform.toLowerCase();

  if (key.includes("facebook")) {
    return {
      label: "FACEBOOK",
      icon: Share2,
      iconClass: "text-[#4EA1FF]",
      sectionBorder: "border-[#4EA1FF]/10",
      badgeClass: "border-[#4EA1FF]/20 bg-[#4EA1FF]/10 text-[#9CCBFF]",
    };
  }

  if (key.includes("instagram")) {
    return {
      label: "INSTAGRAM",
      icon: Globe,
      iconClass: "text-white/85",
      sectionBorder: "border-white/10",
      badgeClass: "border-white/10 bg-white/[0.05] text-white/70",
    };
  }

  if (key.includes("tiktok")) {
    return {
      label: "TIKTOK",
      icon: MusicNoteIcon,
      iconClass: "text-white/85",
      sectionBorder: "border-white/10",
      badgeClass: "border-white/10 bg-white/[0.05] text-white/70",
    };
  }

  return {
    label: formatLabel(platform).toUpperCase(),
    icon: Globe,
    iconClass: "text-violet-300",
    sectionBorder: "border-white/10",
    badgeClass: "border-white/10 bg-white/[0.05] text-white/70",
  };
}

function getServiceIcon(service: ServiceItem) {
  const text = `${service.name} ${service.group_key} ${service.service_key}`.toLowerCase();

  if (text.includes("follow") || text.includes("sub") || text.includes("member")) {
    return Users;
  }

  if (text.includes("like") || text.includes("tym") || text.includes("heart")) {
    return Heart;
  }

  if (text.includes("view") || text.includes("watch")) {
    return Eye;
  }

  if (text.includes("comment")) {
    return MessageCircle;
  }

  if (text.includes("verify") || text.includes("tick xanh") || text.includes("check")) {
    return BadgeCheck;
  }

  if (
    text.includes("hack") ||
    text.includes("mở khóa") ||
    text.includes("unlock") ||
    text.includes("khóa")
  ) {
    return Lock;
  }

  if (text.includes("rip") || text.includes("report")) {
    return ShieldCheck;
  }

  if (text.includes("video") || text.includes("reel")) {
    return Video;
  }

  if (text.includes("vip")) {
    return Star;
  }

  return Zap;
}

function flattenServices(groups: ServiceGroup[]) {
  return groups.flatMap((group) =>
    group.services.map((service) => ({
      ...service,
      groupLabel: formatLabel(group.group_key),
    }))
  );
}

export default function ServicesPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tree, setTree] = useState<ServicePlatform[]>([]);

  useEffect(() => {
    const fetchServicesTree = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/services/tree");
        setTree(res.data || []);
      } catch (err) {
        setError("Không tải được danh sách dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchServicesTree();
  }, []);

  const engagementPlatforms = [
    { key: "facebook", label: "Facebook", icon: Share2 },
    { key: "instagram", label: "Instagram", icon: Globe },
    { key: "tiktok", label: "TikTok", icon: MusicNoteIcon },
    { key: "youtube", label: "YouTube", icon: Video },
  ];

  const sections = useMemo(() => {
    return tree.map((platform) => ({
      ...platform,
      services: flattenServices(platform.groups),
    }));
  }, [tree]);

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-4 overflow-x-hidden">
        <div className="border-b border-white/6 pb-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">
            Trang chủ &gt; Dịch vụ
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-white/10 bg-[#08152d] p-3 text-sm text-white/60">
            Đang tải dịch vụ...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#08152d] p-3 text-sm text-white/60">
            Không có dữ liệu dịch vụ.
          </div>
        )}

        <section className="space-y-3 border-b border-white/10 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                <Zap size={15} className="text-orange-400" />
              </div>

              <h2 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                Tăng tương tác
              </h2>
            </div>

            <div className="w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-orange-200">
              {engagementPlatforms.length} nền tảng
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {engagementPlatforms.map((item) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.key}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigate(`/services/engagement/${item.key}`)}
                  className="group w-full min-w-0 overflow-hidden rounded-xl border border-white/8 bg-[#08152d] p-3 text-left transition hover:border-white/14 hover:bg-[#0b1a35]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                    <Icon size={15} className="text-orange-400" />
                  </div>

                  <h3 className="mt-2 truncate text-xs font-semibold text-white sm:text-sm">
                    {item.label}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-[10px] text-white/45 sm:text-[11px]">
                    Follow, like, view...
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {!loading &&
          !error &&
          sections.map((platform) => {
            const meta = getPlatformMeta(platform.platform);
            const Icon = meta.icon;

            return (
              <section
                key={platform.platform}
                className={`space-y-3 border-b ${meta.sectionBorder} pb-4`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                      <Icon className={meta.iconClass} size={15} />
                    </div>

                    <h2 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                      {meta.label}
                    </h2>
                  </div>

                  <div
                    className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${meta.badgeClass}`}
                  >
                    {platform.services.length} dịch vụ
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {platform.services.map((service) => {
                    const ServiceIcon = getServiceIcon(service);

                    return (
                      <motion.button
                        key={service.id}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => navigate(`/services/${service.id}`)}
                        className="group w-full min-w-0 overflow-hidden rounded-xl border border-white/8 bg-[#08152d] p-3 text-left transition hover:border-white/14 hover:bg-[#0b1a35]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                            <ServiceIcon size={15} className="text-orange-400" />
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                              service.mode === "api"
                                ? "bg-cyan-400/10 text-cyan-200"
                                : "bg-fuchsia-400/10 text-fuchsia-200"
                            }`}
                          >
                            {service.mode}
                          </span>
                        </div>

                        <h3 className="mt-2 line-clamp-2 text-xs font-semibold leading-4 text-white sm:text-sm">
                          {service.name}
                        </h3>

                        <p className="mt-1 truncate text-[10px] text-white/45 sm:text-[11px]">
                          {formatLabel(service.group_key)}
                        </p>

                        <div className="mt-2">
                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55">
                            {Number(service.price).toLocaleString()}đ
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </div>
    </DashboardLayout>
  );
}