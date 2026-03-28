import DashboardLayout from "../../../layouts/DashboardLayout";

function AdminDashboardPage() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,248",
      sub: "+12 user hôm nay",
    },
    {
      title: "Tổng đơn hàng",
      value: "3,560",
      sub: "+86 đơn mới",
    },
    {
      title: "Doanh thu",
      value: "128,500,000đ",
      sub: "+8,200,000đ hôm nay",
    },
    {
      title: "Đơn chờ xử lý",
      value: "42",
      sub: "Cần kiểm tra ngay",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1001",
      service: "Instagram Follow",
      user: "Nguyễn Lam",
      amount: "120,000đ",
      status: "pending",
    },
    {
      id: "#ORD-1002",
      service: "TikTok View",
      user: "User A",
      amount: "80,000đ",
      status: "completed",
    },
    {
      id: "#ORD-1003",
      service: "Account Recovery Support",
      user: "User B",
      amount: "500,000đ",
      status: "processing",
    },
  ];

  const recentUsers = [
    {
      name: "Nguyễn Lam",
      email: "lam@gmail.com",
      joined: "29/03/2026",
    },
    {
      name: "User A",
      email: "usera@gmail.com",
      joined: "28/03/2026",
    },
    {
      name: "User B",
      email: "userb@gmail.com",
      joined: "28/03/2026",
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-400/10 text-amber-300 border border-amber-400/20";
      case "completed":
        return "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20";
      case "processing":
        return "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20";
      default:
        return "bg-white/10 text-white border border-white/10";
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
            Quản trị tổng quan hệ thống, đơn hàng, người dùng và doanh thu.
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
              {recentOrders.map((order) => (
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
                        {order.id} • {order.user}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">
                        {order.amount}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Users</p>
              <h2 className="text-xl font-semibold text-white">
                Người dùng mới
              </h2>

              <div className="mt-5 space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.email}
                    className="rounded-2xl border border-white/10 bg-white/6 p-4"
                  >
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="mt-1 text-sm text-white/50">{user.email}</p>
                    <p className="mt-2 text-xs text-white/40">
                      Tham gia: {user.joined}
                    </p>
                  </div>
                ))}
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