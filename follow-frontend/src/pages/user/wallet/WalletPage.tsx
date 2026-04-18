import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import BalanceCard from "@/components/wallet/BalanceCard";
import DepositQR from "@/components/wallet/DepositQR";
import api from "@/api/axios";
import Swal from "sweetalert2";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "deposit" | "payment";
  status: "pending" | "completed" | "failed";
  payment_method?: string | null;
  note?: string | null;
  created_at: string;
};

function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferNote, setTransferNote] = useState("");

  const formatMoney = (value: number | string) => {
    return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
  };

  const formatDate = (value: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusLabel = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "Xong";
      case "pending":
        return "Chờ";
      case "failed":
        return "Lỗi";
      default:
        return status;
    }
  };

  const getStatusClass = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/15 text-emerald-300";
      case "pending":
        return "bg-amber-500/15 text-amber-300";
      case "failed":
        return "bg-rose-500/15 text-rose-300";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      const [walletRes, txRes, userRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions"),
        api.get("/account"),
      ]);

      setBalance(Number(walletRes.data?.balance || 0));
      setTransactions(Array.isArray(txRes.data) ? txRes.data : []);

      const username =
        userRes.data?.username || userRes.data?.name || "user";

      setTransferNote(`solavietnam ${username}`);
    } catch (error) {
      console.error("Lỗi load wallet:", error);
      await Swal.fire({
        title: "Lỗi!",
        text: "Không tải được dữ liệu ví",
        icon: "error",
        confirmButtonColor: "#2F80ED",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 pb-4 sm:space-y-5 sm:px-4 sm:pb-6">
        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            Ví tiền
          </h1>
          <p className="text-[11px] text-white/50 sm:text-xs">
            Quản lý số dư và giao dịch
          </p>
        </div>

        <BalanceCard balance={balance} />

        <DepositQR transferNote={transferNote} />

        <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[24px] sm:p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Lịch sử giao dịch
            </h2>
          </div>

          <div className="mt-3">
            {loading ? (
              <div className="text-xs text-white/50 sm:text-sm">
                Đang tải...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-xs text-white/50 sm:text-sm">
                Chưa có giao dịch
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-0 sm:divide-y sm:divide-white/10">
                <div className="hidden grid-cols-[minmax(0,1.6fr)_110px_90px] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:grid">
                  <div>Nội dung</div>
                  <div className="text-right">Số tiền</div>
                  <div className="text-right">Trạng thái</div>
                </div>

                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white sm:grid sm:grid-cols-[minmax(0,1.6fr)_110px_90px] sm:items-center sm:rounded-none sm:border-0 sm:bg-transparent sm:px-3 sm:py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">
                        {tx.title}
                      </div>
                      <div className="mt-1 text-[10px] text-white/40 sm:truncate">
                        {formatDate(tx.created_at)}
                        {tx.note ? ` • ${tx.note}` : ""}
                      </div>
                    </div>

                    <div
                      className={`mt-2 text-[11px] font-semibold sm:mt-0 sm:text-right sm:text-xs ${
                        tx.type === "deposit"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatMoney(tx.amount)}
                    </div>

                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] ${getStatusClass(
                          tx.status
                        )}`}
                      >
                        {getStatusLabel(tx.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WalletPage;