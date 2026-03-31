import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import BalanceCard from "@/components/wallet/BalanceCard";
import TransactionRow from "@/components/wallet/TransactionRow";
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
      <div className="space-y-4 px-2 sm:px-4">
        <div>
          <h1 className="text-lg font-semibold text-white sm:text-2xl">
            Ví tiền
          </h1>
          <p className="text-xs text-white/50 sm:text-sm">
            Quản lý số dư & giao dịch
          </p>
        </div>

        <div className="space-y-3">
          <BalanceCard balance={balance} />
          <DepositQR
            onDeposit={handleCreateDeposit}
            transferNote={transferNote}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[28px] sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white sm:text-lg">
              Lịch sử
            </h2>
          </div>

          <div className="mt-3 space-y-1.5">
            {loading ? (
              <div className="text-xs text-white/50 sm:text-sm">
                Đang tải...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-xs text-white/50 sm:text-sm">
                Chưa có giao dịch
              </div>
            ) : (
              transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={{
                    title: tx.title,
                    amount: Number(tx.amount),
                    type: tx.type,
                    date: new Date(tx.created_at).toLocaleDateString("vi-VN"),
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WalletPage;