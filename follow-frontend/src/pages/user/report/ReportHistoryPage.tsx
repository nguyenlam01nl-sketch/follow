import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  ShieldAlert,
  History,
  ArrowLeft,
  Landmark,
  Phone,
  Globe,
  TriangleAlert,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

type ReportItem = {
  id: number;
  target_type: "bank_account" | "phone" | "facebook_link" | "other" | string;
  target_value: string;
  title: string;
  content: string;
  amount?: number | null;
  status: "pending" | "approved" | "rejected" | string;
  created_at: string;
  reviewed_at?: string | null;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMoney(amount?: number | null) {
  if (amount === null || amount === undefined || amount === 0) return "—";

  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

function getTargetMeta(type: string) {
  switch (type) {
    case "bank_account":
      return {
        label: "Số tài khoản",
        icon: Landmark,
        badge: "bg-cyan-400/10 text-cyan-200",
        iconColor: "text-cyan-300",
      };
    case "phone":
      return {
        label: "Số điện thoại",
        icon: Phone,
        badge: "bg-emerald-400/10 text-emerald-200",
        iconColor: "text-emerald-300",
      };
    case "facebook_link":
      return {
        label: "Link Facebook",
        icon: Globe,
        badge: "bg-violet-400/10 text-violet-200",
        iconColor: "text-violet-300",
      };
    default:
      return {
        label: "Khác",
        icon: TriangleAlert,
        badge: "bg-orange-400/10 text-orange-200",
        iconColor: "text-orange-300",
      };
  }
}

function getStatusMeta(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Đã duyệt",
        icon: CheckCircle2,
        badge: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20",
        iconColor: "text-emerald-300",
      };
    case "rejected":
      return {
        label: "Từ chối",
        icon: XCircle,
        badge: "bg-red-500/15 text-red-200 border border-red-400/20",
        iconColor: "text-red-300",
      };
    default:
      return {
        label: "Chờ duyệt",
        icon: Clock3,
        badge: "bg-yellow-500/15 text-yellow-200 border border-yellow-400/20",
        iconColor: "text-yellow-300",
      };
  }
}

export default function ReportHistoryPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/report/history");

        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data?.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalReports = useMemo(() => items.length, [items]);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b border-white/6 pb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Trang chủ &nbsp; &gt; &nbsp; Báo cáo lừa đảo &nbsp; &gt; &nbsp; Lịch
            sử báo cáo
          </div>
        </div>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                <History
                  size={18}
                  className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                LỊCH SỬ BÁO CÁO
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/report")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại báo cáo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-white/40">
                Tổng số báo cáo
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {loading ? "..." : totalReports}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-white/40">
                Trạng thái phổ biến
              </div>
              <div className="mt-2 text-base font-bold text-white">
                {loading
                  ? "Đang tải..."
                  : items.some((item) => item.status === "pending")
                  ? "Chờ duyệt"
                  : items.length > 0
                  ? "Đã xử lý"
                  : "Chưa có dữ liệu"}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4 sm:p-5">
              <div className="text-xs uppercase tracking-wide text-white/40">
                Ghi chú
              </div>
              <div className="mt-2 text-sm leading-6 text-white/65">
                Lịch sử này hiển thị các báo cáo bạn đã gửi lên hệ thống.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
              <ShieldAlert
                size={18}
                className="text-orange-400 sm:h-[22px] sm:w-[22px]"
              />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              DANH SÁCH BÁO CÁO
            </h2>
          </div>

          {loading ? (
            <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="mt-3 h-5 w-3/4 rounded bg-white/10" />
                    <div className="mt-3 h-16 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <FileText className="h-7 w-7 text-white/45" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-white">
                  Chưa có báo cáo nào
                </h3>

                <p className="mt-2 max-w-lg text-sm leading-6 text-white/55">
                  Bạn chưa gửi báo cáo lừa đảo nào. Khi gửi báo cáo mới, dữ liệu
                  sẽ hiển thị tại đây để bạn tiện theo dõi trạng thái xử lý.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/report")}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Tạo báo cáo mới
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const targetMeta = getTargetMeta(item.target_type);
                const statusMeta = getStatusMeta(item.status);

                const TargetIcon = targetMeta.icon;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]">
                          <TargetIcon
                            className={`h-5 w-5 ${targetMeta.iconColor}`}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${targetMeta.badge}`}
                            >
                              {targetMeta.label}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusMeta.badge}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusMeta.label}
                            </span>
                          </div>

                          <h3 className="mt-3 text-base font-bold uppercase leading-6 text-white sm:text-lg">
                            {item.title}
                          </h3>

                          <div className="mt-1 text-sm text-white/45">
                            Mã báo cáo #{item.id}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-white/45">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/40">
                          Giá trị báo cáo
                        </div>
                        <div className="mt-2 break-all text-sm font-semibold text-white">
                          {item.target_value || "—"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/40">
                          Số tiền liên quan
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          {formatMoney(item.amount)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/40">
                          Ngày gửi
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/40">
                          Ngày xử lý
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          {formatDate(item.reviewed_at)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-wide text-white/40">
                        Mô tả chi tiết
                      </div>
                      <div className="mt-2 whitespace-pre-line text-sm leading-6 text-white/75">
                        {item.content || "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}