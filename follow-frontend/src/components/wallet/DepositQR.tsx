import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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

  const handleCopyNote = async () => {
    if (!note) return;
    await navigator.clipboard.writeText(note);
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã copy nội dung",
      showConfirmButton: false,
      timer: 1400,
      background: "#08152d",
      color: "#fff",
    });
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(
      `${ACCOUNT} | ${amount} | ${note || "Chưa có nội dung"}`
    );
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã copy thông tin",
      showConfirmButton: false,
      timer: 1400,
      background: "#08152d",
      color: "#fff",
    });
  };

  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[22px] sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white sm:text-base">
            Nạp tiền qua QR
          </h2>
          <p className="text-[11px] text-white/50 sm:text-xs">
            Quét mã và giữ nguyên nội dung
          </p>
        </div>

        {onDeposit && (
          <button
            type="button"
            onClick={onDeposit}
            className="shrink-0 rounded-xl bg-[#1570ef] px-3 py-2 text-[11px] font-semibold text-white transition hover:brightness-110 sm:text-xs"
          >
            Tạo yêu cầu
          </button>
        )}
      </div>

      <div className="mt-3">
        <p className="mb-2 text-[11px] text-white/55 sm:text-xs">Mệnh giá</p>
        <div className="flex flex-wrap gap-2">
          {[50000, 100000, 200000, 500000, 1000000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] transition sm:text-xs ${
                amount === v
                  ? "border-white/20 bg-white/12 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {v.toLocaleString("vi-VN")}đ
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-white/55 sm:text-xs">
              Số tiền
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none sm:h-11"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/55 sm:text-xs">
              Nội dung chuyển khoản
            </label>

            <div className="mt-1 flex h-10 items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:h-11">
              <span className="min-w-0 truncate select-all text-xs font-medium tracking-wide text-white sm:text-sm">
                {note || "Chưa có nội dung"}
              </span>

              <button
                type="button"
                onClick={handleCopyNote}
                className="shrink-0 text-[11px] text-cyan-300 hover:underline"
              >
                Copy
              </button>
            </div>

            <p className="mt-1 text-[10px] text-red-300 sm:text-[11px]">
              Bắt buộc giữ nguyên nội dung khi chuyển khoản
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-white/45">Ngân hàng</div>
              <div className="mt-0.5 truncate font-medium text-white">
                Techcombank
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-white/45">Số tài khoản</div>
              <div className="mt-0.5 truncate font-medium text-white">
                {ACCOUNT}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <img
            src={qrUrl}
            alt="QR Code"
            className="h-36 w-36 rounded-xl bg-white p-2 sm:h-40 sm:w-40"
          />

          <button
            type="button"
            onClick={handleCopyAll}
            className="text-[11px] text-white/55 transition hover:text-white"
          >
            Copy toàn bộ thông tin
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositQR;