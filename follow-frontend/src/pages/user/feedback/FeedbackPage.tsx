import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  Lightbulb,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wrench,
  MessageSquareMore,
  Wallet,
  History,
} from "lucide-react";

const feedbackTypes = [
  {
    value: "feature_request",
    label: "Thêm chức năng",
    icon: Sparkles,
    color: "text-cyan-300",
    badge: "bg-cyan-400/10 text-cyan-200",
  },
  {
    value: "increase_price",
    label: "Tăng giá",
    icon: TrendingUp,
    color: "text-emerald-300",
    badge: "bg-emerald-400/10 text-emerald-200",
  },
  {
    value: "decrease_price",
    label: "Hạ giá",
    icon: TrendingDown,
    color: "text-orange-300",
    badge: "bg-orange-400/10 text-orange-200",
  },
  {
    value: "add_service",
    label: "Thêm dịch vụ",
    icon: Wrench,
    color: "text-fuchsia-300",
    badge: "bg-fuchsia-400/10 text-fuchsia-200",
  },
  {
    value: "ui_improvement",
    label: "Cải thiện giao diện",
    icon: Lightbulb,
    color: "text-violet-300",
    badge: "bg-violet-400/10 text-violet-200",
  },
  {
    value: "payment_support",
    label: "Thanh toán / nạp tiền",
    icon: Wallet,
    color: "text-sky-300",
    badge: "bg-sky-400/10 text-sky-200",
  },
  {
    value: "order_support",
    label: "Đơn hàng / dịch vụ",
    icon: Send,
    color: "text-amber-300",
    badge: "bg-amber-400/10 text-amber-200",
  },
  {
    value: "other",
    label: "Khác",
    icon: MessageSquareMore,
    color: "text-white/80",
    badge: "bg-white/10 text-white/80",
  },
];

export default function FeedbackPage() {
  const navigate = useNavigate();

  const [type, setType] = useState("feature_request");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedType =
    feedbackTypes.find((item) => item.value === type) || feedbackTypes[0];

  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu tiêu đề",
        text: "Vui lòng nhập tiêu đề góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu nội dung",
        text: "Vui lòng nhập nội dung góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Gửi đóng góp ý kiến?",
      text: "Ý kiến của bạn sẽ được gửi đến hệ thống để xem xét.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Gửi ngay",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      background: "#08152d",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await api.post("/feedback", {
        type,
        title,
        content,
      });

      await Swal.fire({
        icon: "success",
        title: "Gửi thành công",
        text: "Cảm ơn bạn đã đóng góp ý kiến cho hệ thống",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });

      setType("feature_request");
      setTitle("");
      setContent("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gửi thất bại",
        text: "Không thể gửi đóng góp ý kiến lúc này",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b border-white/6 pb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Trang chủ &nbsp; &gt; &nbsp; Đóng góp ý kiến
          </div>
        </div>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                <Lightbulb
                  size={18}
                  className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                ĐÓNG GÓP Ý KIẾN
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/feedback/history")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
            >
              <History className="h-4 w-4" />
              Xem lịch sử
            </button>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
            <p className="text-sm leading-6 text-white/65 sm:text-[15px]">
              Bạn có thể gửi đề xuất như thêm chức năng mới, điều chỉnh tăng giá,
              hạ giá dịch vụ, hoặc bổ sung thêm dịch vụ để hệ thống hoàn thiện hơn.
            </p>
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
              <Sparkles
                size={18}
                className="text-orange-400 sm:h-[22px] sm:w-[22px]"
              />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              CHỌN LOẠI Ý KIẾN
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {feedbackTypes.map((item) => {
              const Icon = item.icon;
              const active = type === item.value;

              return (
                <motion.button
                  key={item.value}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.18 }}
                  type="button"
                  onClick={() => setType(item.value)}
                  className={`group relative min-h-[130px] rounded-[18px] border p-4 text-left transition sm:min-h-[150px] sm:rounded-[22px] sm:p-5 ${
                    active
                      ? "border-orange-400/30 bg-[#0b1a35]"
                      : "border-white/8 bg-[#08152d] hover:border-white/14 hover:bg-[#0b1a35]"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon
                        size={18}
                        className={`${item.color} sm:h-[22px] sm:w-[22px]`}
                      />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${item.badge}`}
                    >
                      chọn
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase leading-6 text-white sm:text-lg">
                    {item.label}
                  </h3>

                  <p className="mt-1.5 text-xs text-white/40 sm:mt-2 sm:text-sm">
                    Gửi đề xuất theo đúng nhóm nội dung để dễ xử lý hơn.
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
              <selectedType.icon
                size={18}
                className={`${selectedType.color} sm:h-[22px] sm:w-[22px]`}
              />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              NỘI DUNG GÓP Ý
            </h2>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Loại ý kiến
                </label>

                <div
                  className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide sm:px-4 sm:py-2 sm:text-xs ${selectedType.badge}`}
                >
                  {selectedType.label}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Nên thêm bộ lọc tìm dịch vụ theo nền tảng"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nội dung chi tiết
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ví dụ: Nên thêm chức năng tìm kiếm nhanh, hoặc dịch vụ X nên hạ giá để cạnh tranh hơn..."
                  className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                />
              </div>

              <div className="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/85">
                Gợi ý: bạn có thể góp ý về chức năng mới, mức giá dịch vụ, dịch
                vụ cần bổ sung, hoặc những điểm chưa tiện khi sử dụng website.
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? "Đang gửi..." : "Gửi đóng góp ý kiến"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}