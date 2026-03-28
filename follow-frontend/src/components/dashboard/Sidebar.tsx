import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <aside className="hidden w-[270px] border-r border-white/10 bg-white/5 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 font-bold text-white shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
            F
            <div className="absolute inset-0 rounded-2xl border border-white/20" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Follow Market</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Admin panel
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5">
        <p className="mb-3 px-2 text-xs uppercase tracking-[0.18em] text-white/35">
          Main Menu
        </p>

        <div className="space-y-2">
          <SidebarItem to="/dashboard" label="Dashboard" icon="📊" active />
          <SidebarItem to="/services" label="Dịch vụ" icon="🛍️" />
          <SidebarItem to="/orders" label="Đơn hàng" icon="🧾" />
          <SidebarItem to="/wallet" label="Ví tiền" icon="💳" />
          <SidebarItem to="/users" label="Người dùng" icon="👥" />
          <SidebarItem to="/settings" label="Cài đặt" icon="⚙️" />
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
          <p className="text-sm font-medium text-white">Nguyễn Lam</p>
          <p className="mt-1 text-xs text-white/45">Administrator</p>

          <button className="mt-4 w-full rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;