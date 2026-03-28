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
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Đơn hàng</h1>
            <p className="text-sm text-white/50">Quản lý đơn của bạn</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chờ xử lý" },
              { key: "processing", label: "Đang chạy" },
              { key: "completed", label: "Hoàn thành" },
              { key: "failed", label: "Thất bại" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  filter === f.key
                    ? "border-white/20 bg-white/12 text-white"
                    : "border-white/10 bg-white/6 text-white/60 hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-[340px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo link, username, mã đơn..."
              className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:bg-white/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 px-4 text-xs text-white/40">
          <div>ID</div>
          <div>Dịch vụ</div>
          <div>Link</div>
          <div>Số lượng</div>
          <div>Giá</div>
          <div>Trạng thái</div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="px-4 text-white/50">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 text-white/50">Không có đơn nào</div>
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

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <div className="text-sm text-white/70">
              Trang {page} / {totalPages || 1}
            </div>

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={page === totalPages || totalPages === 0}
              className="rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OrdersPage;