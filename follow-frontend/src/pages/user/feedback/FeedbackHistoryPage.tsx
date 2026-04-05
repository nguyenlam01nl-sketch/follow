import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Lightbulb,
  MessageSquareMore,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wrench,
  Wallet,
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

type FeedbackItem = {
  id: number;
  user_id: number;
  type: string | null;
  title: string;
  content: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  created_at: string;
  updated_at: string;
};

type FeedbackResponse = {
  data: FeedbackItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

function getTypeMeta(type: string | null) {
  const found = feedbackTypes.find((item) => item.value === type);

  if (found) return found;

  return {
    value: "other",
    label: "Khác",
    icon: MessageSquareMore,
    color: "text-white/80",
    badge: "bg-white/10 text-white/80",
  };
}

function getStatusMeta(status: FeedbackItem["status"]) {
  switch (status) {
    case "reviewed":
      return {
        label: "Đã xem",
        icon: Eye,
        className: "bg-sky-400/10 text-sky-200 border-sky-400/20",
      };
    case "resolved":
      return {
        label: "Đã xử lý",
        icon: CheckCircle2,
        className: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
      };
    case "rejected":
      return {
        label: "Từ chối",
        icon: RefreshCcw,
        className: "bg-red-400/10 text-red-200 border-red-400/20",
      };
    case "pending":
    default:
      return {
        label: "Chờ xem",
        icon: Clock3,
        className: "bg-amber-400/10 text-amber-200 border-amber-400/20",
      };
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("vi-VN");
}

export default function FeedbackHistoryPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<FeedbackResponse | null>(null);

  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchHistory = async (targetPage = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/feedback/history", {
        params: {
          page: targetPage,
          keyword,
          status: statusFilter,
          type: typeFilter,
        },
      });

      setItems(res.data.data || []);
      setPagination(res.data);
      setPage(res.data.current_page || 1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tải được lịch sử góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [keyword, statusFilter, typeFilter]);

  const handleSearch = () => {
    setKeyword(search.trim());
  };

  const handleViewDetail = async (id: number) => {
    try {
      const res = await api.get(`/feedback/${id}`);
      const item: FeedbackItem = res.data;

      const typeMeta = getTypeMeta(item.type);
      const statusMeta = getStatusMeta(item.status);

      await Swal.fire({
        title: item.title,
        html: `
          <div style="text-align:left; color:#e5eefc; line-height:1.7;">
            <div style="margin-bottom:8px;"><b>Loại:</b> ${typeMeta.label}</div>
            <div style="margin-bottom:8px;"><b>Trạng thái:</b> ${statusMeta.label}</div>
            <div style="margin-bottom:8px;"><b>Ngày gửi:</b> ${formatDate(item.created_at)}</div>
            <div style="margin-top:12px;"><b>Nội dung:</b></div>
            <div style="margin-top:8px; white-space:pre-wrap; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px;">
              ${item.content}
            </div>
          </div>
        `,
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
        width: 680,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tải được chi tiết góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    }
  };

  const stats = useMemo(() => {
    return {
      total: pagination?.total || 0,
      pending: items.filter((item) => item.status === "pending").length,
      reviewed: items.filter((item) => item.status === "reviewed").length,
      resolved: items.filter((item) => item.status === "resolved").length,
    };
  }, [items, pagination]);

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 sm:space-y-5 sm:px-4">
        <div className="border-b border-white/6 pb-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white/35 sm:text-[11px]">
            Trang chủ &nbsp; &gt; &nbsp; Đóng góp ý kiến &nbsp; &gt; &nbsp; Lịch sử
          </div>
        </div>

        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
                <Clock3 size={16} className="text-orange-400" />
              </div>

              <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                LỊCH SỬ GÓP Ý
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/feedback")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/[0.08]"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại góp ý
              </button>

              <div className="w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-orange-200">
                {stats.total} góp ý
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-[16px] border border-white/10 bg-[#08152d] px-3 py-2.5">
              <p className="text-[11px] text-white/45 sm:text-xs">Chờ xem</p>
              <p className="mt-1 text-lg font-bold text-amber-200 sm:text-xl">
                {stats.pending}
              </p>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-[#08152d] px-3 py-2.5">
              <p className="text-[11px] text-white/45 sm:text-xs">Đã xem</p>
              <p className="mt-1 text-lg font-bold text-sky-200 sm:text-xl">
                {stats.reviewed}
              </p>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-[#08152d] px-3 py-2.5">
              <p className="text-[11px] text-white/45 sm:text-xs">Đã xử lý</p>
              <p className="mt-1 text-lg font-bold text-emerald-200 sm:text-xl">
                {stats.resolved}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-b border-white/10 pb-4 sm:space-y-4 sm:pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
              <Filter size={16} className="text-orange-400" />
            </div>

            <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              BỘ LỌC
            </h2>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-3 sm:rounded-[18px] sm:p-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Tìm kiếm
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Nhập tiêu đề hoặc nội dung góp ý"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-400 sm:text-sm"
                  >
                    Tìm
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Trạng thái
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-400"
                >
                  <option value="" className="bg-slate-900">
                    Tất cả
                  </option>
                  <option value="pending" className="bg-slate-900">
                    Chờ xem
                  </option>
                  <option value="reviewed" className="bg-slate-900">
                    Đã xem
                  </option>
                  <option value="resolved" className="bg-slate-900">
                    Đã xử lý
                  </option>
                  <option value="rejected" className="bg-slate-900">
                    Từ chối
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">
                  Loại ý kiến
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-400"
                >
                  <option value="" className="bg-slate-900">
                    Tất cả
                  </option>
                  {feedbackTypes.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-slate-900"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] sm:h-9 sm:w-9">
              <Eye size={16} className="text-orange-400" />
            </div>

            <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              DANH SÁCH ĐÃ GỬI
            </h2>
          </div>

          {loading ? (
            <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-4 text-sm text-white/60">
              Đang tải lịch sử góp ý...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[16px] border border-white/10 bg-[#08152d] p-4 text-sm text-white/60">
              Bạn chưa có góp ý nào.
            </div>
          ) : (
            <div className="rounded-[16px] border border-white/10 bg-[#08152d] overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1fr)_90px_88px] gap-2 border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/35 sm:grid-cols-[minmax(0,1.5fr)_120px_110px_90px] sm:px-4">
                <div>Nội dung</div>
                <div className="text-right">Ngày gửi</div>
                <div className="text-right">Trạng thái</div>
                <div className="hidden sm:block text-right">Chi tiết</div>
              </div>

              {items.map((item) => {
                const typeMeta = getTypeMeta(item.type);
                const statusMeta = getStatusMeta(item.status);
                const TypeIcon = typeMeta.icon;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_90px_88px] gap-2 border-b border-white/8 px-3 py-2.5 text-xs last:border-b-0 sm:grid-cols-[minmax(0,1.5fr)_120px_110px_90px] sm:px-4 hover:bg-white/[0.03] transition"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${typeMeta.badge}`}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {typeMeta.label}
                        </span>
                      </div>

                      <div className="truncate font-medium text-white">
                        {item.title}
                      </div>

                      <div className="truncate text-[10px] text-white/40">
                        {item.content}
                      </div>
                    </div>

                    <div className="flex items-center justify-end text-[11px] text-white/55 sm:text-xs">
                      {formatDate(item.created_at)}
                    </div>

                    <div className="flex items-center justify-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] sm:text-[10px] font-medium ${statusMeta.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(item.id)}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/85 transition hover:bg-white/[0.08]"
                      >
                        Xem
                      </button>
                    </div>

                    <div className="col-span-3 flex justify-end sm:hidden">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(item.id)}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/85 transition hover:bg-white/[0.08]"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!!pagination && pagination.last_page > 1 && (
            <div className="flex justify-center pt-1">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => fetchHistory(page - 1)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>

                {Array.from(
                  { length: pagination.last_page },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => fetchHistory(pageNumber)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      pageNumber === page
                        ? "bg-orange-500 text-white"
                        : "border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === pagination.last_page}
                  onClick={() => fetchHistory(page + 1)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}