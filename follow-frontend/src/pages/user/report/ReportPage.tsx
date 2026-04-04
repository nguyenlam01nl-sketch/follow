import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  ShieldAlert,
  Search,
  Send,
  Landmark,
  Phone,
  Globe,
  TriangleAlert,
  BadgeDollarSign,
  History,
  FileText,
  ImagePlus,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type TabType = "check" | "report";

type CheckResult = {
  found?: boolean;
  type?: string;
  normalized_value?: string;
  status?: string;
  risk_score?: number;
  report_count?: number;
  message?: string;
  last_reported_at?: string | null;
};

const reportTargetTypes = [
  {
    value: "bank_account",
    label: "Số tài khoản",
    icon: Landmark,
    color: "text-cyan-300",
    badge: "bg-cyan-400/10 text-cyan-200",
    placeholder: "Ví dụ: 123456789",
  },
  {
    value: "phone",
    label: "Số điện thoại",
    icon: Phone,
    color: "text-emerald-300",
    badge: "bg-emerald-400/10 text-emerald-200",
    placeholder: "Ví dụ: 0912345678",
  },
  {
    value: "facebook_link",
    label: "Link Facebook",
    icon: Globe,
    color: "text-violet-300",
    badge: "bg-violet-400/10 text-violet-200",
    placeholder: "Ví dụ: https://facebook.com/abcxyz",
  },
  {
    value: "other",
    label: "Khác",
    icon: TriangleAlert,
    color: "text-orange-300",
    badge: "bg-orange-400/10 text-orange-200",
    placeholder: "Nhập thông tin cần báo cáo",
  },
];

function getRiskMeta(score = 0) {
  if (score >= 80) {
    return {
      label: "Nguy cơ rất cao",
      badge: "bg-red-500/15 text-red-200 border border-red-400/20",
      text: "Đối tượng này có mức cảnh báo rất cao. Nên dừng giao dịch.",
      icon: AlertTriangle,
      iconColor: "text-red-300",
    };
  }

  if (score >= 50) {
    return {
      label: "Nguy cơ cao",
      badge: "bg-orange-500/15 text-orange-200 border border-orange-400/20",
      text: "Nên đặc biệt thận trọng và xác minh kỹ trước khi giao dịch.",
      icon: AlertTriangle,
      iconColor: "text-orange-300",
    };
  }

  if (score >= 20) {
    return {
      label: "Cần thận trọng",
      badge: "bg-yellow-500/15 text-yellow-200 border border-yellow-400/20",
      text: "Có dấu hiệu cần lưu ý. Hãy xác minh thêm thông tin.",
      icon: Clock3,
      iconColor: "text-yellow-300",
    };
  }

  return {
    label: "Chưa thấy cảnh báo mạnh",
    badge: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20",
    text: "Chưa có nhiều dữ liệu rủi ro, nhưng vẫn nên giao dịch cẩn trọng.",
    icon: CheckCircle2,
    iconColor: "text-emerald-300",
  };
}

