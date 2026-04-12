import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  Brain,
  BarChart3,
  Link as LinkIcon,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

type AnalyzeItem = {
  id: number;
  url: string;
  platform: string;
  user_name?: string;
  created_at: string;
};

export default function AdminAiAnalyzePage() {
  const [data, setData] = useState<AnalyzeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/ai-analyze");

      setData(res.data?.data || []);
    } catch (err) {
      console.error("Fetch AI analyze failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 👉 Stats đơn giản
  const total = data.length;
  const youtubeCount = data.filter((i) => i.platform === "youtube").length;
  const tiktokCount = data.filter((i) => i.platform === "tiktok").length;
  const instagramCount = data.filter((i) => i.platform === "instagram").length;

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 sm:space-y-5 sm:px-4">
        {/* Header */}
        <div className="border-b border-white/6 pb-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white/35 sm:text-[11px]">
            Admin &nbsp; &gt; &nbsp; AI phân tích kênh
          </div>
        </div>

        {/* Title */}
        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
              <Brain size={18} className="text-orange-400" />
            </div>

            <h2 className="text-lg font-extrabold text-white">
              AI ANALYZE DASHBOARD
            </h2>
          </div>

          <p className="text-sm text-white/60">
            Theo dõi hoạt động sử dụng AI phân tích kênh của người dùng.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Tổng lượt phân tích",
              value: total,
              icon: BarChart3,
            },
            {
              label: "YouTube",
              value: youtubeCount,
              icon: TrendingUp,
            },
            {
              label: "TikTok",
              value: tiktokCount,
              icon: TrendingUp,
            },
            {
              label: "Instagram",
              value: instagramCount,
              icon: TrendingUp,
            },
          ].map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-white/10 bg-[#08152d] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    {item.label}
                  </span>
                  <Icon size={14} className="text-orange-400" />
                </div>

                <div className="mt-2 text-lg font-bold text-white">
                  {item.value}
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Table */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-orange-400" />
            <h2 className="text-sm font-bold text-white">
              LỊCH SỬ PHÂN TÍCH
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#08152d] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/50">
                  <th className="p-3">#</th>
                  <th className="p-3">Link</th>
                  <th className="p-3">Nền tảng</th>
                  <th className="p-3">Người dùng</th>
                  <th className="p-3">Thời gian</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-white/50">
                      Đang tải...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-white/50">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/[0.03]"
                    >
                      <td className="p-3 text-white/50">
                        {index + 1}
                      </td>

                      <td className="p-3 max-w-[200px] truncate text-blue-300">
                        <a href={item.url} target="_blank">
                          {item.url}
                        </a>
                      </td>

                      <td className="p-3 capitalize text-white">
                        {item.platform}
                      </td>

                      <td className="p-3 text-white/80">
                        {item.user_name || "N/A"}
                      </td>

                      <td className="p-3 text-white/50">
                        <Clock size={14} className="inline mr-1" />
                        {item.created_at}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}