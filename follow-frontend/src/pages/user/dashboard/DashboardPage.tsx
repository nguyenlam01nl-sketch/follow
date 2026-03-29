import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

type DashboardResponse = {
  data: {
    stats: {
      total_orders: number;
      total_spent: number;
      total_deposits: number;
      balance: number;
      active_services: number;
    };
    recent_orders: {
      id: number;
      code: string;
      service_name: string;
      status: string;
      total_price: number;
      created_at: string;
    }[];
    user: {
      id: number;
      name: string;
      email: string;
      username: string;
    };
  };
};

type NotificationItem = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

function formatVND(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
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
      return "border-amber-300/20 bg-amber-300/10 text-amber-200";
    case "processing":
      return "border-sky-300/20 bg-sky-300/10 text-sky-200";
    case "completed":
    case "success":
      return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
    case "cancelled":
      return "border-rose-300/20 bg-rose-300/10 text-rose-200";
    default:
      return "border-white/15 bg-white/10 text-white";
  }
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse["data"] | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get<DashboardResponse>("/dashboard");
        setDashboard(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        const items = res.data.data || [];
        setNotifications(items);
      } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
        setNotifications([]);
      } finally {
        setNotificationLoading(false);
      }
    };

    fetchDashboard();
    fetchNotifications();
  }, []);

  const latestNotification = useMemo(() => {
    if (!notifications.length) return null;
    return notifications[0];
  }, [notifications]);

  useEffect(() => {
    if (!latestNotification) return;

    const storageKey = `notification_popup_closed_${latestNotification.id}`;
    const closedUntil = localStorage.getItem(storageKey);

    if (closedUntil && Number(closedUntil) > Date.now()) {
      setShowPopup(false);
      return;
    }

    setShowPopup(true);
  }, [latestNotification]);

  const handleClosePopup = () => {
    if (latestNotification) {
      const storageKey = `notification_popup_closed_${latestNotification.id}`;
      const oneDayLater = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, String(oneDayLater));
    }
    setShowPopup(false);
  };

  return (
    <DashboardLayout>
      <>
        {showPopup && latestNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
            <div className="w-full max-w-lg rounded-[28px] border border-white/12 bg-[#0f172a]/95 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/45">Thông báo mới</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {latestNotification.title}
                  </h2>
                </div>

                <button
                  onClick={handleClosePopup}
                  className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white"
                >
                  Đóng
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="text-sm leading-7 text-white/75">
                  {latestNotification.content}
                </p>
                <p className="mt-3 text-xs text-white/35">
                  {new Date(latestNotification.created_at).toLocaleString("vi-VN")}
                </p>
              </div>

              <p className="mt-4 text-xs text-white/40">
                Sau khi đóng, thông báo này sẽ không hiện lại trong 1 ngày.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng đơn hàng"
              value={loading ? "..." : String(dashboard?.stats.total_orders ?? 0)}
              subtext="Tổng số đơn đã tạo"
              icon="🧾"
            />
            <StatCard
              title="Đã chi tiêu"
              value={loading ? "..." : formatVND(dashboard?.stats.total_spent ?? 0)}
              subtext="Tổng tiền từ các đơn hàng"
              icon="💸"
            />
            <StatCard
              title="Số dư ví"
              value={loading ? "..." : formatVND(dashboard?.stats.balance ?? 0)}
              subtext="Số dư hiện tại trong tài khoản"
              icon="💰"
            />
            <StatCard
              title="Dịch vụ"
              value={loading ? "..." : String(dashboard?.stats.active_services ?? 0)}
              subtext="Số dịch vụ đang mở bán"
              icon="🛍️"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">Recent activity</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Đơn hàng gần đây
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/orders")}
                  className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white/60">
                    Đang tải dữ liệu...
                  </div>
                ) : dashboard?.recent_orders?.length ? (
                  dashboard.recent_orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">{order.service_name}</p>
                        <p className="mt-1 text-sm text-white/45">
                          #{order.code} • {formatVND(order.total_price)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusClass(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white/60">
                    Bạn chưa có đơn hàng nào.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
                <p className="text-sm text-white/45">Wallet</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Số dư hiện tại
                </h2>

                <div className="mt-5 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-sky-400/20 to-fuchsia-500/20 p-5">
                  <p className="text-sm text-white/55">Available balance</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {loading ? "..." : formatVND(dashboard?.stats.balance ?? 0)}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/wallet")}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.01]"
                >
                  Nạp tiền
                </button>
              </div>

              <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/45">Notifications</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">
                      Thông báo
                    </h2>
                  </div>

                  {latestNotification && (
                    <button
                      onClick={() => setShowPopup(true)}
                      className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white"
                    >
                      Xem popup
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  {notificationLoading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white/60">
                      Đang tải thông báo...
                    </div>
                  ) : notifications.length ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/60">
                          {item.content}
                        </p>
                        <p className="mt-2 text-xs text-white/35">
                          {new Date(item.created_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white/60">
                      Chưa có thông báo nào.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
                <p className="text-sm text-white/45">Quick actions</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Thao tác nhanh
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/services")}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    Tạo đơn mới
                  </button>
                  <button
                    onClick={() => navigate("/services")}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    Xem dịch vụ
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    Lịch sử đơn
                  </button>
                  <button
                    onClick={() => navigate("/account")}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    Tài khoản
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    </DashboardLayout>
  );
}

export default DashboardPage;