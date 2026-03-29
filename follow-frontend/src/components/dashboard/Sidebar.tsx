import SidebarItem from "./SidebarItem";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: "admin" | "user";
};

function Sidebar() {
  const navigate = useNavigate();

  const rawUser = localStorage.getItem("user");
  const user: User | null = rawUser ? JSON.parse(rawUser) : null;
  const role = user?.role || "user";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có chắc muốn đăng xuất không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F80ED",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout API lỗi:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const adminMenu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/services", label: "Dịch vụ", icon: "🛍️" },
    { to: "/admin/orders", label: "Đơn hàng", icon: "🧾" },
    { to: "/admin/wallet", label: "Ví tiền", icon: "💳" },
    { to: "/admin/users", label: "Người dùng", icon: "👥" },
    // { to: "/admin/settings", label: "Cài đặt", icon: "⚙️" },
  ];

  const userMenu = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/services", label: "Dịch vụ", icon: "🛍️" },
    { to: "/orders", label: "Đơn hàng", icon: "🧾" },
    { to: "/wallet", label: "Ví tiền", icon: "💳" },
    { to: "/account", label: "Tài khoản", icon: "👤" },
    // { to: "/settings", label: "Cài đặt", icon: "⚙️" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <aside className="hidden h-screen w-[270px] shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 font-bold text-white shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
            F
            <div className="absolute inset-0 rounded-2xl border border-white/20" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Follow Market</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              {role === "admin" ? "Admin panel" : "User panel"}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-2 text-xs uppercase tracking-[0.18em] text-white/35">
          Main Menu
        </p>

        <div className="space-y-2 pb-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
          <p className="text-sm font-medium text-white">
            {user?.name || "Người dùng"}
          </p>
          <p className="mt-1 text-xs text-white/45">
            {role === "admin" ? "Administrator" : "User"}
          </p>

          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;