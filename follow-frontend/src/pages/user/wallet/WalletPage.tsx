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

  const handleCreateDeposit = async () => {
    try {
      const userRes = await api.get("/account");
      const username = userRes.data?.username || userRes.data?.name || "user";

      const { value: amount } = await Swal.fire({
        title: "Nạp tiền",
        input: "number",
        inputLabel: "Nhập số tiền",
        inputPlaceholder: "500000",
        showCancelButton: true,
        confirmButtonText: "Tạo",
        cancelButtonText: "Huỷ",
        confirmButtonColor: "#2F80ED",
        inputValidator: (value) => {
          if (!value) return "Nhập số tiền";
          if (Number(value) < 1000) return "Tối thiểu 1.000đ";
          return null;
        },
      });

      if (!amount) return;

      const transferContent = `solavietnam ${username}`;
      setTransferNote(transferContent);

      const res = await api.post("/wallet/deposit", {
        amount: Number(amount),
        payment_method: "bank_transfer",
        content: transferContent,
      });

      const qrInfo = res.data?.qr_info;
      setTransferNote(qrInfo?.content || transferContent);

      await Swal.fire({
        title: "Tạo thành công",
        html: `
          <div style="text-align:left;font-size:14px">
            <p><b>Ngân hàng:</b> ${qrInfo?.bank_name || ""}</p>
            <p><b>STK:</b> ${qrInfo?.account_number || ""}</p>
            <p><b>Chủ TK:</b> ${qrInfo?.account_name || ""}</p>
            <p><b>Nội dung:</b> ${qrInfo?.content || transferContent}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#2F80ED",
      });

      fetchWalletData();
    } catch (error: any) {
      await Swal.fire({
        title: "Lỗi!",
        text:
          error?.response?.data?.message ||
          "Không thể tạo yêu cầu nạp tiền",
        icon: "error",
        confirmButtonColor: "#2F80ED",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 px-2.5 sm:px-4">
        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            Ví tiền
          </h1>
          <p className="text-[11px] text-white/50 sm:text-xs">
            Quản lý số dư và giao dịch
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          <BalanceCard balance={balance} />
          <DepositQR
            onDeposit={handleCreateDeposit}
            transferNote={transferNote}
          />
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[22px] sm:p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Lịch sử
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
              <div className="divide-y divide-white/10">
                <div className="grid grid-cols-[minmax(0,1.6fr)_100px_84px] px-2 py-2 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:px-3">
                  <div>Nội dung</div>
                  <div className="text-right">Số tiền</div>
                  <div className="text-right">Trạng thái</div>
                </div>

                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="grid grid-cols-[minmax(0,1.6fr)_100px_84px] items-center px-2 py-2 text-xs text-white sm:px-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">
                        {tx.title}
                      </div>
                      <div className="mt-0.5 truncate text-[10px] text-white/40">
                        {formatDate(tx.created_at)}
                        {tx.note ? ` • ${tx.note}` : ""}
                      </div>
                    </div>

                    <div
                      className={`text-right text-[11px] font-semibold sm:text-xs ${
                        tx.type === "deposit"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatMoney(tx.amount)}
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[10px] ${getStatusClass(
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