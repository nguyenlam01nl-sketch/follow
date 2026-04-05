import { CheckCircle2, ArrowRight, LayoutDashboard, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Đặt hàng thành công
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              Cảm ơn bạn đã sử dụng dịch vụ tại Sola Vietnam. Đơn hàng của bạn đã được ghi nhận
              và đang được hệ thống xử lý.
            </p>

            <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              <p className="text-sm text-white/80">
                Bạn có thể theo dõi trạng thái đơn hàng trong phần quản lý đơn.
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" />
                Xem đơn hàng
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowRight className="h-4 w-4" />
                Tiếp tục mua dịch vụ
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                Về dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}