import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import OrderRow from "../../components/orders/OrderRow";

const mockOrders = [
  {
    id: "#ORD-1001",
    service: "Instagram Follow",
    link: "instagram.com/user1",
    quantity: 1000,
    price: 120000,
    status: "pending",
  },
  {
    id: "#ORD-1002",
    service: "Facebook Like",
    link: "facebook.com/post",
    quantity: 500,
    price: 80000,
    status: "processing",
  },
  {
    id: "#ORD-1003",
    service: "TikTok View",
    link: "tiktok.com/video",
    quantity: 10000,
    price: 150000,
    status: "completed",
  },
  {
    id: "#ORD-1004",
    service: "Unlock 282",
    link: "uid: 123456",
    quantity: 1,
    price: 300000,
    status: "failed",
  },
];

function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? mockOrders
    : mockOrders.filter((o) => o.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Đơn hàng
            </h1>
            <p className="text-sm text-white/50">
              Quản lý tất cả đơn dịch vụ
            </p>
          </div>
        </div>

        {/* FILTER */}
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
              className={`px-4 py-2 rounded-xl text-sm border ${
                filter === f.key
                  ? "bg-white/12 border-white/20 text-white"
                  : "bg-white/6 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-6 gap-4 px-4 text-xs text-white/40">
          <div>ID</div>
          <div>Dịch vụ</div>
          <div>Link</div>
          <div>Số lượng</div>
          <div>Giá</div>
          <div>Trạng thái</div>
        </div>

        {/* LIST */}
        <div className="space-y-2">
          {filtered.map((order, i) => (
            <OrderRow key={i} order={order} />
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default OrdersPage;