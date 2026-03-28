type Transaction = {
  title: string;
  amount: number;
  type: "deposit" | "payment";
  date: string;
};

type Props = {
  tx: Transaction;
};

function TransactionRow({ tx }: Props) {
  const isPlus = tx.type === "deposit";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm">
      <div>
        <p className="font-medium text-white">{tx.title}</p>
        <p className="mt-1 text-xs text-white/45">{tx.date}</p>
      </div>

      <div
        className={
          isPlus
            ? "font-semibold text-emerald-300"
            : "font-semibold text-red-300"
        }
      >
        {isPlus ? "+" : "-"}
        {tx.amount.toLocaleString()}đ
      </div>
    </div>
  );
}

export default TransactionRow;