type Props = {
  balance: number;
  onDepositClick?: () => void;
  onHistoryClick?: () => void;
};

function BalanceCard({
  balance,
  onDepositClick,
  onHistoryClick,
}: Props) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[22px] sm:p-4">
      <p className="text-[11px] text-white/50 sm:text-xs">Số dư hiện tại</p>

      <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
        {balance.toLocaleString("vi-VN")}đ
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onDepositClick}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-slate-950 sm:py-2.5 sm:text-sm"
        >
          Nạp tiền
        </button>

        <button
          type="button"
          onClick={onHistoryClick}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 transition hover:bg-white/10 sm:py-2.5 sm:text-sm"
        >
          Lịch sử
        </button>
      </div>
    </div>
  );
}

export default BalanceCard;