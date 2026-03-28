import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Tổng đơn hàng"
            value="1,284"
            subtext="Tăng 12% so với tuần trước"
            icon="🧾"
          />
          <StatCard
            title="Doanh thu"
            value="45.8M"
            subtext="Cập nhật theo thời gian thực"
            icon="💰"
          />
          <StatCard
            title="Người dùng"
            value="892"
            subtext="Đang hoạt động trên hệ thống"
            icon="👥"
          />
          <StatCard
            title="Dịch vụ"
            value="26"
            subtext="Đang mở bán"
            icon="🛍️"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Recent activity</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Đơn hàng gần đây
                </h2>
              </div>

              <button className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/70 transition hover:bg-white/12 hover:text-white">
                Xem tất cả
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <div>
                  <p className="font-medium text-white">Tăng follow Instagram</p>
                  <p className="mt-1 text-sm text-white/45">
                    #ORD-1024 • Đang xử lý
                  </p>
                </div>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <div>
                  <p className="font-medium text-white">Mở account Facebook</p>
                  <p className="mt-1 text-sm text-white/45">
                    #ORD-1023 • Hoàn thành
                  </p>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <div>
                  <p className="font-medium text-white">Dame bài viết</p>
                  <p className="mt-1 text-sm text-white/45">
                    #ORD-1022 • Đang xử lý
                  </p>
                </div>
                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                  In Progress
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Wallet</p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Số dư hiện tại
              </h2>

              <div className="mt-5 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-sky-400/20 to-fuchsia-500/20 p-5">
                <p className="text-sm text-white/55">Available balance</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  12,500,000đ
                </p>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.01]">
                Nạp tiền
              </button>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Quick actions</p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Thao tác nhanh
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Tạo đơn mới
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Thêm dịch vụ
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Xem user
                </button>
                <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
                  Cài đặt
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;