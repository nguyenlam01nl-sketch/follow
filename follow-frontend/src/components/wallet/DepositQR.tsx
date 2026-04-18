import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BANK = "techcombank";
const ACCOUNT = "19037432671013";
const ACCOUNT_NAME = "Nguyen Lam";

type DepositQRProps = {
  transferNote?: string;
};

function DepositQR({ transferNote }: DepositQRProps) {
  const [amount, setAmount] = useState<number>(100000);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setNote(transferNote || "");
  }, [transferNote]);

  const qrUrl = `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    note
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // ✅ COPY nội dung
  const handleCopyNote = async () => {
    if (!note) return;
    await navigator.clipboard.writeText(note);
    Swal.fire({
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

  // ✅ COPY full info
  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(
      `${ACCOUNT} | ${amount} | ${note || "Chưa có nội dung"}`
    );
    Swal.fire({
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

  // 🔥 DOWNLOAD QR (auto tải mobile + desktop)
  const handleDownloadQR = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `vietqr-${amount}.png`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đã tải mã QR",
        showConfirmButton: false,
        timer: 1400,
        background: "#08152d",
        color: "#fff",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tải được QR",
      });
    }
  };

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:rounded-[24px] sm:p-4 md:p-5">
      <div>
        <h2 className="text-sm font-semibold text-white sm:text-base">
          Nạp tiền qua QR
        </h2>
        <p className="text-[11px] text-white/50 sm:text-xs">
          Quét mã hoặc lưu mã QR để chuyển khoản nhanh
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* LEFT */}
        <div className="space-y-3">
          {/* QUICK AMOUNT */}
          <div>
            <p className="mb-2 text-[11px] text-white/55 sm:text-xs">
              Chọn mệnh giá nhanh
            </p>
            <div className="flex flex-wrap gap-2">
              {[50000, 100000, 200000, 500000, 1000000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`rounded-xl border px-3 py-2 text-[11px] transition ${
                    amount === v
                      ? "border-cyan-300/30 bg-cyan-400/10 text-white"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {v.toLocaleString("vi-VN")}đ
                </button>
              ))}
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div>
            <label className="text-[11px] text-white/55">
              Số tiền
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-white outline-none"
            />
          </div>

          {/* NOTE */}
          <div>
            <label className="text-[11px] text-white/55">
              Nội dung chuyển khoản
            </label>

            <div className="mt-1 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs text-white break-all">
                {note || "Chưa có nội dung"}
              </span>

              <button
                onClick={handleCopyNote}
                className="text-xs text-cyan-300"
              >
                Copy
              </button>
            </div>

            <p className="mt-1 text-[10px] text-red-300">
              Bắt buộc giữ nguyên nội dung khi chuyển khoản
            </p>
          </div>

          {/* BANK INFO */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="text-white/40">Ngân hàng</div>
              <div className="text-white">Techcombank</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="text-white/40">Số tài khoản</div>
              <div className="text-white break-all">{ACCOUNT}</div>
            </div>
          </div>

          <button
            onClick={handleCopyAll}
            className="w-full rounded-xl bg-white/10 py-2 text-sm text-white"
          >
            Copy toàn bộ
          </button>
        </div>

        {/* RIGHT - QR */}
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="w-full rounded-xl bg-white p-3">
            <img
              src={qrUrl}
              alt="QR Code"
              className="mx-auto w-full max-w-[300px]"
            />
          </div>

          <button
            onClick={handleDownloadQR}
            className="mt-3 w-full rounded-xl bg-[#1570ef] py-2 text-sm font-semibold text-white"
          >
            Tải mã QR
          </button>

      
        </div>
      </div>
    </div>
  );
}

export default DepositQR;