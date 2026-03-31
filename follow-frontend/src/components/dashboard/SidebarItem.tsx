import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  to: string;
  label: string;
  icon: LucideIcon;
};

function SidebarItem({ to, label, icon: Icon }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-cyan-500/20 via-sky-500/16 to-violet-500/20 text-white ring-1 ring-white/10 shadow-[0_0_20px_rgba(34,211,238,0.16)]"
            : "text-white/70 hover:bg-white/6 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-violet-500" />
          )}

          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
              isActive
                ? "border-white/12 bg-white/10"
                : "border-white/8 bg-white/[0.03] group-hover:bg-white/8"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>

          <span className="truncate font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default SidebarItem;