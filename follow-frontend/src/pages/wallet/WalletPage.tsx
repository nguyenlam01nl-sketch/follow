import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import BalanceCard from "../../components/wallet/BalanceCard";
import TransactionRow from "../../components/wallet/TransactionRow";
import DepositQR from "../../components/wallet/DepositQR";

type Transaction = {
  title: string;
  amount: number;
  type: "deposit" | "payment";
  date: string;
};

const mockTransactions: Transaction[] = [
  {
    title: "Nạp tiền MoMo",
    amount: 500000,
    type: "deposit",
    date: "21/03/2026",
  },
  {
    title: "Mua dịch vụ Instagram Follow",
    amount: 120000,
    type: "payment",
    date: "20/03/2026",
  },
  {
    title: "Mua dịch vụ TikTok View",
    amount: 80000,
    type: "payment",
    date: "19/03/2026",
  },
];

function WalletPage() {
  const [balance] = useState(12500000);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ví tiền</h1>
          <p className="text-sm text-white/50">Quản lý số dư và giao dịch</p>
        </div>

        <BalanceCard balance={balance} />
        <DepositQR />

        <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Lịch sử giao dịch
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            {mockTransactions.map((tx, i) => (
              <TransactionRow key={i} tx={tx} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WalletPage;