import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";

type OrderItem = {
  id: number;
  user_id: number;
  service_id: number | null;
  external_order_id?: string | null;
  service_name: string;
  platform: string | null;
  mode: string | null;
  target_link: string | null;
  quantity: number | null;
  unit_price: string | number;
  total_price: string | number;
  api_charge?: string | number | null;
  api_start_count?: number | null;
  api_remains?: number | null;
  note: string | null;
  form_data: any;
  selected_price: string | number | null;
  status: string;
  external_status?: string | null;
  created_at: string;
  updated_at: string;
};

const swalBaseOptions = {
  background: "#08152d",
  color: "#e5eefc",
  backdrop: "rgba(2, 8, 23, 0.78)",
  buttonsStyling: false,
  customClass: {
    popup:
      "rounded-[22px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]",
    title: "!text-white !text-[24px] sm:!text-[28px] !font-extrabold",
    htmlContainer:
      "!text-left !text-[13px] sm:!text-[14px] !leading-6 sm:!leading-7 !text-white/80",
    confirmButton:
      "!inline-flex !h-10 sm:!h-11 !items-center !justify-center !rounded-xl !bg-[#2F80ED] !px-5 sm:!px-6 !text-sm !font-semibold !text-white hover:!brightness-110",
    cancelButton:
      "!inline-flex !h-10 sm:!h-11 !items-center !justify-center !rounded-xl !border !border-white/10 !bg-white/5 !px-5 sm:!px-6 !text-sm !font-semibold !text-white/80 hover:!bg-white/10",
    icon: "!border-[3px]",
  },
};

function alertHtml(content: string) {
  return `
    <div style="text-align:left; line-height:1.7; font-size:14px; color:#dbe7ff;">
      ${content}
    </div>
  `;
}

