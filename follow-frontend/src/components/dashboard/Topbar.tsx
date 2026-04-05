import LogoSola from "../common/LogoSola";
import { Bell, Menu } from "lucide-react";

type Props = {
  onOpenSidebar?: () => void;
};

function Topbar({ onOpenSidebar }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08111f]/78 px-3 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3 lg:px-6">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition hover:bg-white/12 xl:hidden"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          <div className="hidden sm:block xl:hidden">
            <LogoSola size="sm" showText={false} variant="topbar" />
          </div>

          <div className="min-w-0 xl:hidden">
            <p className="text-[10px] text-white/45 sm:text-xs">Overview</p>
            <h1 className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
              Dashboard
            </h1>
          </div>

          <div className="hidden xl:block">
            <LogoSola size="md" variant="topbar" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden rounded-xl border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/60 md:block">
            Xin chào, Nguyễn Lam
          </div>

          <button className="flex h-9 items-center gap-1.5 rounded-xl border border-white/12 bg-white/8 px-3 text-[11px] text-white/75 transition hover:bg-white/12 hover:text-white sm:h-10 sm:px-3.5 sm:text-xs">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;