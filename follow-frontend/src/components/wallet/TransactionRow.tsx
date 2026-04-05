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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-2 py-2 text-xs last:border-b-0 sm:px-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{tx.title}</p>
        <p className="mt-0.5 text-[10px] text-white/45">{tx.date}</p>
      </div>

      <div
        className={
          isPlus
            ? "text-right text-[11px] font-semibold text-emerald-300 sm:text-xs"
            : "text-right text-[11px] font-semibold text-rose-300 sm:text-xs"
        }
      >
        {isPlus ? "+" : "-"}
        {tx.amount.toLocaleString("vi-VN")}đ
      </div>
    </div>
  );
}

export default TransactionRow;