import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { ArrowLeft, Save, Settings, Plus, Trash2 } from "lucide-react";

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
  status: string;
  form_schema?: FormField[];
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

function slugifyPackageValue(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `goi-${Date.now()}`
  );
}

export default function AdminServiceEditPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState<ServiceItem | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    mode: "manual" as "api" | "manual",
    price: "",
    unit: "",
    status: "active",
    form_schema: [] as FormField[],
  });

  const radioFieldIndex = useMemo(() => {
    return form.form_schema.findIndex((field) => field.type === "radio");
  }, [form.form_schema]);

  const radioField = useMemo(() => {
    if (radioFieldIndex === -1) return null;
    return form.form_schema[radioFieldIndex];
  }, [form.form_schema, radioFieldIndex]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/admin/services/${serviceId}`);
        const data = res.data?.data || res.data;

        setService(data);

        setForm({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          mode: data.mode || "manual",
          price: String(data.price ?? ""),
          unit: data.unit || "",
          status: data.status || "active",
          form_schema: Array.isArray(data.form_schema) ? data.form_schema : [],
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Không tải được dữ liệu dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleFormChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateRadioOption = (
    index: number,
    key: keyof FieldOption,
    value: string | number
  ) => {
    setForm((prev) => {
      if (radioFieldIndex === -1) return prev;

      const nextSchema = [...prev.form_schema];
      const targetField = { ...nextSchema[radioFieldIndex] };
      const options = [...(targetField.options || [])];

      options[index] = {
        ...options[index],
        [key]: key === "price" ? Number(value || 0) : value,
      };

      targetField.options = options;
      nextSchema[radioFieldIndex] = targetField;

      return {
        ...prev,
        form_schema: nextSchema,
      };
    });
  };

  const addRadioOption = (newOption: FieldOption) => {
    setForm((prev) => {
      let nextSchema = [...prev.form_schema];

      let index = nextSchema.findIndex((field) => field.type === "radio");

      if (index === -1) {
        nextSchema.push({
          type: "radio",
          name: "package",
          label: "Chọn gói",
          required: true,
          options: [],
        });

        index = nextSchema.length - 1;
      }

      const targetField = { ...nextSchema[index] };
      const options = [...(targetField.options || [])];

      options.push(newOption);

      targetField.options = options;
      nextSchema[index] = targetField;

      return {
        ...prev,
        form_schema: nextSchema,
      };
    });
  };

  const handleAddRadioOption = async () => {
    const existedValues =
      radioField?.options?.map((item) => item.value?.trim().toLowerCase()) || [];

    const result = await Swal.fire({
      title: "Thêm gói dịch vụ",
      html: `
        <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
          <div>
            <label style="display:block; margin-bottom:6px; font-size:13px; color:#cbd5e1;">
              Tên gói
            </label>
            <input id="swal-package-label" class="swal2-input" placeholder="Ví dụ: Gói 1 tháng" style="margin:0; width:100%;" />
          </div>

          <div>
            <label style="display:block; margin-bottom:6px; font-size:13px; color:#cbd5e1;">
              Value
            </label>
            <input id="swal-package-value" class="swal2-input" placeholder="Ví dụ: goi-1-thang" style="margin:0; width:100%;" />
          </div>

          <div>
            <label style="display:block; margin-bottom:6px; font-size:13px; color:#cbd5e1;">
              Mô tả
            </label>
            <textarea id="swal-package-description" class="swal2-textarea" placeholder="Mô tả ngắn về gói dịch vụ" style="margin:0; width:100%; min-height:100px;"></textarea>
          </div>

          <div>
            <label style="display:block; margin-bottom:6px; font-size:13px; color:#cbd5e1;">
              Giá
            </label>
            <input id="swal-package-price" type="number" min="0" class="swal2-input" placeholder="Ví dụ: 50000" style="margin:0; width:100%;" />
          </div>
        </div>
      `,
      background: "#08152d",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Thêm gói",
      cancelButtonText: "Huỷ",
      focusConfirm: false,
      preConfirm: () => {
        const label = (
          document.getElementById("swal-package-label") as HTMLInputElement
        )?.value?.trim();

        const valueInput = (
          document.getElementById("swal-package-value") as HTMLInputElement
        )?.value?.trim();

        const description = (
          document.getElementById("swal-package-description") as HTMLTextAreaElement
        )?.value?.trim();

        const priceRaw = (
          document.getElementById("swal-package-price") as HTMLInputElement
        )?.value?.trim();

        const price = Number(priceRaw || 0);

        if (!label) {
          Swal.showValidationMessage("Vui lòng nhập tên gói");
          return false;
        }

        if (!priceRaw || price < 0) {
          Swal.showValidationMessage("Vui lòng nhập giá hợp lệ");
          return false;
        }

        const safeValue = valueInput || slugifyPackageValue(label);

        if (existedValues.includes(safeValue.toLowerCase())) {
          Swal.showValidationMessage("Value này đã tồn tại");
          return false;
        }

        return {
          label,
          value: safeValue,
          description,
          price,
        };
      },
    });

    if (!result.isConfirmed || !result.value) return;

    addRadioOption(result.value);

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã thêm gói mới",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  };

  const removeRadioOption = async (index: number) => {
    const result = await Swal.fire({
      title: "Xoá gói này?",
      text: "Thao tác này sẽ xoá option radio khỏi form.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (!result.isConfirmed) return;

    setForm((prev) => {
      if (radioFieldIndex === -1) return prev;

      const nextSchema = [...prev.form_schema];
      const targetField = { ...nextSchema[radioFieldIndex] };
      const options = [...(targetField.options || [])];

      options.splice(index, 1);

      targetField.options = options;
      nextSchema[radioFieldIndex] = targetField;

      return {
        ...prev,
        form_schema: nextSchema,
      };
    });

    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã xoá gói",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  };

  const handleSave = async () => {
    if (!service) return;

    const confirm = await Swal.fire({
      title: "Lưu thay đổi?",
      text: "Bạn có chắc muốn cập nhật dịch vụ này không?",
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
      setError("");

      Swal.fire({
        title: "Đang lưu...",
        text: "Vui lòng chờ một chút",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await api.put(`/admin/services/${service.id}`, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        mode: form.mode,
        price: Number(form.price || 0),
        unit: form.unit.trim() || null,
        status: form.status,
        form_schema: form.form_schema,
      });

      const updated = res.data?.data || res.data;

      if (updated) {
        setService(updated);
        setForm({
          name: updated.name || "",
          slug: updated.slug || "",
          description: updated.description || "",
          mode: updated.mode || "manual",
          price: String(updated.price ?? ""),
          unit: updated.unit || "",
          status: updated.status || "active",
          form_schema: Array.isArray(updated.form_schema) ? updated.form_schema : [],
        });
      }

      Swal.close();

      await Swal.fire({
        title: "Thành công!",
        text: "Đã cập nhật dịch vụ",
        icon: "success",
        confirmButtonColor: "#2F80ED",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      Swal.close();

      const msg = err?.response?.data?.message || "Cập nhật thất bại";
      setError(msg);

      await Swal.fire({
        title: "Lỗi!",
        text: msg,
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/admin/services")}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        {loading && (
          <div className="rounded-[28px] border border-white/10 bg-[#08152d] p-6 text-white/60">
            Đang tải dữ liệu...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[28px] border border-red-400/20 bg-red-400/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && service && (
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#08152d]">
              <div className="border-b border-white/6 px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                    <Settings className="text-blue-500" size={26} />
                  </div>

                  <div>
                    <h1 className="text-3xl font-extrabold text-white">
                      CHỈNH SỬA DỊCH VỤ
                    </h1>
                    <p className="mt-1 text-white/45">
                      Giữ nguyên form như phía user, nhưng admin được sửa các gói radio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 py-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                    Tên dịch vụ
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => handleFormChange("slug", e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                    Giá service gốc
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                      Mode
                    </label>
                    <select
                      value={form.mode}
                      onChange={(e) =>
                        handleFormChange("mode", e.target.value as "api" | "manual")
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    >
                      <option value="manual">manual</option>
                      <option value="api">api</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                      Status
                    </label>
                    <input
                      value={form.status}
                      onChange={(e) => handleFormChange("status", e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                    Unit
                  </label>
                  <input
                    value={form.unit}
                    onChange={(e) => handleFormChange("unit", e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
                      Chọn máy chủ dịch vụ
                    </label>

                    <button
                      type="button"
                      onClick={handleAddRadioOption}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300"
                    >
                      <Plus size={14} />
                      Thêm gói
                    </button>
                  </div>

                  {radioField?.options?.length ? (
                    <div className="space-y-4">
                      {radioField.options.map((opt, index) => (
                        <div
                          key={`${opt.value}-${index}`}
                          className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
                        >
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm text-white/70">Tên gói</label>
                              <input
                                value={opt.label || ""}
                                onChange={(e) =>
                                  updateRadioOption(index, "label", e.target.value)
                                }
                                className="h-12 w-full rounded-xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm text-white/70">Value</label>
                              <input
                                value={opt.value || ""}
                                onChange={(e) =>
                                  updateRadioOption(index, "value", e.target.value)
                                }
                                className="h-12 w-full rounded-xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                            <div className="space-y-2">
                              <label className="text-sm text-white/70">Mô tả gói</label>
                              <textarea
                                value={opt.description || ""}
                                onChange={(e) =>
                                  updateRadioOption(index, "description", e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-xl border border-white/10 bg-[#050b1a] px-4 py-3 text-white outline-none"
                              />
                            </div>

                            <div className="space-y-2 md:w-[220px]">
                              <label className="text-sm text-white/70">Giá</label>
                              <input
                                type="number"
                                min="0"
                                value={opt.price ?? ""}
                                onChange={(e) =>
                                  updateRadioOption(index, "price", e.target.value)
                                }
                                className="h-12 w-full rounded-xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                              />

                              <button
                                type="button"
                                onClick={() => removeRadioOption(index)}
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-300"
                              >
                                <Trash2 size={14} />
                                Xoá gói
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1b37] px-4 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-white">{opt.label}</p>
                                {opt.description && (
                                  <p className="mt-1 text-sm text-white/45">
                                    {opt.description}
                                  </p>
                                )}
                              </div>

                              <div className="text-right font-bold text-emerald-400">
                                {formatMoney(opt.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-white/45">
                      Chưa có gói nào. Bấm <span className="font-semibold text-white">“Thêm gói”</span> để tạo mới.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  disabled={submitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#1570ef] text-lg font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  <Save size={18} />
                  {submitting ? "Đang lưu..." : "LƯU THAY ĐỔI"}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-emerald-500/20 bg-[rgba(12,60,40,0.35)] p-6">
              <h2 className="text-2xl font-bold uppercase text-emerald-400">
                PREVIEW
              </h2>

              <div className="mt-5 space-y-4 text-white/70">
                <p>Tên dịch vụ: {form.name || "..."}</p>
                <p>Slug: {form.slug || "..."}</p>
                <p>Mode: {form.mode || "..."}</p>
                <p>Status: {form.status || "..."}</p>
                <p>Unit: {form.unit || "..."}</p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-white/45">Giá service gốc</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-400">
                  {formatMoney(form.price)}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-white/45">Số gói hiện có</p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {radioField?.options?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}