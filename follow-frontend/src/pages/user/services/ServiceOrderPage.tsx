import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { ArrowLeft, ShoppingCart, Wallet } from "lucide-react";

type FieldOption = {
  label: string;
  value: string;
  price?: number;
  description?: string;
};

type FormField = {
  type: "text" | "textarea" | "select" | "radio" | "checkbox";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
};

type ServiceItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  mode: "api" | "manual";
  price: number;
  unit: string | null;
  form_schema?: FormField[];
};

function formatMoney(value?: number | string) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

export default function ServiceOrderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/services/${serviceId}`);
        const data = res.data?.data || res.data;

        setService(data);

        const initialValues: Record<string, any> = {};
        (data.form_schema || []).forEach((field: FormField) => {
          if (field.type === "checkbox") {
            initialValues[field.name] = false;
          } else {
            initialValues[field.name] = "";
          }
        });

        setFormData(initialValues);
      } catch (err) {
        setError("Không tải được thông tin dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoadingWallet(true);
        const res = await api.get("/wallet");
        setWalletBalance(Number(res.data?.balance ?? res.data?.data?.balance ?? 0));
      } catch (err) {
        console.error("Không lấy được số dư ví:", err);
        setWalletBalance(0);
      } finally {
        setLoadingWallet(false);
      }
    };

    fetchWallet();
  }, []);

  const refreshWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(Number(res.data?.balance ?? res.data?.data?.balance ?? 0));
    } catch (err) {
      console.error("Refresh ví lỗi:", err);
    }
  };

  const selectedPackage = useMemo(() => {
    const packageField = service?.form_schema?.find((f) => f.type === "radio");
    if (!packageField?.options) return null;

    return packageField.options.find(
      (opt) => opt.value === formData[packageField.name]
    );
  }, [service, formData]);

  const totalPrice = useMemo(() => {
    if (selectedPackage?.price) return selectedPackage.price;
    return service?.price || 0;
  }, [selectedPackage, service]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!service?.form_schema) return true;

    for (const field of service.form_schema) {
      if (!field.required) continue;

      const value = formData[field.name];

      if (field.type === "checkbox") {
        if (!value) {
          setError(`Vui lòng xác nhận: ${field.label}`);
          return false;
        }
      } else {
        if (value === undefined || value === null || value === "") {
          setError(`Vui lòng nhập/chọn: ${field.label}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleCreateOrder = async () => {
    if (!service) return;

    setError("");

    if (!validateForm()) return;

    if (Number(totalPrice) > Number(walletBalance)) {
      const result = await Swal.fire({
        title: "Số dư không đủ!",
        html: `
        <div style="text-align:left">
          <p>Số dư hiện tại: <b>${formatMoney(walletBalance)}</b></p>
          <p>Tổng tiền đơn: <b>${formatMoney(totalPrice)}</b></p>
        </div>
      `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2F80ED",
        cancelButtonColor: "#9CA3AF",
        confirmButtonText: "Nạp thêm",
        cancelButtonText: "Đóng",
      });

      if (result.isConfirmed) {
        navigate("/wallet");
      }

      return;
    }

    const confirm = await Swal.fire({
      title: "Xác nhận đặt đơn?",
      html: `
      <div style="text-align:left">
        <p>Số dư ví: <b>${formatMoney(walletBalance)}</b></p>
        <p>Tổng tiền đơn: <b>${formatMoney(totalPrice)}</b></p>
        <p style="margin-top:8px;">Bạn có chắc muốn tạo đơn hàng này không?</p>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2F80ED",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      await api.post("/orders", {
        service_id: service.id,
        form_data: formData,
        selected_price: totalPrice,
      });

      await refreshWallet();

      // 🔥 Google Ads conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-18064301149/338SCIymiZYcEN243aVD",
          value: Number(totalPrice),
          currency: "VND",
          transaction_id: `order-${service.id}-${Date.now()}`
        });
      }

      await Swal.fire({
        title: "Thành công!",
        text: "Đã tạo đơn thành công",
        icon: "success",
        confirmButtonColor: "#2F80ED",
        confirmButtonText: "OK",
      });


      const initialValues: Record<string, any> = {};
      (service.form_schema || []).forEach((field: FormField) => {
        initialValues[field.name] = field.type === "checkbox" ? false : "";
      });

      setFormData(initialValues);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Không thể tạo đơn, vui lòng thử lại";

      await Swal.fire({
        title: "Lỗi!",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#2F80ED",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };




  const renderField = (field: FormField) => {
    if (field.type === "text") {
      return (
        <input
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none placeholder:text-white/30"
          placeholder={field.placeholder || ""}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 py-3 text-white outline-none placeholder:text-white/30"
          placeholder={field.placeholder || ""}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
        >
          <option value="">{field.placeholder || "Chọn"}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="space-y-3">
          {field.options?.map((opt) => {
            const checked = formData[field.name] === opt.value;

            return (
              <div key={opt.value} className="space-y-2">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-[22px] border px-5 py-5 transition ${checked
                    ? "border-blue-500/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${checked ? "border-blue-500" : "border-white/20"
                        }`}
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded-full ${checked ? "bg-blue-500" : "bg-transparent"
                          }`}
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-white">{opt.label}</p>
                    </div>
                  </div>

                  <div className="text-right font-bold text-emerald-400">
                    {formatMoney(opt.price || 0)}
                  </div>

                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={checked}
                    onChange={() => handleChange(field.name, opt.value)}
                    className="hidden"
                  />
                </label>

                {checked && opt.description && (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-white/75">
                    <p className="mb-2 font-semibold text-amber-300">
                      Chi tiết gói dịch vụ đang chọn
                    </p>

                    <div className="space-y-2 leading-6">
                      {opt.description.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (field.type === "checkbox") {
      const checked = !!formData[field.name];

      return (
        <label
          className={`flex cursor-pointer items-start gap-4 rounded-[22px] border px-4 py-4 transition ${checked
            ? "border-emerald-400/30 bg-emerald-400/10"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
            }`}
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${checked
              ? "border-emerald-400 bg-emerald-400 text-[#04111f]"
              : "border-white/20 bg-[#050b1a]"
              }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="hidden"
            />
            {checked && (
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
              className={`text-sm font-semibold leading-6 ${checked ? "text-white" : "text-white/78"
                }`}
            >
              {field.label}
            </p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Vui lòng xác nhận trước khi thanh toán đơn hàng.
            </p>
          </div>
        </label>
      );
    }

    return null;
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

        <div className="flex items-center justify-between rounded-2xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
              <Wallet size={18} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-white/45">Số dư ví hiện tại</p>
              <p className="text-sm font-semibold text-emerald-300">
                {loadingWallet ? "Đang tải..." : formatMoney(walletBalance)}
              </p>
            </div>
          </div>

          <button
            onClick={refreshWallet}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
          >
            Làm mới
          </button>
        </div>

        {loading && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Đang tải dịch vụ...
          </div>
        )}

        {!loading && service && (
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#08152d]">
              <div className="border-b border-white/6 px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                    <ShoppingCart className="text-blue-500" size={26} />
                  </div>

                  <div>
                    <h1 className="text-3xl font-extrabold text-white">
                      KHU VỰC ĐẶT HÀNG
                    </h1>
                    <p className="mt-1 text-white/45">
                      Tất cả đơn hàng đều được xử lý tự động 24/7.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 py-6">
                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {service.form_schema?.map((field) => (
                  <div key={field.name} className="space-y-3">
                    {field.type !== "checkbox" && (
                      <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                        {field.label}
                      </label>
                    )}
                    {renderField(field)}
                  </div>
                ))}

                <button
                  onClick={handleCreateOrder}
                  disabled={submitting}
                  className="h-14 w-full rounded-[20px] bg-[#1570ef] text-lg font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? "Đang xử lý..." : "XÁC NHẬN THANH TOÁN ĐƠN"}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-red-500/20 bg-[rgba(60,13,30,0.35)] p-6">
              <h2 className="text-2xl font-bold uppercase text-red-400">
                LƯU Ý QUAN TRỌNG
              </h2>

              <div className="mt-5 space-y-4 text-white/70">
                <p>• Chỉ sử dụng dịch vụ cho mục đích hợp pháp.</p>
                <p>• Chỉ xử lý tài khoản/nội dung bạn có quyền sử dụng.</p>
                <p>• Không dùng dịch vụ để lừa đảo, mạo danh hoặc gây hại người khác.</p>
                <p className="border-t border-white/10 pt-4 font-semibold text-red-300">
                  Vi phạm, tài khoản sẽ bị khóa và bạn tự chịu trách nhiệm.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-white/45">Dịch vụ đang chọn</p>
                <p className="mt-1 font-semibold text-white">{service.name}</p>

                <p className="mt-4 text-sm text-white/45">Số dư ví</p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {formatMoney(walletBalance)}
                </p>

                <p className="mt-4 text-sm text-white/45">Tổng tiền</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-400">
                  {formatMoney(totalPrice)}
                </p>

                <p className="mt-4 text-sm text-white/45">Trạng thái</p>
                <p className="mt-1 font-semibold">
                  {Number(totalPrice) <= Number(walletBalance) ? (
                    <span className="text-emerald-300">Đủ số dư để thanh toán</span>
                  ) : (
                    <span className="text-red-300">Không đủ số dư</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}