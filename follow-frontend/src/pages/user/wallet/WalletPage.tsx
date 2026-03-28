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

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      const [walletRes, txRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions"),
      ]);

      setBalance(Number(walletRes.data?.balance || 0));
      setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
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
    const { value: amount } = await Swal.fire({
      title: "Nạp tiền",
      input: "number",
      inputLabel: "Nhập số tiền muốn nạp",
      inputPlaceholder: "Ví dụ: 500000",
      showCancelButton: true,
      confirmButtonText: "Tạo yêu cầu",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#2F80ED",
      inputValidator: (value) => {
        if (!value) return "Vui lòng nhập số tiền";
        if (Number(value) < 1000) return "Số tiền tối thiểu là 1.000đ";
        return null;
      },
    });

    if (!amount) return;

    try {
      const res = await api.post("/wallet/deposit", {
        amount: Number(amount),
        payment_method: "bank_transfer",
      });

      const qrInfo = res.data?.qr_info;

      await Swal.fire({
        title: "Tạo yêu cầu thành công",
        html: `
          <div style="text-align:left">
            <p><b>Ngân hàng:</b> ${qrInfo?.bank_name || ""}</p>
            <p><b>Số tài khoản:</b> ${qrInfo?.account_number || ""}</p>
            <p><b>Chủ tài khoản:</b> ${qrInfo?.account_name || ""}</p>
            <p><b>Nội dung CK:</b> ${qrInfo?.content || ""}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#2F80ED",
      });

      fetchWalletData();
    } catch (error: any) {
      await Swal.fire({
        title: "Lỗi!",
        text: error?.response?.data?.message || "Không thể tạo yêu cầu nạp tiền",
        icon: "error",
        confirmButtonColor: "#2F80ED",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ví tiền</h1>
          <p className="text-sm text-white/50">Quản lý số dư và giao dịch</p>
        </div>

        <BalanceCard balance={balance} />
        <DepositQR onDeposit={handleCreateDeposit} />

        <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Lịch sử giao dịch
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="text-sm text-white/50">Đang tải...</div>
            ) : transactions.length === 0 ? (
              <div className="text-sm text-white/50">Chưa có giao dịch nào</div>
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