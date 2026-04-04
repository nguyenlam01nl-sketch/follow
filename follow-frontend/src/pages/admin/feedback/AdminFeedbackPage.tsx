import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Lightbulb,
  MessageSquareMore,
  RefreshCcw,
  Search,
  Wrench,
  TrendingUp,
  TrendingDown,
  MonitorSmartphone,
} from "lucide-react";

type FeedbackUser = {
  id: number;
  name: string;
  email: string;
};

type FeedbackItem = {
  id: number;
  user_id: number;
  type: string | null;
  title: string;
  content: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  created_at: string;
  updated_at: string;
  user?: FeedbackUser;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type FeedbackResponse = {
  data: FeedbackItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
};

function getTypeMeta(type: string | null) {
  switch (type) {
    case "feature_request":
      return {
        label: "Thêm chức năng",
        icon: Lightbulb,
        className: "bg-cyan-400/10 text-cyan-200 border-cyan-400/20",
      };
    case "increase_price":
      return {
        label: "Tăng giá",
        icon: TrendingUp,
        className: "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
      };
    case "decrease_price":
      return {
        label: "Hạ giá",
        icon: TrendingDown,
        className: "bg-orange-400/10 text-orange-200 border-orange-400/20",
      };
    case "add_service":
      return {
        label: "Thêm dịch vụ",
        icon: Wrench,
        className: "bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/20",
      };
    case "ui_improvement":
      return {
        label: "Cải thiện giao diện",
        icon: MonitorSmartphone,
        className: "bg-violet-400/10 text-violet-200 border-violet-400/20",
      };
    case "other":
    default:
      return {
        label: "Khác",
        icon: MessageSquareMore,
        className: "bg-white/10 text-white/80 border-white/10",
      };
  }
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

export default function AdminFeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [pagination, setPagination] = useState<FeedbackResponse | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchFeedbacks = async (targetPage = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/admin/feedback", {
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
        text: "Không tải được danh sách góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(1);
  }, [keyword, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const pending = items.filter((item) => item.status === "pending").length;
    const reviewed = items.filter((item) => item.status === "reviewed").length;
    const resolved = items.filter((item) => item.status === "resolved").length;

    return { pending, reviewed, resolved };
  }, [items]);

  const handleSearch = () => {
    setKeyword(search.trim());
  };

  const handleUpdateStatus = async (
    id: number,
    status: "pending" | "reviewed" | "resolved" | "rejected"
  ) => {
    try {
      setSubmittingId(id);

      await api.patch(`/admin/feedback/${id}/status`, { status });

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã cập nhật trạng thái góp ý",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        timer: 1600,
        showConfirmButton: false,
      });

      fetchFeedbacks(page);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể cập nhật trạng thái",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setSubmittingId(null);
    }
  };

  const handleViewDetail = (item: FeedbackItem) => {
    const typeMeta = getTypeMeta(item.type);
    const statusMeta = getStatusMeta(item.status);

    Swal.fire({
      title: item.title,
      html: `
        <div style="text-align:left; color:#e5eefc; line-height:1.7;">
          <div style="margin-bottom:10px;"><b>Loại:</b> ${typeMeta.label}</div>
          <div style="margin-bottom:10px;"><b>Trạng thái:</b> ${statusMeta.label}</div>
          <div style="margin-bottom:10px;"><b>Người gửi:</b> ${item.user?.name || "Không rõ"}</div>
          <div style="margin-bottom:10px;"><b>Email:</b> ${item.user?.email || "-"}</div>
          <div style="margin-bottom:10px;"><b>Ngày gửi:</b> ${formatDate(item.created_at)}</div>
          <div style="margin-top:14px;"><b>Nội dung:</b></div>
          <div style="margin-top:8px; white-space:pre-wrap; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px;">
            ${item.content}
          </div>
        </div>
      `,
      background: "#08152d",
      color: "#fff",
      confirmButtonColor: "#f97316",
      confirmButtonText: "Đóng",
      width: 760,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b border-white/6 pb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Trang chủ &nbsp; &gt; &nbsp; Admin &nbsp; &gt; &nbsp; Góp ý
          </div>
        </div>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                <MessageSquareMore
                  size={18}
                  className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                QUẢN LÝ GÓP Ý
              </h2>
            </div>

            <div className="w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-orange-200 sm:px-4 sm:py-2 sm:text-xs">
              {pagination?.total || 0} góp ý
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4">
              <p className="text-sm text-white/45">Chờ xem</p>
              <p className="mt-2 text-2xl font-bold text-amber-200">{stats.pending}</p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4">
              <p className="text-sm text-white/45">Đã xem</p>
              <p className="mt-2 text-2xl font-bold text-sky-200">{stats.reviewed}</p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#08152d] p-4">
              <p className="text-sm text-white/45">Đã xử lý</p>
              <p className="mt-2 text-2xl font-bold text-emerald-200">{stats.resolved}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
              <Filter size={18} className="text-orange-400 sm:h-[22px] sm:w-[22px]" />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              BỘ LỌC
            </h2>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/70">
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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                  >
                    Tìm
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Trạng thái
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400"
                >
                  <option value="" className="bg-slate-900">Tất cả</option>
                  <option value="pending" className="bg-slate-900">Chờ xem</option>
                  <option value="reviewed" className="bg-slate-900">Đã xem</option>
                  <option value="resolved" className="bg-slate-900">Đã xử lý</option>
                  <option value="rejected" className="bg-slate-900">Từ chối</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Loại ý kiến
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400"
                >
                  <option value="" className="bg-slate-900">Tất cả</option>
                  <option value="feature_request" className="bg-slate-900">Thêm chức năng</option>
                  <option value="increase_price" className="bg-slate-900">Tăng giá</option>
                  <option value="decrease_price" className="bg-slate-900">Hạ giá</option>
                  <option value="add_service" className="bg-slate-900">Thêm dịch vụ</option>
                  <option value="ui_improvement" className="bg-slate-900">Cải thiện giao diện</option>
                  <option value="other" className="bg-slate-900">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
              <Eye size={18} className="text-orange-400 sm:h-[22px] sm:w-[22px]" />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              DANH SÁCH GÓP Ý
            </h2>
          </div>

          {loading ? (
            <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6 text-sm text-white/60 sm:text-base">
              Đang tải dữ liệu...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6 text-sm text-white/60 sm:text-base">
              Không có góp ý nào.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const typeMeta = getTypeMeta(item.type);
                const statusMeta = getStatusMeta(item.status);
                const TypeIcon = typeMeta.icon;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeMeta.className}`}
                          >
                            <TypeIcon className="h-3.5 w-3.5" />
                            {typeMeta.label}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusMeta.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {item.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/55">
                          {item.content}
                        </p>

                        <div className="mt-4 flex flex-col gap-1 text-xs text-white/40 sm:flex-row sm:flex-wrap sm:gap-4">
                          <span>Người gửi: {item.user?.name || "Không rõ"}</span>
                          <span>Email: {item.user?.email || "-"}</span>
                          <span>Ngày gửi: {formatDate(item.created_at)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:w-[260px] xl:justify-end">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(item)}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
                        >
                          Xem
                        </button>

                        <button
                          type="button"
                          disabled={submittingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "reviewed")}
                          className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2.5 text-sm font-medium text-sky-200 transition hover:bg-sky-400/15 disabled:opacity-60"
                        >
                          Đã xem
                        </button>

                        <button
                          type="button"
                          disabled={submittingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "resolved")}
                          className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/15 disabled:opacity-60"
                        >
                          Xử lý
                        </button>

                        <button
                          type="button"
                          disabled={submittingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "rejected")}
                          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-400/15 disabled:opacity-60"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!!pagination && pagination.last_page > 1 && (
            <div className="flex justify-center pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => fetchFeedbacks(page - 1)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>

                {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => fetchFeedbacks(pageNumber)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        pageNumber === page
                          ? "bg-orange-500 text-white"
                          : "border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={page === pagination.last_page}
                  onClick={() => fetchFeedbacks(page + 1)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
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