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
  link?: string | null;
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
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
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

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      const isUrl = /^https?:\/\/[^\s]+$/i.test(part);

      if (isUrl) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }

      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <DashboardLayout>
      <>
        {showPopup && latestNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
            <div className="w-full max-w-[340px] rounded-2xl border border-white/12 bg-[#0f172a]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] text-white/45 sm:text-xs">
                    Thông báo mới
                  </p>
                  <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-white sm:text-lg">
                    {latestNotification.title}
                  </h2>
                </div>

                <button
                  onClick={handleClosePopup}
                  className="shrink-0 rounded-lg border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] text-white/70 transition hover:bg-white/12 hover:text-white"
                >
                  Đóng
                </button>
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/6 p-3">
                <div className="text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
                  {renderTextWithLinks(latestNotification.content)}
                </div>

                <p className="mt-2 text-[10px] text-white/35">
                  {new Date(latestNotification.created_at).toLocaleString("vi-VN")}
                </p>
              </div>

              <button
                onClick={handleClosePopup}
                className="mt-4 rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white"
              >
                Đóng
              </button>

              <p className="mt-3 text-[10px] text-white/40">
                Sau khi đóng, thông báo này sẽ không hiện lại trong 1 ngày.
              </p>
            </div>
          </div>
        )}

        <div className="w-full max-w-none space-y-3 sm:space-y-4">
          <section className="grid w-full grid-cols-2 gap-2">
            <StatCard
              title="Tổng đơn hàng"
              value={loading ? "..." : String(dashboard?.stats.total_orders ?? 0)}
              subtext="Tổng số đơn"
              icon="🧾"
            />

            <StatCard
              title="Đã chi tiêu"
              value={loading ? "..." : formatVND(dashboard?.stats.total_spent ?? 0)}
              subtext="Tổng tiền đã dùng"
              icon="💸"
            />

            <StatCard
              title="Số dư ví"
              value={loading ? "..." : formatVND(dashboard?.stats.balance ?? 0)}
              subtext="Số dư hiện tại"
              icon="💰"
            />

            <StatCard
              title="Dịch vụ"
              value={loading ? "..." : String(dashboard?.stats.active_services ?? 0)}
              subtext="Đang mở bán"
              icon="🛍️"
            />
          </section>

          <section className="grid gap-3 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] text-white/45">Recent activity</p>
                  <h2 className="mt-1 text-sm font-semibold text-white">
                    Đơn hàng gần đây
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/orders")}
                  className="shrink-0 rounded-lg border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] text-white/70 transition hover:bg-white/12 hover:text-white"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {loading ? (
                  <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-xs text-white/60">
                    Đang tải dữ liệu...
                  </div>
                ) : dashboard?.recent_orders?.length ? (
                  dashboard.recent_orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="min-w-0 overflow-hidden">
                          <p className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-white">
                            {order.service_name}
                          </p>
                          <p className="mt-1 block w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-white/45">
                            #{order.code} • {formatVND(order.total_price)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit max-w-full rounded-full border px-2.5 py-1 text-[10px] ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-xs text-white/60">
                    Bạn chưa có đơn hàng nào.
                  </div>
                )}
              </div>
            </div>

            <div className="w-full min-w-0 space-y-3 overflow-hidden">
              <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl">
                <p className="text-[10px] text-white/45">Wallet</p>
                <h2 className="mt-1 text-sm font-semibold text-white">
                  Số dư hiện tại
                </h2>

                <div className="mt-3 w-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400/20 via-sky-400/20 to-fuchsia-500/20 p-3">
                  <p className="text-[10px] text-white/55">Available balance</p>
                  <p className="mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white">
                    {loading ? "..." : formatVND(dashboard?.stats.balance ?? 0)}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/wallet")}
                  className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
                >
                  Nạp tiền
                </button>
              </div>

              <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/45">Notifications</p>
                    <h2 className="mt-1 text-sm font-semibold text-white">
                      Thông báo
                    </h2>
                  </div>

                  {latestNotification && (
                    <button
                      onClick={() => setShowPopup(true)}
                      className="shrink-0 rounded-lg border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] text-white/70 transition hover:bg-white/12 hover:text-white"
                    >
                      Xem
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {notificationLoading ? (
                    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-xs text-white/60">
                      Đang tải thông báo...
                    </div>
                  ) : notifications.length ? (
                    notifications.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5"
                      >
                        <p className="truncate text-sm font-semibold text-white">
                          {item.title}
                        </p>

                        <div className="mt-1 text-[11px] leading-5 text-white/60">
                          {renderTextWithLinks(item.content)}
                        </div>

                        <p className="mt-2 text-[10px] text-white/35">
                          {new Date(item.created_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-xs text-white/60">
                      Chưa có thông báo nào.
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl">
                <p className="text-[10px] text-white/45">Quick actions</p>
                <h2 className="mt-1 text-sm font-semibold text-white">
                  Thao tác nhanh
                </h2>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    onClick={() => navigate("/services")}
                    className="w-full overflow-hidden rounded-xl border border-white/12 bg-white/8 px-3 py-2.5 text-center text-xs text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    <span className="block truncate">Tạo đơn mới</span>
                  </button>

                  <button
                    onClick={() => navigate("/services")}
                    className="w-full overflow-hidden rounded-xl border border-white/12 bg-white/8 px-3 py-2.5 text-center text-xs text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    <span className="block truncate">Xem dịch vụ</span>
                  </button>

                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full overflow-hidden rounded-xl border border-white/12 bg-white/8 px-3 py-2.5 text-center text-xs text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    <span className="block truncate">Lịch sử đơn</span>
                  </button>

                  <button
                    onClick={() => navigate("/account")}
                    className="w-full overflow-hidden rounded-xl border border-white/12 bg-white/8 px-3 py-2.5 text-center text-xs text-white/75 transition hover:bg-white/12 hover:text-white"
                  >
                    <span className="block truncate">Tài khoản</span>
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