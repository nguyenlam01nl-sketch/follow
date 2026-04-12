import { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Wallet,
  User,
  Users,
  House,
  LogOut,
  X,
  MessageSquare,
  Mail,
  ShieldAlert,
  Network,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "../../api/axios";
import SidebarItem from "./SidebarItem";
import LogoSola from "../common/LogoSola";

type UserType = {
  id?: number;
  name?: string;
  email?: string;
  role?: "admin" | "user";
};

type MenuItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const rawUser = localStorage.getItem("user");
  const user: UserType | null = rawUser ? JSON.parse(rawUser) : null;
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
      background: "#0f172a",
      color: "#fff",
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

  const adminMenu: MenuItem[] = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/services", label: "Dịch vụ", icon: ShoppingBag },
    { to: "/admin/orders", label: "Đơn hàng", icon: FileText },
    { to: "/admin/wallet", label: "Ví tiền", icon: Wallet },
    { to: "/admin/feedback", label: "Góp ý", icon: MessageSquare },
    { to: "/admin/reports", label: "Báo cáo lừa đảo", icon: ShieldAlert },
    { to: "/admin/users", label: "Người dùng", icon: Users },
    { to: "/admin/email-notifications", label: "Thông báo mail", icon: Mail },
    { to: "/admin/affiliate", label: "Affiliate", icon: Network },
      { to: "/admin/ai-analyze", label: "Phân tích kênh", icon: Sparkles },

  ];

  const userMenu: MenuItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/services", label: "Dịch vụ", icon: ShoppingBag },
    { to: "/orders", label: "Đơn hàng", icon: FileText },
    { to: "/wallet", label: "Ví tiền", icon: Wallet },
    { to: "/feedback", label: "Góp ý", icon: MessageSquare },
    { to: "/report", label: "Báo cáo lừa đảo", icon: ShieldAlert },
    { to: "/affiliate", label: "Affiliate", icon: Network },
    { to: "/account", label: "Tài khoản", icon: User },
      { to: "/ai-analyze", label: "Phân tích kênh", icon: Sparkles },

  ];

  const menuItems: MenuItem[] = role === "admin" ? adminMenu : userMenu;

  const mobileQuickMenu: MenuItem[] = useMemo(() => {
    if (role === "admin") {
      return [
        { to: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
        { to: "/admin/services", label: "Dịch vụ", icon: ShoppingBag },
        { to: "/admin/orders", label: "Đơn", icon: FileText },
        { to: "/admin/wallet", label: "Ví", icon: Wallet },
      ];
    }

    return [
      { to: "/dashboard", label: "Home", icon: House },
      { to: "/services", label: "Dịch vụ", icon: ShoppingBag },
      { to: "/orders", label: "Đơn hàng", icon: FileText },
      { to: "/wallet", label: "Ví", icon: Wallet },
    ];
  }, [role]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-950/72 backdrop-blur-[2px] transition-all duration-300 xl:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-[82%] max-w-[300px] flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(8,18,40,0.98)_0%,rgba(3,10,24,0.98)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden border-b border-white/10 px-3.5 py-3.5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_right,rgba(217,70,239,0.16),transparent_30%)]" />

          <div className="relative flex items-center justify-between gap-3">
            <LogoSola size="md" variant="sidebar" />

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3 pb-24">
          <div className="mb-2 px-2.5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
              Main Menu
            </p>
          </div>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 via-sky-500/16 to-fuchsia-500/20 text-white ring-1 ring-white/10 shadow-[0_0_20px_rgba(34,211,238,0.14)]"
                      : "text-white/70 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {active && (
                    <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-fuchsia-500" />
                  )}

                  <span
                    className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border transition ${
                      active
                        ? "border-white/12 bg-white/10"
                        : "border-white/8 bg-white/[0.03] group-hover:bg-white/8"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.02] p-3">
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-sm font-semibold text-white ring-1 ring-white/10">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "Người dùng"}
                </p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  {role === "admin" ? "Administrator" : "User"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <aside className="hidden h-screen w-[270px] shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,rgba(10,20,40,0.92)_0%,rgba(6,12,26,0.95)_100%)] backdrop-blur-2xl xl:flex xl:flex-col">
        <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_right,rgba(217,70,239,0.12),transparent_30%)]" />

          <div className="relative flex items-center gap-3">
            <img
              src="/logo-sola.png"
              alt="Sola Vietnam"
              className="h-12 w-auto object-contain"
            />

            <div className="leading-tight">
              <h2 className="text-base font-semibold text-white">
                Sola Vietnam
              </h2>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                {role === "admin" ? "Admin Panel" : "Sola Vietnam"}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-4">
          <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.22em] text-white/30">
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

        <div className="border-t border-white/10 p-3.5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <p className="text-sm font-semibold text-white">
              {user?.name || "Người dùng"}
            </p>
            <p className="mt-1 text-[11px] text-white/45">
              {role === "admin" ? "Administrator" : "User"}
            </p>

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 px-2 py-2 backdrop-blur-xl xl:hidden">
        <div className="grid grid-cols-4 gap-1.5">
          {mobileQuickMenu.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex min-w-0 flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] transition ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/15 to-fuchsia-500/15 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white/85"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="mt-1 max-w-full truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Sidebar;