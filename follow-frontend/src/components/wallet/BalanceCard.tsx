type Props = {
  balance: number;
};

function BalanceCard({ balance }: Props) {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      
      <p className="text-sm text-white/50">Số dư hiện tại</p>

      <h2 className="mt-2 text-3xl font-semibold text-white">
        {balance.toLocaleString()}đ
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-3 text-sm font-semibold">
          Nạp tiền
        </button>

        <button className="rounded-xl border border-white/12 bg-white/8 py-3 text-sm text-white/70 hover:bg-white/12">
          Lịch sử
        </button>
      </div>
    </div>
  );
}

export default BalanceCard;