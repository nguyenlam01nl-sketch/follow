import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../api/axios";

type AdminNotificationItem = {
  id: number;
  title: string;
  content: string;
  is_popup: boolean;
  is_active?: boolean;
  created_at: string;
};

type AdminDashboardResponse = {
  data: {
    stats: {
      total_users: number;
      total_orders: number;
      total_revenue: number;
      pending_orders: number;
    };
    recent_orders: {
      id: number;
      code: string;
      service: string;
      user: string;
      amount: number;
      status: string;
      created_at: string;
    }[];
    recent_users: {
      id: number;
      name: string;
      email: string;
      joined: string;
    }[];
    notifications: AdminNotificationItem[];
  };
};

function formatVND(value: number | string) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

function AdminDashboardPage() {
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    content: "",
    is_popup: true,
  });

  const [stats, setStats] = useState([
    {
      title: "Tổng người dùng",
      value: "...",
      sub: "Đang tải dữ liệu",
    },
    {
      title: "Tổng đơn hàng",
      value: "...",
      sub: "Đang tải dữ liệu",
    },
    {
      title: "Doanh thu",
      value: "...",
      sub: "Đang tải dữ liệu",
    },
    {
      title: "Đơn chờ xử lý",
      value: "...",
      sub: "Đang tải dữ liệu",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState<
    AdminDashboardResponse["data"]["recent_orders"]
  >([]);

  const [recentUsers, setRecentUsers] = useState<
    AdminDashboardResponse["data"]["recent_users"]
  >([]);

  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-400/10 text-amber-300 border border-amber-400/20";
      case "completed":
      case "success":
        return "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
      case "processing":
        return "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20";
      case "cancelled":
        return "bg-rose-400/10 text-rose-300 border border-rose-400/20";
      default:
        return "bg-white/10 text-white border border-white/10";
    }
  };

  const getStatusLabel = (status: string) => {
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
  };

  const handleChangeNotification = (
    field: "title" | "content" | "is_popup",
    value: string | boolean
  ) => {
    setNotificationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get<AdminDashboardResponse>("/admin/dashboard");
      const dashboard = res.data.data;

      setStats([
        {
          title: "Tổng người dùng",
          value: String(dashboard.stats.total_users ?? 0),
          sub: "Tổng số tài khoản trong hệ thống",
        },
        {
          title: "Tổng đơn hàng",
          value: String(dashboard.stats.total_orders ?? 0),
          sub: "Tổng số đơn đã tạo",
        },
        {
          title: "Doanh thu",
          value: formatVND(dashboard.stats.total_revenue ?? 0),
          sub: "Tổng doanh thu đơn hoàn thành",
        },
        {
          title: "Đơn chờ xử lý",
          value: String(dashboard.stats.pending_orders ?? 0),
          sub: "Cần kiểm tra ngay",
        },
      ]);

      setRecentOrders(dashboard.recent_orders || []);
      setRecentUsers(dashboard.recent_users || []);
      setNotifications(dashboard.notifications || []);
    } catch (error) {
      console.error("Lỗi lấy dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSubmitNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/admin/notifications", {
        title: notificationForm.title.trim(),
        content: notificationForm.content.trim(),
        is_popup: notificationForm.is_popup,
      });

      const newNotification = res.data.data;

      setNotifications((prev) => [newNotification, ...prev]);

      setNotificationForm({
        title: "",
        content: "",
        is_popup: true,
      });

      alert("Đăng thông báo thành công.");
    } catch (error) {
      console.error("Lỗi đăng thông báo:", error);
      alert("Có lỗi xảy ra khi đăng thông báo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-white/45">Admin overview</p>
          <h1 className="text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Quản trị tổng quan hệ thống, đơn hàng, người dùng, doanh thu và thông báo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-2xl"
            >
              <p className="text-sm text-white/45">{item.title}</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                {item.value}
              </h3>
              <p className="mt-2 text-sm text-white/55">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">Orders</p>
                  <h2 className="text-xl font-semibold text-white">
                    Đơn hàng gần đây
                  </h2>
                </div>

                <button className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white">
                  Xem tất cả
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Đang tải dữ liệu...
                  </div>
                ) : recentOrders.length ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-white">
                            {order.service}
                          </p>
                          <p className="mt-1 text-sm text-white/50">
                            #{order.code} • {order.user}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-white">
                            {formatVND(order.amount)}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Chưa có đơn hàng nào.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Notifications</p>
              <h2 className="text-xl font-semibold text-white">
                Đăng thông báo
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) =>
                      handleChangeNotification("title", e.target.value)
                    }
                    placeholder="Nhập tiêu đề thông báo"
                    className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Nội dung
                  </label>
                  <textarea
                    rows={5}
                    value={notificationForm.content}
                    onChange={(e) =>
                      handleChangeNotification("content", e.target.value)
                    }
                    placeholder="Nhập nội dung thông báo"
                    className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={notificationForm.is_popup}
                    onChange={(e) =>
                      handleChangeNotification("is_popup", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Hiển thị popup cho người dùng
                </label>

                <button
                  onClick={handleSubmitNotification}
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Đang đăng..." : "Đăng thông báo"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Users</p>
              <h2 className="text-xl font-semibold text-white">
                Người dùng mới
              </h2>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Đang tải dữ liệu...
                  </div>
                ) : recentUsers.length ? (
                  recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                    >
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="mt-1 text-sm text-white/50">{user.email}</p>
                      <p className="mt-2 text-xs text-white/40">
                        Tham gia: {user.joined}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Chưa có người dùng mới.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Danh sách thông báo</p>
              <h2 className="text-xl font-semibold text-white">
                Thông báo đã đăng
              </h2>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Đang tải dữ liệu...
                  </div>
                ) : notifications.length ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-white/55">
                            {item.content}
                          </p>
                          <p className="mt-2 text-xs text-white/35">
                            {new Date(item.created_at).toLocaleString("vi-VN")}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                            item.is_popup
                              ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                              : "border border-white/10 bg-white/10 text-white/70"
                          }`}
                        >
                          {item.is_popup ? "Popup" : "Thường"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4 text-white/60">
                    Chưa có thông báo nào.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Quick actions</p>
              <h2 className="text-xl font-semibold text-white">
                Thao tác nhanh
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Quản lý dịch vụ
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Quản lý đơn
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Quản lý ví
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Cài đặt hệ thống
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;