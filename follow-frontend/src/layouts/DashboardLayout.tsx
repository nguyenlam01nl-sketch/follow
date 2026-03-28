import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%),linear-gradient(135deg,#07111f_0%,#0a1630_45%,#081120_100%)]" />

        <div className="absolute left-[-100px] top-[-100px] -z-10 h-[280px] w-[280px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] -z-10 h-[300px] w-[300px] rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />

            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;