export default function ReportPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("check");

  const [targetType, setTargetType] = useState("bank_account");
  const [targetValue, setTargetValue] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [checkQuery, setCheckQuery] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const selectedType =
    reportTargetTypes.find((item) => item.value === targetType) ||
    reportTargetTypes[0];

  const riskMeta = useMemo(
    () => getRiskMeta(checkResult?.risk_score || 0),
    [checkResult]
  );

  const handleChooseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) {
      Swal.fire({
        icon: "warning",
        title: "File không hợp lệ",
        text: "Vui lòng chỉ tải lên hình ảnh",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
      return;
    }

    const nextFiles = [...evidenceFiles, ...imageFiles].slice(0, 6);
    setEvidenceFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const nextFiles = evidenceFiles.filter((_, i) => i !== index);
    setEvidenceFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleCheck = async () => {
    if (!checkQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu dữ liệu tra cứu",
        text: "Vui lòng nhập số tài khoản, số điện thoại hoặc link Facebook",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    try {
      setCheckLoading(true);
      setCheckResult(null);

      const { data } = await api.post("/check", {
        query: checkQuery,
      });

      setCheckResult(data);
    } catch (error) {
      setCheckResult(null);
      Swal.fire({
        icon: "error",
        title: "Tra cứu thất bại",
        text: "Không thể tra cứu dữ liệu lúc này",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    } finally {
      setCheckLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!targetValue.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu dữ liệu cần báo cáo",
        text: "Vui lòng nhập số tài khoản, số điện thoại hoặc link Facebook",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu tiêu đề",
        text: "Vui lòng nhập tiêu đề báo cáo",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu nội dung",
        text: "Vui lòng nhập mô tả chi tiết vụ việc",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Gửi báo cáo lừa đảo?",
      text: "Thông tin và hình ảnh bằng chứng sẽ được gửi đến hệ thống để kiểm tra và xem xét.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Gửi ngay",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      background: "#08152d",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("target_type", targetType);
      formData.append("target_value", targetValue);
      formData.append("title", title);
      formData.append("content", content);

      if (amount) {
        formData.append("amount", amount);
      }

      evidenceFiles.forEach((file) => {
        formData.append("evidences[]", file);
      });

      await api.post("/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Gửi thành công",
        text: "Báo cáo của bạn đã được gửi và đang chờ hệ thống xem xét",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });

      setTargetType("bank_account");
      setTargetValue("");
      setTitle("");
      setContent("");
      setAmount("");
      setEvidenceFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gửi thất bại",
        text: "Không thể gửi báo cáo lúc này",
        background: "#08152d",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="border-b border-white/6 pb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Trang chủ &nbsp; &gt; &nbsp; Kiểm tra & báo cáo lừa đảo
          </div>
        </div>

        <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                <ShieldAlert
                  size={18}
                  className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                KIỂM TRA & BÁO CÁO LỪA ĐẢO
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/report/history")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
            >
              <History className="h-4 w-4" />
              Xem lịch sử
            </button>
          </div>

          <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
            <p className="text-sm leading-6 text-white/65 sm:text-[15px]">
              Bạn có thể tra cứu nhanh số tài khoản, số điện thoại, link Facebook
              nghi ngờ lừa đảo, đồng thời gửi báo cáo kèm hình ảnh bằng chứng để
              hệ thống tổng hợp và cảnh báo cho người dùng khác.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab("check")}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                activeTab === "check"
                  ? "border-orange-400/30 bg-[#0b1a35] text-white"
                  : "border-white/10 bg-[#08152d] text-white/70 hover:bg-[#0b1a35]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                Tra cứu nhanh
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("report")}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                activeTab === "report"
                  ? "border-orange-400/30 bg-[#0b1a35] text-white"
                  : "border-white/10 bg-[#08152d] text-white/70 hover:bg-[#0b1a35]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Gửi báo cáo
              </span>
            </button>
          </div>
        </section>

        {activeTab === "check" && (
          <section className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                <Search
                  size={18}
                  className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                TRA CỨU ĐỐI TƯỢNG
              </h2>
            </div>

            <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Nhập số tài khoản / số điện thoại / link Facebook
                  </label>

                  <input
                    type="text"
                    value={checkQuery}
                    onChange={(e) => setCheckQuery(e.target.value)}
                    placeholder="Ví dụ: 0912345678 hoặc https://facebook.com/abcxyz"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={checkLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  {checkLoading ? "Đang tra cứu..." : "Tra cứu ngay"}
                </button>

                {checkResult && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm text-white/55">
                          Kết quả tra cứu
                        </div>
                        <div className="mt-1 text-lg font-bold text-white">
                          {checkResult.normalized_value || checkQuery}
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${riskMeta.badge}`}
                      >
                        {riskMeta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-[#0b1a35] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/45">
                          Điểm rủi ro
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                          {checkResult.risk_score ?? 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#0b1a35] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/45">
                          Số báo cáo
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                          {checkResult.report_count ?? 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#0b1a35] p-4">
                        <div className="text-xs uppercase tracking-wide text-white/45">
                          Trạng thái
                        </div>
                        <div className="mt-2 text-base font-bold text-white">
                          {checkResult.status || "Không xác định"}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/85">
                      {checkResult.message || riskMeta.text}
                    </div>

                    <div className="text-xs text-white/40">
                      Cập nhật gần nhất:{" "}
                      {checkResult.last_reported_at || "Chưa có dữ liệu"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "report" && (
          <>
            <section className="space-y-4 sm:space-y-5 border-b border-white/10 pb-6 sm:pb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                  <FileText
                    size={18}
                    className="text-orange-400 sm:h-[22px] sm:w-[22px]"
                  />
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  CHỌN LOẠI ĐỐI TƯỢNG
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                {reportTargetTypes.map((item) => {
                  const Icon = item.icon;
                  const active = targetType === item.value;

                  return (
                    <motion.button
                      key={item.value}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.18 }}
                      type="button"
                      onClick={() => setTargetType(item.value)}
                      className={`group relative min-h-[130px] rounded-[18px] border p-4 text-left transition sm:min-h-[150px] sm:rounded-[22px] sm:p-5 ${
                        active
                          ? "border-orange-400/30 bg-[#0b1a35]"
                          : "border-white/8 bg-[#08152d] hover:border-white/14 hover:bg-[#0b1a35]"
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] sm:h-12 sm:w-12 sm:rounded-2xl">
                          <Icon
                            size={18}
                            className={`${item.color} sm:h-[22px] sm:w-[22px]`}
                          />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-[11px] ${item.badge}`}
                        >
                          chọn
                        </span>
                      </div>

                      <h3 className="text-base font-bold uppercase leading-6 text-white sm:text-lg">
                        {item.label}
                      </h3>

                      <p className="mt-1.5 text-xs text-white/40 sm:mt-2 sm:text-sm">
                        Chọn đúng loại dữ liệu để hệ thống xử lý chính xác hơn.
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] sm:h-11 sm:w-11 sm:rounded-2xl">
                  <selectedType.icon
                    size={18}
                    className={`${selectedType.color} sm:h-[22px] sm:w-[22px]`}
                  />
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  NỘI DUNG BÁO CÁO
                </h2>
              </div>

              <div className="rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#08152d] p-4 sm:p-6">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Loại đối tượng
                    </label>

                    <div
                      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide sm:px-4 sm:py-2 sm:text-xs ${selectedType.badge}`}
                    >
                      {selectedType.label}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Thông tin cần báo cáo
                    </label>
                    <input
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder={selectedType.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Tiêu đề báo cáo
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ví dụ: Nhận tiền nhưng không giao hàng"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Số tiền liên quan (nếu có)
                    </label>
                    <div className="relative">
                      <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Ví dụ: 500000"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Mô tả rõ quá trình giao dịch, cách liên hệ, thời điểm xảy ra và các dấu hiệu nghi ngờ lừa đảo..."
                      className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Hình ảnh bằng chứng
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-6 text-center transition hover:bg-white/[0.05]">
                      <ImagePlus className="h-6 w-6 text-orange-300" />
                      <div className="text-sm font-medium text-white/80">
                        Tải lên ảnh bằng chứng
                      </div>
                      <div className="text-xs text-white/40">
                        Hỗ trợ nhiều ảnh, tối đa 6 ảnh
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleChooseFiles}
                        className="hidden"
                      />
                    </label>

                    {previewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {previewUrls.map((url, index) => (
                          <div
                            key={`${url}-${index}`}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a35]"
                          >
                            <img
                              src={url}
                              alt={`evidence-${index}`}
                              className="h-32 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-4 py-3 text-sm text-orange-100/85">
                    Gợi ý: hãy nhập đúng số tài khoản, số điện thoại hoặc link
                    Facebook, mô tả cụ thể tình huống và đính kèm hình ảnh để hệ
                    thống dễ xác minh hơn.
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Đang gửi..." : "Gửi báo cáo lừa đảo"}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}