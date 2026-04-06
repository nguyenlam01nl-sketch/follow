import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../api/axios";
import Swal from "sweetalert2";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "success"
  | "cancelled";

type AdminOrderItem = {
  id: number;
  user_id: number | null;
  service_id: number | null;
  code: string;
  customer_name: string;
  customer_email: string;
  service_name: string;
  platform: string | null;
  mode: string | null;
  target_link: string | null;
  quantity: number | null;
  unit_price: number | string;
  total_price: number | string;
  note: string | null;
  form_data: Record<string, any> | null;
  selected_price: number | string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

type AdminOrdersResponse = {
  data: AdminOrderItem[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

function formatVND(value: number | string | null | undefined) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

function formatDateTime(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "processing":
      return "Đang xử lý";
    case "completed":
      return "Hoàn thành";
    case "success":
      return "Thành công";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "processing":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    case "completed":
    case "success":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "cancelled":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";
    default:
      return "border-white/10 bg-white/10 text-white";
  }
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "success", label: "Thành công" },
  { value: "cancelled", label: "Đã hủy" },
];

function AdminOrderPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchOrders = async (page = 1, search = keyword, status = statusFilter) => {
    try {
      setLoading(true);

      const res = await api.get<AdminOrdersResponse>("/admin/orders", {
        params: {
          page,
          search: search || undefined,
          status: status || undefined,
        },
      });

      const payload = res.data;

      setOrders(payload.data || []);
      setPagination({
        current_page: payload.current_page ?? 1,
        last_page: payload.last_page ?? 1,
        per_page: payload.per_page ?? 10,
        total: payload.total ?? (payload.data?.length || 0),
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: "Không thể tải danh sách đơn hàng.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleSearch = () => {
    setKeyword(searchText.trim());
    fetchOrders(1, searchText.trim(), statusFilter);
  };

  const handleFilterStatus = (value: string) => {
    setStatusFilter(value);
    fetchOrders(1, keyword, value);
  };

  const handleChangePage = (page: number) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchOrders(page, keyword, statusFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateStatus = async (order: AdminOrderItem, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;

    const result = await Swal.fire({
      title: "Cập nhật trạng thái?",
      text: `Bạn có chắc muốn đổi đơn #${order.code} sang "${getStatusLabel(newStatus)}" không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingId(order.id);

      const res = await api.put(`/admin/orders/${order.id}`, {
        status: newStatus,
      });

      const updatedOrder = res.data?.data;

      if (updatedOrder) {
        setOrders((prev) =>
          prev.map((item) => (item.id === order.id ? updatedOrder : item))
        );

        setSelectedOrder((prev) =>
          prev && prev.id === order.id ? updatedOrder : prev
        );
      } else {
        setOrders((prev) =>
          prev.map((item) =>
            item.id === order.id ? { ...item, status: newStatus } : item
          )
        );

        setSelectedOrder((prev) =>
          prev && prev.id === order.id ? { ...prev, status: newStatus } : prev
        );
      }

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: "Trạng thái đơn hàng đã được thay đổi.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Không thể cập nhật trạng thái đơn hàng.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const showingText = useMemo(() => {
    if (!pagination.total) return "0";
    const start = (pagination.current_page - 1) * pagination.per_page + 1;
    const end = Math.min(
      pagination.current_page * pagination.per_page,
      pagination.total
    );
    return `${start}-${end}`;
  }, [pagination]);

  return (
    <DashboardLayout>
      <>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/12 bg-[#0b1220] p-6 backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/45">Chi tiết đơn hàng</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    #{selectedOrder.code}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                >
                  Đóng
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Khách hàng</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {selectedOrder.customer_name || "Không rõ"}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {selectedOrder.customer_email || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Dịch vụ</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {selectedOrder.service_name}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Nền tảng: {selectedOrder.platform || "-"} • Chế độ:{" "}
                    {selectedOrder.mode || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Thông tin đơn</p>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    <p>Link: {selectedOrder.target_link || "-"}</p>
                    <p>Số lượng: {selectedOrder.quantity ?? "-"}</p>
                    <p>Đơn giá: {formatVND(selectedOrder.unit_price)}</p>
                    <p>Tổng tiền: {formatVND(selectedOrder.total_price)}</p>
                    <p>Selected price: {formatVND(selectedOrder.selected_price)}</p>
                    <p>Tạo lúc: {formatDateTime(selectedOrder.created_at)}</p>
                    <p>Cập nhật lúc: {formatDateTime(selectedOrder.updated_at)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Ghi chú</p>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {selectedOrder.note || "Không có ghi chú."}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Dữ liệu form</p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-black/20 p-4 text-xs leading-6 text-white/75">
                    {JSON.stringify(selectedOrder.form_data || {}, null, 2)}
                  </pre>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm text-white/45">Trạng thái hiện tại</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter((item) => item.value).map((item) => (
                      <button
                        key={item.value}
                        onClick={() =>
                          handleUpdateStatus(selectedOrder, item.value as OrderStatus)
                        }
                        disabled={updatingId === selectedOrder.id}
                        className={`rounded-xl border px-4 py-2 text-sm transition ${
                          selectedOrder.status === item.value
                            ? getStatusClass(item.value)
                            : "border-white/12 bg-white/8 text-white/75 hover:bg-white/12 hover:text-white"
                        } ${updatingId === selectedOrder.id ? "opacity-60" : ""}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <p className="text-sm text-white/45">Admin orders</p>
            <h1 className="text-3xl font-semibold text-white">Quản lý đơn hàng</h1>
            <p className="mt-2 text-sm text-white/55">
              Bạn theo dõi, tìm kiếm và cập nhật trạng thái đơn hàng tại đây.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-2xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Tìm theo mã đơn, tên khách, email, dịch vụ, link..."
                  className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                />

                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.01]"
                >
                  Tìm kiếm
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterStatus(e.target.value)}
                className="rounded-2xl border border-white/12 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 text-sm text-white/50">
              Hiển thị {showingText} / {pagination.total} đơn hàng
            </div>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Orders list</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Danh sách đơn hàng
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                  Đang tải dữ liệu...
                </div>
              ) : orders.length ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-white/6 p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-medium text-white">
                            #{order.code}
                          </p>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-medium text-white/90">
                          {order.service_name}
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          Khách: {order.customer_name || "Không rõ"} •{" "}
                          {order.customer_email || "-"}
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                          Link: {order.target_link || "-"}
                        </p>

                        <p className="mt-1 text-sm text-white/40">
                          Tạo lúc: {formatDateTime(order.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 xl:items-end">
                        <p className="text-lg font-semibold text-white">
                          {formatVND(order.total_price)}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                          >
                            Xem chi tiết
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order, e.target.value as OrderStatus)
                            }
                            disabled={updatingId === order.id}
                            className="rounded-xl border border-white/12 bg-[#0f172a] px-4 py-2 text-sm text-white outline-none disabled:opacity-60"
                          >
                            {STATUS_OPTIONS.filter((item) => item.value).map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                  Không có đơn hàng nào.
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => handleChangePage(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang trước
              </button>

              <div className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75">
                Trang {pagination.current_page} / {pagination.last_page}
              </div>

              <button
                onClick={() => handleChangePage(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}

export default AdminOrderPage;