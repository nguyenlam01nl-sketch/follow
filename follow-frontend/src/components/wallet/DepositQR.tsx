import { useEffect, useState } from "react";

const BANK = "techcombank";
const ACCOUNT = "19037432671013";
const ACCOUNT_NAME = "Nguyen Lam";

function generateCode() {
  return "TF" + Math.floor(100000 + Math.random() * 900000);
}

type DepositQRProps = {
  onDeposit?: () => void | Promise<void>;
};

function DepositQR({ onDeposit }: DepositQRProps) {
  const [amount, setAmount] = useState<number>(100000);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setNote(generateCode());
  }, []);

  const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    note
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="space-y-5 rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Nạp tiền qua QR</h2>
          <p className="text-sm text-white/50">
            Quét mã để chuyển khoản, giữ nguyên nội dung
          </p>
        </div>

        {onDeposit && (
          <button
            type="button"
            onClick={onDeposit}
            className="rounded-xl bg-[#1570ef] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Tạo yêu cầu nạp
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm text-white/60">Chọn mệnh giá</p>
        <div className="flex flex-wrap gap-2">
          {[50000, 100000, 200000, 500000, 1000000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                amount === v
                  ? "border-white/20 bg-white/12 text-white"
                  : "border-white/10 bg-white/6 text-white/60 hover:bg-white/10"
              }`}
            >
              {v.toLocaleString()}đ
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-white/60">Số tiền</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
        />
      </div>

      <div>
        <label className="text-sm text-white/60">Nội dung chuyển khoản</label>

        <div className="mt-1 flex h-12 items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4">
          <span className="select-all font-semibold tracking-wider text-white">
            {note}
          </span>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(note)}
            className="text-xs text-cyan-300 hover:underline"
          >
            Copy
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-red-300">
            ⚠️ Bắt buộc giữ nguyên nội dung khi chuyển khoản
          </p>

          <button
            type="button"
            onClick={() => setNote(generateCode())}
            className="text-xs text-white/50 hover:text-white"
          >
            Tạo mã mới
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <img
          src={qrUrl}
          alt="QR Code"
          className="h-56 w-56 rounded-xl bg-white p-2"
        />

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(`${ACCOUNT} | ${amount} | ${note}`)
          }
          className="text-xs text-white/50 hover:text-white"
        >
          Copy toàn bộ thông tin
        </button>
      </div>
    </div>
  );
}

export default DepositQR;