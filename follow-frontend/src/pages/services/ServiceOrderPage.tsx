import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { ArrowLeft, ShoppingCart } from "lucide-react";

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

export default function ServiceOrderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [service, setService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

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
    setSuccess("");

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const res = await api.post("/orders", {
        service_id: service.id,
        form_data: formData,
        selected_price: totalPrice,
      });

      setSuccess(res.data.message || "Đã tạo đơn thành công");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tạo đơn, vui lòng thử lại");
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
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-between rounded-[22px] border px-5 py-5 transition ${
                  checked
                    ? "border-blue-500/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-7 w-7 rounded-full border flex items-center justify-center ${
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
                    <p className="font-semibold text-white">{opt.label}</p>
                    {opt.description && (
                      <p className="mt-1 text-sm text-white/45">{opt.description}</p>
                    )}
                  </div>
                </div>

                <div className="text-right text-emerald-400 font-bold">
                  {opt.price?.toLocaleString()}đ
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
            );
          })}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-3 text-white/70">
          <input
            type="checkbox"
            checked={!!formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-transparent"
          />
          <span>{field.label}</span>
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

                {success && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    {success}
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
                <p className="border-t border-white/10 pt-4 text-red-300 font-semibold">
                  Vi phạm, tài khoản sẽ bị khóa và bạn tự chịu trách nhiệm.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-white/45">Dịch vụ đang chọn</p>
                <p className="mt-1 font-semibold text-white">{service.name}</p>

                <p className="mt-4 text-sm text-white/45">Tổng tiền</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-400">
                  {totalPrice.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}