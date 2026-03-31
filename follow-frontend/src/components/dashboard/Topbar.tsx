import LogoSola from "../common/LogoSola";
import { Bell, Menu } from "lucide-react";

type Props = {
  onOpenSidebar?: () => void;
};

function Topbar({ onOpenSidebar }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl sm:px-6 sm:py-4 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition hover:bg-white/12 xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:block xl:hidden">
            <LogoSola size="sm" showText={false} variant="topbar" />
          </div>

          <div className="min-w-0 xl:hidden">
            <p className="text-xs text-white/45 sm:text-sm">Overview</p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Dashboard
            </h1>
          </div>

          <div className="hidden xl:block">
            <LogoSola size="md" variant="topbar" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden rounded-2xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/60 md:block">
            Xin chào, Nguyễn Lam
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/75 transition hover:bg-white/12 hover:text-white sm:rounded-2xl sm:px-4 sm:text-sm">
            <Bell className="h-4 w-4" />
            <span>Thông báo</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;