import { Link } from "react-router-dom";

type Props = {
  to: string;
  label: string;
  icon: string;
  active?: boolean;
};

function SidebarItem({ to, label, icon, active = false }: Props) {
  return (
    <Link
      to={to}
      className={[
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
        active
          ? "border border-cyan-300/20 bg-white/12 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
          : "text-white/65 hover:bg-white/8 hover:text-white",
      ].join(" ")}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default SidebarItem;