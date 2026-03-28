import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  // ArrowRight,
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

  if (text.includes("hack") || text.includes("mở khóa") || text.includes("unlock") || text.includes("khóa")) {
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
    { key: "facebook", label: "Tăng tương tác Facebook", icon: Share2 },
    { key: "instagram", label: "Tăng tương tác Instagram", icon: Globe },
    { key: "tiktok", label: "Tăng tương tác TikTok", icon: MusicNoteIcon },
    { key: "youtube", label: "Tăng tương tác YouTube", icon: Video },
  ];

  const sections = useMemo(() => {
    return tree.map((platform) => ({
      ...platform,
      services: flattenServices(platform.groups),
    }));
  }, [tree]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="border-b border-white/6 pb-4">
          <div className="text-xs uppercase tracking-[0.24em] text-white/40">
            Trang chủ &nbsp; &gt; &nbsp; Automxh
          </div>
        </div>

        {loading && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Đang tải dịch vụ...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[28px] border border-red-400/20 bg-red-400/10 p-6 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Không có dữ liệu dịch vụ.
          </div>
        )}
        <section className="space-y-5 border-b border-white/10 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]">
                <Zap size={22} className="text-orange-400" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                TĂNG TƯƠNG TÁC
              </h2>
            </div>

            <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-orange-200">
              {engagementPlatforms.length} nền tảng
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {engagementPlatforms.map((item) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.key}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => navigate(`/services/engagement/${item.key}`)}
                  className="group relative min-h-[180px] rounded-[24px] border border-white/8 bg-[#08152d] p-5 text-left transition hover:border-white/14 hover:bg-[#0b1a35]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <Icon size={22} className="text-orange-400" />
                  </div>

                  <h3 className="text-[22px] font-extrabold uppercase leading-7 text-white">
                    {item.label}
                  </h3>

                  <p className="mt-2 text-sm text-white/35">
                    Follow, like, view, comment, share, member, subscribe...
                  </p>

                  <div className="mt-4">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/55">
                      Social Boost
                    </span>
                  </div>
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
                className={`space-y-5 border-b ${meta.sectionBorder} pb-8`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]">
                      <Icon size={22} className={meta.iconClass} />
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                      {meta.label}
                    </h2>
                  </div>

                  <div className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide ${meta.badgeClass}`}>
                    {platform.services.length} dịch vụ
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {platform.services.map((service) => {
                    const ServiceIcon = getServiceIcon(service);

                    return (
                      <motion.button
                        key={service.id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => navigate(`/services/${service.id}`)}
                        className="group relative min-h-[210px] rounded-[24px] border border-white/8 bg-[#08152d] p-5 text-left transition hover:border-white/14 hover:bg-[#0b1a35]"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                            <ServiceIcon size={22} className="text-orange-400" />
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${service.mode === "api"
                                ? "bg-cyan-400/10 text-cyan-200"
                                : "bg-fuchsia-400/10 text-fuchsia-200"
                              }`}
                          >
                            {service.mode}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 min-h-[56px] text-[22px] font-extrabold uppercase leading-7 text-white">
                          {service.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-white/35">
                          {service.description || "Cung cấp đa dạng các gói dịch vụ chất lượng cao."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/55">
                            {formatLabel(service.group_key)}
                          </span>

                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/55">
                            {Number(service.price).toLocaleString()}đ
                          </span>
                        </div>

                        {/* <div className="absolute bottom-5 left-5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a2a66] transition group-hover:translate-x-1">
                            <ArrowRight size={16} className="text-[#4EA1FF]" />
                          </div>
                        </div> */}
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