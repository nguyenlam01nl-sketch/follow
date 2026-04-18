import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  ArrowLeft,
  FileBadge2,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react";
import api from "@/api/axios";

type DocumentOption = {
  label: string;
  value: string;
  description: string;
};

const documentOptions: DocumentOption[] = [
  {
    label: "Giấy khám bệnh",
    value: "giay-kham-benh",
    description:
      "Hỗ trợ tư vấn và tiếp nhận nhu cầu liên quan đến giấy khám bệnh.",
  },
  {
    label: "Visa",
    value: "visa",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến visa và giấy tờ đi kèm.",
  },
  {
    label: "Bằng cấp",
    value: "bang-cap",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến bằng cấp.",
  },
  {
    label: "Chứng chỉ",
    value: "chung-chi",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến chứng chỉ.",
  },
  {
    label: "Bằng tin học",
    value: "bang-tin-hoc",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến bằng tin học.",
  },
  {
    label: "Bằng tiếng Anh",
    value: "bang-tieng-anh",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến bằng tiếng Anh.",
  },
  {
    label: "Hồ sơ học tập",
    value: "ho-so-hoc-tap",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến hồ sơ học tập.",
  },
  {
    label: "Hồ sơ bệnh án",
    value: "ho-so-benh-an",
    description:
      "Hỗ trợ tiếp nhận các nhu cầu liên quan đến hồ sơ bệnh án.",
  },
  {
    label: "Giấy tờ khác",
    value: "giay-to-khac",
    description:
      "Nếu bạn cần loại giấy tờ khác, hãy mô tả rõ ở phần ghi chú bên dưới.",
  },
];

