import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  Wallet,
  Search,
  PlusCircle,
  MinusCircle,
  RefreshCcw,
  Landmark,
  Users,
} from "lucide-react";

type UserWalletItem = {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: string;
  wallet_balance: number | string;
  total_deposit: number | string;
};

type WalletStats = {
  total_deposit_all: number | string;
  total_payment_all: number | string;
  total_balance_all_users: number | string;
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

export default function AdminWalletPage() {
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [users, setUsers] = useState<UserWalletItem[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    total_deposit_all: 0,
    total_payment_all: 0,
    total_balance_all_users: 0,
  });
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, statsRes] = await Promise.all([
        api.get("/admin/wallet/users"),
        api.get("/admin/wallet/stats"),
      ]);

      const usersData = usersRes.data?.data || usersRes.data || [];
      const statsData = statsRes.data?.data || {};

      setUsers(Array.isArray(usersData) ? usersData : []);
      setStats({
        total_deposit_all: statsData.total_deposit_all ?? 0,
        total_payment_all: statsData.total_payment_all ?? 0,
        total_balance_all_users: statsData.total_balance_all_users ?? 0,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tải được dữ liệu ví");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return users;

    return users.filter((user) => {
      return (
        String(user.name || "").toLowerCase().includes(q) ||
        String(user.username || "").toLowerCase().includes(q) ||
        String(user.email || "").toLowerCase().includes(q)
      );
    });
  }, [users, keyword]);

  const handleAdjustWallet = async (
    user: UserWalletItem,
    type: "add" | "subtract"
  ) => {
    const actionText = type === "add" ? "cộng" : "trừ";
    const actionTitle = type === "add" ? "Cộng tiền" : "Trừ tiền";

    const { value: formValues } = await Swal.fire({
      title: `${actionTitle} cho ${user.name}`,
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <label style="font-size:14px;">Số tiền</label>
          <input id="swal-amount" type="number" min="0" class="swal2-input" placeholder="Nhập số tiền" style="margin:0;width:100%;" />
          <label style="font-size:14px;">Ghi chú</label>
          <input id="swal-note" type="text" class="swal2-input" placeholder="Ví dụ: admin điều chỉnh ví" style="margin:0;width:100%;" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: actionTitle,
      cancelButtonText: "Huỷ",
      confirmButtonColor: type === "add" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#9CA3AF",
      preConfirm: () => {
        const amountInput = document.getElementById("swal-amount") as HTMLInputElement | null;
        const noteInput = document.getElementById("swal-note") as HTMLInputElement | null;

        const amount = Number(amountInput?.value || 0);
        const note = noteInput?.value?.trim() || "";

        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Vui lòng nhập số tiền hợp lệ");
          return;
        }

        return { amount, note };
      },
    });

    if (!formValues) return;

    const confirm = await Swal.fire({
      title: `Xác nhận ${actionText} tiền?`,
      text: `${actionTitle} ${formatMoney(formValues.amount)} cho ${user.name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
      confirmButtonColor: type === "add" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#9CA3AF",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmittingId(user.id);

      Swal.fire({
        title: "Đang xử lý...",
        text: "Vui lòng chờ một chút",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await api.post("/admin/wallet/adjust", {
        user_id: user.id,
        type,
        amount: formValues.amount,
        note: formValues.note || null,
      });

      await fetchWalletData();

      Swal.close();

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Đã ${actionText} ${formatMoney(formValues.amount)} cho ${user.name}`,
        confirmButtonColor: "#2F80ED",
      });
    } catch (err: any) {
      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err?.response?.data?.message || `Không thể ${actionText} tiền`,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[30px] border border-white/10 bg-[#08152d] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Wallet size={26} className="text-emerald-400" />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-white">
                  QUẢN LÝ VÍ NGƯỜI DÙNG
                </h1>
                <p className="mt-1 text-white/45">
                  Theo dõi tổng nạp, số dư hiện tại và cộng/trừ tiền cho user.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchWalletData}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08]"
            >
              <RefreshCcw size={16} />
              Tải lại
            </button>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex items-center gap-3">
                <Landmark size={20} className="text-emerald-300" />
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200/80">
                  Tổng nạp toàn web
                </p>
              </div>

              <p className="mt-3 text-3xl font-extrabold text-emerald-300">
                {formatMoney(stats.total_deposit_all)}
              </p>
            </div>

            <div className="rounded-[24px] border border-blue-400/20 bg-blue-400/10 p-5">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-300" />
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-200/80">
                  Tổng tiền hiện có
                </p>
              </div>

              <p className="mt-3 text-3xl font-extrabold text-blue-300">
                {formatMoney(stats.total_balance_all_users)}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Tổng tiền đã thanh toán
              </p>

              <p className="mt-3 text-3xl font-extrabold text-white">
                {formatMoney(stats.total_payment_all)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#050b1a] px-4">
              <Search size={18} className="text-white/40" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên, username hoặc email..."
                className="h-full w-full bg-transparent text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Đang tải dữ liệu ví...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[28px] border border-red-400/20 bg-red-400/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Không có user nào phù hợp.
          </div>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid gap-5">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-[28px] border border-white/10 bg-[#08152d] p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <p className="text-sm text-white/55">@{user.username}</p>
                    <p className="text-sm text-white/45">{user.email}</p>

                    {user.role && (
                      <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
                        {user.role}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px]">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
                      <p className="text-sm text-white/45">Số dư hiện tại</p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-400">
                        {formatMoney(user.wallet_balance)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-4">
                      <p className="text-sm text-white/45">Tổng đã nạp</p>
                      <p className="mt-1 text-2xl font-extrabold text-yellow-300">
                        {formatMoney(user.total_deposit)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={submittingId === user.id}
                    onClick={() => handleAdjustWallet(user, "add")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 text-sm font-bold text-emerald-300 transition hover:brightness-110 disabled:opacity-60"
                  >
                    <PlusCircle size={16} />
                    Cộng tiền
                  </button>

                  <button
                    type="button"
                    disabled={submittingId === user.id}
                    onClick={() => handleAdjustWallet(user, "subtract")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 text-sm font-bold text-red-300 transition hover:brightness-110 disabled:opacity-60"
                  >
                    <MinusCircle size={16} />
                    Trừ tiền
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}