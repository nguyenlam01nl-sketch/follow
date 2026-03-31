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
      "rounded-[24px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]",
    title: "!text-white !text-[28px] !font-extrabold",
    htmlContainer: "!text-left !text-[14px] !leading-7 !text-white/80",
    confirmButton:
      "!inline-flex !h-11 !items-center !justify-center !rounded-xl !bg-[#2F80ED] !px-6 !text-sm !font-semibold !text-white hover:!brightness-110",
    cancelButton:
      "!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-white/10 !bg-white/5 !px-6 !text-sm !font-semibold !text-white/80 hover:!bg-white/10",
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

  const ITEMS_PER_PAGE = 5;

  const formatMoney = (value: number | string) => {
    const num = Number(value || 0);
    return `${num.toLocaleString("vi-VN")} VND`;
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
        return "Chờ xử lý";
      case "processing":
        return "Đang chạy";
      case "completed":
        return "Hoàn thành";
      case "partial":
        return "Một phần";
      case "cancelled":
        return "Đã huỷ";
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

  return (
    <DashboardLayout>
      <div className="space-y-4 px-3 sm:px-4">
        <div>
          <h1 className="text-lg font-semibold text-white sm:text-xl">
            Đơn hàng
          </h1>
          <p className="text-xs text-white/50">
            Quản lý đơn hàng của bé Panda
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: "all", label: "Tất cả" },
                { key: "pending", label: "Chờ" },
                { key: "processing", label: "Đang chạy" },
                { key: "completed", label: "Xong" },
                { key: "partial", label: "Một phần" },
                { key: "failed", label: "Lỗi" },
                { key: "cancelled", label: "Huỷ" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
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
              placeholder="Tìm đơn theo mã, dịch vụ, link, mã ngoài..."
              className="w-full rounded-2xl border border-white/10 bg-[#0c1730]/70 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none"
            />
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 px-3 text-xs uppercase tracking-[0.18em] text-white/35 xl:grid">
          <div>ID</div>
          <div>Dịch vụ</div>
          <div>Link</div>
          <div>Số lượng</div>
          <div>Số lượng bắt đầu</div>
          <div>Giá</div>
          <div>Trạng thái</div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
              Đang tải...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
              Không có đơn nào
            </div>
          ) : (
            paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl"
              >
                <div className="grid gap-4 xl:grid-cols-7 xl:items-center">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-white">
                      #ORD-{order.id}
                    </div>
                    {order.external_order_id ? (
                      <div className="text-xs text-white/50">
                        Mã ngoài: {order.external_order_id}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="line-clamp-3 text-base leading-7 text-white/90">
                      {order.service_name}
                    </div>
                    {order.platform ? (
                      <div className="mt-1 text-xs text-white/45">
                        {order.platform}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    {order.target_link ? (
                      <a
                        href={order.target_link}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-sm leading-6 text-sky-300 underline underline-offset-2 hover:text-sky-200"
                      >
                        {order.target_link}
                      </a>
                    ) : (
                      <div className="text-sm text-white/55">Không có link</div>
                    )}
                  </div>

                  <div className="text-base font-medium text-white">
                    {order.quantity ?? 1}
                  </div>

                  <div className="text-base font-medium text-white">
                    {order.api_start_count ?? "--"}
                  </div>

                  <div className="text-base font-medium text-white">
                    {formatMoney(order.total_price || 0)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>

                    {["pending", "processing"].includes(order.status) ? (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="rounded-full border border-rose-400/20 bg-rose-500/15 px-4 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Đang huỷ..." : "Huỷ đơn"}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4 text-xs text-white/40">
                  Cập nhật: {formatDateTime(order.updated_at)}
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              ‹
            </button>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              {page}/{totalPages || 1}
            </span>

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={page === totalPages || totalPages === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-40"
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