export default function DocumentSupportPage() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    note: "",
    agreed: false,
  });

  const selectedDocument = useMemo(() => {
    return documentOptions.find((item) => item.value === selectedType) || null;
  }, [selectedType]);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!selectedType) {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng chọn loại giấy tờ.",
        icon: "warning",
        confirmButtonColor: "#2F80ED",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng nhập số điện thoại để trao đổi.",
        icon: "warning",
        confirmButtonColor: "#2F80ED",
      });
      return false;
    }

    if (selectedType === "giay-to-khac" && !formData.note.trim()) {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng nhập ghi chú mô tả loại giấy tờ cần hỗ trợ.",
        icon: "warning",
        confirmButtonColor: "#2F80ED",
      });
      return false;
    }

    if (!formData.agreed) {
      Swal.fire({
        title: "Chưa xác nhận",
        text: "Vui lòng xác nhận trước khi gửi yêu cầu.",
        icon: "warning",
        confirmButtonColor: "#2F80ED",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const confirm = await Swal.fire({
      title: "Gửi yêu cầu hỗ trợ?",
      html: `
        <div style="text-align:left">
          <p><b>Loại giấy tờ:</b> ${selectedDocument?.label || "Chưa chọn"}</p>
          <p><b>Số điện thoại:</b> ${formData.phone}</p>
          <p><b>Giá:</b> Liên hệ</p>
          ${
            formData.note.trim()
              ? `<p style="margin-top:8px;"><b>Ghi chú:</b> ${formData.note}</p>`
              : ""
          }
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2F80ED",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Gửi yêu cầu",
      cancelButtonText: "Đóng",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      await api.post("/document-support", {
        type: selectedType,
        phone: formData.phone,
        note: formData.note,
      });

      await Swal.fire({
        title: "Thành công!",
        text: "Yêu cầu đã được ghi nhận. Bên mình sẽ liên hệ qua số điện thoại bạn cung cấp.",
        icon: "success",
        confirmButtonColor: "#2F80ED",
      });

      setSelectedType("");
      setFormData({
        phone: "",
        note: "",
        agreed: false,
      });
    } catch (error: any) {
      await Swal.fire({
        title: "Lỗi!",
        text:
          error?.response?.data?.message ||
          "Không thể gửi yêu cầu lúc này, vui lòng thử lại.",
        icon: "error",
        confirmButtonColor: "#2F80ED",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/services")}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#08152d]">
            <div className="border-b border-white/6 px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <FileBadge2 className="text-blue-400" size={26} />
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold text-white">
                    HỖ TRỢ LÀM GIẤY TỜ
                  </h1>
                  <p className="mt-1 text-white/45">
                    Tiếp nhận nhiều loại giấy tờ. Tất cả mức giá hiện tại đều
                    liên hệ trực tiếp.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                  Chọn loại giấy tờ cần hỗ trợ
                </label>

                <div className="space-y-3">
                  {documentOptions.map((item) => {
                    const checked = selectedType === item.value;

                    return (
                      <div key={item.value} className="space-y-2">
                        <label
                          className={`flex cursor-pointer items-center justify-between rounded-[22px] border px-5 py-5 transition ${
                            checked
                              ? "border-blue-500/40 bg-white/[0.06]"
                              : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                                checked ? "border-blue-500" : "border-white/20"
                              }`}
                            >
                              <div
                                className={`h-3.5 w-3.5 rounded-full ${
                                  checked ? "bg-blue-500" : "bg-transparent"
                                }`}
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {item.label}
                              </p>
                            </div>
                          </div>

                          <div className="text-right font-bold text-amber-300">
                            Liên hệ
                          </div>

                          <input
                            type="radio"
                            name="documentType"
                            value={item.value}
                            checked={checked}
                            onChange={() => setSelectedType(item.value)}
                            className="hidden"
                          />
                        </label>

                        {checked && (
                          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-white/75">
                            <p className="mb-2 font-semibold text-amber-300">
                              Thông tin loại giấy tờ đang chọn
                            </p>
                            <p>{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                  Số điện thoại
                </label>
                <input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none placeholder:text-white/30"
                  placeholder="Nhập số điện thoại để trao đổi"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 py-3 text-white outline-none placeholder:text-white/30"
                  placeholder={
                    selectedType === "giay-to-khac"
                      ? "Mô tả loại giấy tờ cần hỗ trợ..."
                      : "Nhập ghi chú thêm nếu có..."
                  }
                />
                <p className="text-xs text-white/45">
                  {selectedType === "giay-to-khac"
                    ? "Mục này bắt buộc khi chọn Giấy tờ khác."
                    : " Bạn có thể ghi thêm yêu cầu, thời gian cần, tình trạng hiện tại..."
                  }
                </p>
              </div>

              <label
                className={`flex cursor-pointer items-start gap-4 rounded-[22px] border px-4 py-4 transition ${
                  formData.agreed
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                    formData.agreed
                      ? "border-emerald-400 bg-emerald-400 text-[#04111f]"
                      : "border-white/20 bg-[#050b1a]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => handleChange("agreed", e.target.checked)}
                    className="hidden"
                  />
                  {formData.agreed && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20.285 6.709a1 1 0 0 1 .006 1.414l-9.25 9.333a1 1 0 0 1-1.42.003l-4.25-4.25a1 1 0 1 1 1.414-1.414l3.54 3.54 8.543-8.62a1 1 0 0 1 1.417-.006Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold leading-6 ${
                      formData.agreed ? "text-white" : "text-white/78"
                    }`}
                  >
                    Tôi xác nhận số điện thoại đã nhập là đúng để bên hỗ trợ liên
                    hệ trao đổi.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    Tất cả mức giá hiện tại đều báo riêng theo từng trường hợp.
                  </p>
                </div>
              </label>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-14 w-full rounded-[20px] bg-[#1570ef] text-lg font-bold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Đang xử lý..." : "GỬI YÊU CẦU HỖ TRỢ"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-amber-500/20 bg-[rgba(90,60,10,0.22)] p-6">
              <h2 className="text-2xl font-bold uppercase text-amber-300">
                THÔNG TIN BÁO GIÁ
              </h2>

              <div className="mt-5 space-y-4 text-white/75">
                <p>• Tất cả dịch vụ hiện đang báo giá theo từng trường hợp.</p>
                <p>• Mức phí phụ thuộc vào loại giấy tờ và nhu cầu cụ thể.</p>
                <p>• Bạn có thể ghi chú thêm để bên mình nắm nhu cầu rõ hơn.</p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-white/45">Mức giá hiện tại</p>
                <p className="mt-1 text-2xl font-extrabold text-amber-300">
                  Liên hệ
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-emerald-400/20 bg-emerald-400/5 p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-300" size={22} />
                <h2 className="text-xl font-bold text-white">Cam kết hỗ trợ</h2>
              </div>

              <div className="mt-5 space-y-4 text-white/70">
                <p>• Tiếp nhận thông tin để trao đổi nhanh chóng.</p>
                <p>• Báo lại rõ ràng sau khi nắm nhu cầu cụ thể.</p>
                <p>• Trường hợp không hỗ trợ được sẽ báo sớm.</p>
              </div>
            </div>

            <div className="rounded-[30px] border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="flex items-center gap-3">
                <MessageCircleMore className="text-blue-300" size={22} />
                <h2 className="text-xl font-bold text-white">Liên hệ</h2>
              </div>

              <div className="mt-5 space-y-3 text-white/70">
                <p>• Chỉ cần để lại số điện thoại để bên mình liên hệ trao đổi.</p>
                <p>• Bạn có thể ghi chú thêm cho bất kỳ loại giấy tờ nào.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}