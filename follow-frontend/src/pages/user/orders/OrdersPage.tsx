import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import OrderRow from "@/components/orders/OrderRow";
import api from "@/api/axios";

type OrderItem = {
  id: number;
  user_id: number;
  service_id: number | null;
  service_name: string;
  platform: string | null;
  mode: string | null;
  target_link: string | null;
  quantity: number | null;
  unit_price: string | number;
  total_price: string | number;
  note: string | null;
  form_data: any;
  selected_price: string | number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const formatMoney = (value: number | string) => {
    const num = Number(value || 0);
    return num.toLocaleString("en-US");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Lỗi load orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, keyword]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchFilter = filter === "all" ? true : order.status === filter;

      const orderCode = `#ord-${order.id}`.toLowerCase();
      const orderId = String(order.id).toLowerCase();
      const serviceName = (order.service_name || "").toLowerCase();
      const targetLink = (order.target_link || "").toLowerCase();

      const matchKeyword =
        q === "" ||
        orderCode.includes(q) ||
        orderId.includes(q) ||
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
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-white">
            Đơn hàng
          </h1>
          <p className="text-xs text-white/50">
            Quản lý đơn của bạn
          </p>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col gap-2">
          <div className="flex overflow-x-auto gap-2 pb-1">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chờ" },
              { key: "processing", label: "Đang chạy" },
              { key: "completed", label: "Xong" },
              { key: "failed", label: "Lỗi" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
                  filter === f.key
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-white/60"
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
            placeholder="Tìm đơn..."
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none"
          />
        </div>

        {/* Header table (ẩn mobile) */}
        <div className="hidden sm:grid grid-cols-6 gap-3 px-2 text-xs text-white/40">
          <div>ID</div>
          <div>Dịch vụ</div>
          <div>Link</div>
          <div>Số lượng</div>
          <div>Giá</div>
          <div>Trạng thái</div>
        </div>

        {/* Orders */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-xs text-white/50">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="text-xs text-white/50">
              Không có đơn nào
            </div>
          ) : (
            paginatedOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={{
                  id: `#ORD-${order.id}`,
                  service: order.service_name,
                  link: order.target_link || "Không có link",
                  quantity: order.quantity ?? 1,
                  price: formatMoney(order.total_price || 0),
                  status: order.status,
                }}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs rounded-lg bg-white/5 text-white disabled:opacity-40"
            >
              ‹
            </button>

            <span className="text-xs text-white/70">
              {page}/{totalPages || 1}
            </span>

            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, totalPages || 1)
                )
              }
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 text-xs rounded-lg bg-white/5 text-white disabled:opacity-40"
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