function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 10;

  const formatMoney = (value: number | string) => {
    const num = Number(value || 0);
    return `${num.toLocaleString("vi-VN")}đ`;
  };

  const formatDateTime = (value: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("vi-VN", {
      hour12: false,
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ";
      case "processing":
        return "Đang chạy";
      case "completed":
        return "Xong";
      case "partial":
        return "Một phần";
      case "cancelled":
        return "Huỷ";
      case "failed":
        return "Lỗi";
      case "refunded":
        return "Hoàn tiền";
      default:
        return status || "Không rõ";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "border border-emerald-400/20 bg-emerald-500/15 text-emerald-300";
      case "processing":
        return "border border-sky-400/20 bg-sky-500/15 text-sky-300";
      case "pending":
        return "border border-amber-400/20 bg-amber-500/15 text-amber-300";
      case "partial":
        return "border border-violet-400/20 bg-violet-500/15 text-violet-300";
      case "cancelled":
      case "failed":
        return "border border-rose-400/20 bg-rose-500/15 text-rose-300";
      case "refunded":
        return "border border-fuchsia-400/20 bg-fuchsia-500/15 text-fuchsia-300";
      default:
        return "border border-white/10 bg-white/10 text-white/70";
    }
  };

  const fetchOrders = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi load orders:", error);
      setOrders([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, keyword]);

  const cancelOrder = async (id: number) => {
    const confirm = await Swal.fire({
      ...swalBaseOptions,
      title: "Huỷ đơn?",
      icon: "warning",
      html: alertHtml(`
        <p>Bạn chắc chắn muốn huỷ đơn này?</p>
        <p style="margin-top:8px;color:rgba(255,255,255,0.68)">
          Thao tác này sẽ gửi yêu cầu huỷ đến hệ thống nhà cung cấp.
        </p>
      `),
      showCancelButton: true,
      confirmButtonText: "Huỷ đơn",
      cancelButtonText: "Đóng",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      setCancellingId(id);

      Swal.fire({
        ...swalBaseOptions,
        title: "Đang huỷ...",
        html: alertHtml(`<p>Vui lòng chờ trong giây lát.</p>`),
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await api.post(`/orders/${id}/cancel`);
      const updatedOrder = res.data?.order;

      if (updatedOrder) {
        setOrders((prev) =>
          prev.map((item) => (item.id === id ? updatedOrder : item))
        );
      }

      await Swal.fire({
        ...swalBaseOptions,
        icon: "success",
        title: "Thành công",
        html: alertHtml(
          `<p>${res.data?.message || "Huỷ đơn thành công"}</p>`
        ),
        confirmButtonText: "OK",
      });
    } catch (error: any) {
      console.error("Lỗi huỷ đơn:", error);

      await Swal.fire({
        ...swalBaseOptions,
        icon: "error",
        title: "Thất bại",
        html: alertHtml(
          `<p>${error?.response?.data?.message || "Huỷ đơn thất bại"}</p>`
        ),
        confirmButtonText: "Đóng",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchFilter = filter === "all" ? true : order.status === filter;

      const orderCode = `#ord-${order.id}`.toLowerCase();
      const orderId = String(order.id).toLowerCase();
      const externalOrderId = String(order.external_order_id || "").toLowerCase();
      const serviceName = (order.service_name || "").toLowerCase();
      const targetLink = (order.target_link || "").toLowerCase();

      const matchKeyword =
        q === "" ||
        orderCode.includes(q) ||
        orderId.includes(q) ||
        externalOrderId.includes(q) ||
        serviceName.includes(q) ||
        targetLink.includes(q);

      return matchFilter && matchKeyword;
    });
  }, [orders, filter, keyword]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const filterOptions = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ" },
    { key: "processing", label: "Đang chạy" },
    { key: "completed", label: "Xong" },
    { key: "partial", label: "Một phần" },
    { key: "failed", label: "Lỗi" },
    { key: "cancelled", label: "Huỷ" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-3 px-2.5 sm:px-4">
        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            Đơn hàng
          </h1>
          <p className="text-[11px] text-white/50 sm:text-xs">
            Quản lý đơn hàng của bạn
          </p>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3 sm:rounded-[22px] sm:p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-sm transition ${
                    filter === f.key
                      ? "bg-white text-slate-900"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm mã đơn, dịch vụ, link..."
              className="w-full rounded-xl border border-white/10 bg-[#0c1730]/70 px-3 py-2.5 text-xs text-white placeholder:text-white/35 outline-none sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
            />
          </div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[110px_minmax(240px,1.8fr)_70px_80px_120px_120px_90px] gap-3 border-b border-white/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:px-4">
                <div>Mã</div>
                <div>Dịch vụ</div>
                <div>SL</div>
                <div>Start</div>
                <div>Giá</div>
                <div>Trạng thái</div>
                <div>Huỷ</div>
              </div>

              {loading ? (
                <div className="px-3 py-4 text-sm text-white/60 sm:px-4">
                  Đang tải...
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-3 py-4 text-sm text-white/60 sm:px-4">
                  Không có đơn nào
                </div>
              ) : (
                paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[110px_minmax(240px,1.8fr)_70px_80px_120px_120px_90px] gap-3 border-b border-white/8 px-3 py-2.5 text-xs text-white/80 last:border-b-0 sm:px-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">
                        #ORD-{order.id}
                      </div>
                      {order.external_order_id ? (
                        <div className="truncate text-[10px] text-white/40">
                          {order.external_order_id}
                        </div>
                      ) : (
                        <div className="text-[10px] text-white/25">—</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">
                        {order.service_name}
                      </div>
                     {order.target_link ? (
  <a
    href={order.target_link}
    target="_blank"
    rel="noreferrer"
    className="block truncate text-[11px] text-sky-300 underline underline-offset-2 hover:text-sky-200"
    title={order.target_link}
  >
    {order.target_link}
  </a>
) : (
  <div className="truncate text-[11px] text-white/35">
    {order.platform || "—"}
  </div>
)}
                      <div className="truncate text-[10px] text-white/30">
                        {formatDateTime(order.updated_at)}
                      </div>
                    </div>

                    <div className="flex items-center text-white">
                      {order.quantity ?? 1}
                    </div>

                    <div className="flex items-center text-white">
                      {order.api_start_count ?? "--"}
                    </div>

                    <div className="flex items-center font-semibold text-white">
                      {formatMoney(order.total_price || 0)}
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-start">
                      {["pending", "processing"].includes(order.status) ? (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="rounded-full border border-rose-400/20 bg-rose-500/15 px-3 py-1 text-[10px] font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId === order.id ? "Đang..." : "Huỷ"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-white/25">—</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white disabled:opacity-40 sm:h-9 sm:w-9"
            >
              ‹
            </button>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 sm:text-xs">
              {page}/{totalPages || 1}
            </span>

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={page === totalPages || totalPages === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white disabled:opacity-40 sm:h-9 sm:w-9"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OrdersPage;