import { useEffect, useState } from "react";

const BANK = "techcombank";
const ACCOUNT = "19037432671013";
const ACCOUNT_NAME = "Nguyen Lam";

type DepositQRProps = {
  onDeposit?: () => void | Promise<void>;
  transferNote?: string;
};

function DepositQR({ onDeposit, transferNote }: DepositQRProps) {
  const [amount, setAmount] = useState<number>(100000);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setNote(transferNote || "");
  }, [transferNote]);

  const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    note
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="space-y-4 rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-2xl sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white sm:text-lg">
            Nạp tiền qua QR
          </h2>
          <p className="text-xs text-white/50 sm:text-sm">
            Quét mã để chuyển khoản, giữ nguyên nội dung
          </p>
        </div>

        {onDeposit && (
          <button
            type="button"
            onClick={onDeposit}
            className="shrink-0 rounded-xl bg-[#1570ef] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110 sm:px-4 sm:text-sm"
          >
            Tạo yêu cầu nạp
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs text-white/60 sm:text-sm">Chọn mệnh giá</p>
        <div className="flex flex-wrap gap-2">
          {[50000, 100000, 200000, 500000, 1000000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className={`rounded-xl border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
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
        <label className="text-xs text-white/60 sm:text-sm">Số tiền</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="mt-1 h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none sm:h-12 sm:text-base"
        />
      </div>

      <div>
        <label className="text-xs text-white/60 sm:text-sm">
          Nội dung chuyển khoản
        </label>

        <div className="mt-1 flex h-11 items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/10 px-4 sm:h-12">
          <span className="min-w-0 truncate select-all text-sm font-semibold tracking-wide text-white sm:text-base">
            {note || "Chưa có nội dung"}
          </span>

          <button
            type="button"
            onClick={() => note && navigator.clipboard.writeText(note)}
            className="shrink-0 text-xs text-cyan-300 hover:underline"
          >
            Copy
          </button>
        </div>

        <div className="mt-2">
          <p className="text-[11px] text-red-300 sm:text-xs">
            ⚠️ Bắt buộc giữ nguyên nội dung khi chuyển khoản
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <img
          src={qrUrl}
          alt="QR Code"
          className="h-44 w-44 rounded-xl bg-white p-2 sm:h-56 sm:w-56"
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