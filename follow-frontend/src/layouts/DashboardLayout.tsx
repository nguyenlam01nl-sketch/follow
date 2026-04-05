import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%),linear-gradient(135deg,#07111f_0%,#0a1630_45%,#081120_100%)]" />

        <div className="absolute left-[-100px] top-[-100px] -z-10 h-[220px] w-[220px] rounded-full bg-cyan-400/20 blur-3xl sm:h-[280px] sm:w-[280px]" />
        <div className="absolute bottom-[-120px] right-[-80px] -z-10 h-[240px] w-[240px] rounded-full bg-fuchsia-500/20 blur-3xl sm:h-[300px] sm:w-[300px]" />

        <div className="flex min-h-screen w-full">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <Topbar onOpenSidebar={() => setMobileOpen(true)} />

            <main className="flex-1 w-full min-w-0 px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pb-8 lg:pt-5">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;