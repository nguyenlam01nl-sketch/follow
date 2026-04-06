import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  ArrowLeft,
  Save,
  Layers3,
  ShieldCheck,
  Link2,
  Hash,
  BadgeInfo,
  Boxes,
} from "lucide-react";

type FormState = {
  platform: string;
  group_key: string;
  service_key: string;
  name: string;
  description: string;
  mode: "manual" | "api";
  price: string;
  unit: string;
  min_quantity: string;
  max_quantity: string;
  requires_quantity: boolean;
  requires_link: boolean;
  requires_note: boolean;
  status: string;
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

function buildSlugPreview(platform: string, serviceKey: string) {
  const raw = `${platform}-${serviceKey}`.trim().toLowerCase();

  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-blue-300">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-extrabold uppercase tracking-wide text-white">
          {title}
        </h2>
        {desc && <p className="mt-1 text-sm text-white/45">{desc}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-semibold uppercase tracking-wide text-white/55">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/35">{hint}</p>}
    </div>
  );
}

function CheckboxCard({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-emerald-400/30 bg-emerald-400/10"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
            checked
              ? "border-emerald-400 bg-emerald-400 text-[#08152d]"
              : "border-white/20 bg-transparent"
          }`}
        >
          {checked && <span className="text-xs font-bold">✓</span>}
        </div>

        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-white/45">{desc}</p>
        </div>
      </div>
    </button>
  );
}

export default function AdminServiceCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    platform: "facebook",
    group_key: "support",
    service_key: "",
    name: "",
    description: "",
    mode: "manual",
    price: "",
    unit: "gói",
    min_quantity: "",
    max_quantity: "",
    requires_quantity: false,
    requires_link: false,
    requires_note: false,
    status: "active",
  });

  const slugPreview = useMemo(() => {
    return buildSlugPreview(form.platform, form.service_key);
  }, [form.platform, form.service_key]);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.platform.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu nền tảng",
        text: "Vui lòng chọn platform",
      });
      return;
    }

    if (!form.group_key.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu nhóm dịch vụ",
        text: "Vui lòng chọn group",
      });
      return;
    }

    if (!form.service_key.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu service key",
        text: "Vui lòng nhập service_key",
      });
      return;
    }

    if (!form.name.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu tên dịch vụ",
        text: "Vui lòng nhập tên dịch vụ",
      });
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      await Swal.fire({
        icon: "warning",
        title: "Giá chưa hợp lệ",
        text: "Vui lòng nhập giá hợp lệ",
      });
      return;
    }

    if (
      form.min_quantity &&
      form.max_quantity &&
      Number(form.max_quantity) < Number(form.min_quantity)
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Số lượng chưa hợp lệ",
        text: "Max quantity phải lớn hơn hoặc bằng min quantity",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Tạo dịch vụ mới?",
      text: "Hệ thống sẽ tạo service mới và chuyển sang trang chỉnh sửa.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1570ef",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Tạo dịch vụ",
      cancelButtonText: "Huỷ",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Đang tạo...",
        text: "Vui lòng chờ một chút",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.post("/admin/services", {
        platform: form.platform.trim(),
        group_key: form.group_key.trim(),
        service_key: form.service_key.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        mode: form.mode,
        price: Number(form.price || 0),
        unit: form.unit.trim() || null,
        min_quantity: form.min_quantity ? Number(form.min_quantity) : null,
        max_quantity: form.max_quantity ? Number(form.max_quantity) : null,
        requires_quantity: form.requires_quantity,
        requires_link: form.requires_link,
        requires_note: form.requires_note,
        status: form.status.trim(),
      });

      const created = res.data?.data || res.data;

      Swal.close();

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã tạo dịch vụ mới",
        confirmButtonColor: "#1570ef",
      });

      navigate(`/admin/services/${created.id}/edit`);
    } catch (err: any) {
      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Tạo thất bại",
        text: err?.response?.data?.message || "Không thể tạo dịch vụ",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/services")}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.06]"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#08152d]">
            <div className="border-b border-white/6 px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Layers3 className="text-blue-400" size={26} />
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
                    Tạo dịch vụ mới
                  </h1>
                  <p className="mt-1 text-sm text-white/45 sm:text-base">
                    Tạo nhanh service mới cho Facebook, TikTok, Instagram, YouTube,
                    X và các nền tảng khác.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-5 py-5 sm:px-6 sm:py-6">
              <section>
                <SectionTitle
                  icon={<Boxes size={20} />}
                  title="Thông tin chính"
                  desc="Nhóm thông tin cơ bản để tạo service."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Platform">
                    <select
                      value={form.platform}
                      onChange={(e) => handleChange("platform", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    >
                      <option value="facebook">facebook</option>
                      <option value="instagram">instagram</option>
                      <option value="tiktok">tiktok</option>
                      <option value="youtube">youtube</option>
                      <option value="x-twitter">x-twitter</option>
                    </select>
                  </Field>

                  <Field label="Group key">
                    <select
                      value={form.group_key}
                      onChange={(e) => handleChange("group_key", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    >
                      <option value="support">support</option>
                      <option value="follow">follow</option>
                      <option value="like">like</option>
                      <option value="view">view</option>
                      <option value="comment">comment</option>
                      <option value="member">member</option>
                      <option value="sub">sub</option>
                    </select>
                  </Field>

                  <Field
                    label="Service key"
                    hint="Ví dụ: mo-khoa-fb-dang-956"
                  >
                    <div className="relative">
                      <Hash
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        value={form.service_key}
                        onChange={(e) => handleChange("service_key", e.target.value)}
                        className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] pl-10 pr-4 text-white outline-none"
                        placeholder="nhap-service-key"
                      />
                    </div>
                  </Field>

                  <Field label="Mode">
                    <select
                      value={form.mode}
                      onChange={(e) =>
                        handleChange("mode", e.target.value as "manual" | "api")
                      }
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    >
                      <option value="manual">manual</option>
                      <option value="api">api</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Tên dịch vụ">
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                      placeholder="Ví dụ: MỞ KHÓA FB DẠNG 956"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Mô tả">
                    <textarea
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 py-3 text-white outline-none"
                      placeholder="Nhập mô tả ngắn cho dịch vụ..."
                    />
                  </Field>
                </div>
              </section>

              <section>
                <SectionTitle
                  icon={<BadgeInfo size={20} />}
                  title="Giá và cấu hình"
                  desc="Thiết lập giá, đơn vị và phạm vi số lượng."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Giá">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                      placeholder="0"
                    />
                  </Field>

                  <Field label="Đơn vị">
                    <input
                      value={form.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                      placeholder="gói"
                    />
                  </Field>

                  <Field label="Min quantity">
                    <input
                      type="number"
                      min="0"
                      value={form.min_quantity}
                      onChange={(e) => handleChange("min_quantity", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                      placeholder="Để trống nếu không dùng"
                    />
                  </Field>

                  <Field label="Max quantity">
                    <input
                      type="number"
                      min="0"
                      value={form.max_quantity}
                      onChange={(e) => handleChange("max_quantity", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                      placeholder="Để trống nếu không dùng"
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="h-13 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 text-white outline-none"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section>
                <SectionTitle
                  icon={<ShieldCheck size={20} />}
                  title="Tuỳ chọn bắt buộc"
                  desc="Đánh dấu các dữ liệu user cần nhập khi đặt dịch vụ."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <CheckboxCard
                    checked={form.requires_link}
                    onChange={(value) => handleChange("requires_link", value)}
                    title="Yêu cầu link"
                    desc="User phải nhập link tài khoản hoặc bài viết."
                  />

                  <CheckboxCard
                    checked={form.requires_quantity}
                    onChange={(value) => handleChange("requires_quantity", value)}
                    title="Yêu cầu số lượng"
                    desc="User phải nhập quantity khi tạo đơn."
                  />

                  <CheckboxCard
                    checked={form.requires_note}
                    onChange={(value) => handleChange("requires_note", value)}
                    title="Yêu cầu ghi chú"
                    desc="User phải nhập thêm note hoặc nội dung."
                  />
                </div>
              </section>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#1570ef] text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60 sm:text-lg"
              >
                <Save size={18} />
                {loading ? "Đang tạo..." : "TẠO DỊCH VỤ"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-emerald-500/20 bg-[rgba(12,60,40,0.35)] p-6">
              <h2 className="text-2xl font-bold uppercase text-emerald-400">
                Preview
              </h2>

              <div className="mt-5 space-y-4 text-white/75">
                <div>
                  <p className="text-sm text-white/40">Tên dịch vụ</p>
                  <p className="mt-1 font-semibold text-white">
                    {form.name || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Platform</p>
                  <p className="mt-1 font-semibold text-white">
                    {form.platform || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Group key</p>
                  <p className="mt-1 font-semibold text-white">
                    {form.group_key || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Service key</p>
                  <p className="mt-1 break-all font-semibold text-white">
                    {form.service_key || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Slug dự kiến</p>
                  <p className="mt-1 break-all font-semibold text-emerald-300">
                    {slugPreview || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Mode</p>
                  <p className="mt-1 font-semibold text-white">
                    {form.mode || "..."}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/40">Status</p>
                  <p className="mt-1 font-semibold text-white">
                    {form.status || "..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#08152d] p-6">
              <h2 className="text-xl font-bold uppercase text-white">
                Giá hiển thị
              </h2>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-white/40">Giá hiện tại</p>
                <p className="mt-2 text-3xl font-extrabold text-blue-300">
                  {formatMoney(form.price)}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/55">
                <div className="flex items-center gap-2">
                  <Link2 size={15} className="text-blue-300" />
                  <span>
                    {form.requires_link ? "Có yêu cầu link" : "Không yêu cầu link"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash size={15} className="text-blue-300" />
                  <span>
                    {form.requires_quantity
                      ? "Có yêu cầu quantity"
                      : "Không yêu cầu quantity"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BadgeInfo size={15} className="text-blue-300" />
                  <span>
                    {form.requires_note ? "Có yêu cầu ghi chú" : "Không yêu cầu ghi chú"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#08152d] p-6">
              <h2 className="text-xl font-bold uppercase text-white">
                Gợi ý
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-white/45">
                <p>
                  Sau khi tạo xong, hệ thống sẽ chuyển bé sang trang chỉnh sửa để thêm
                  gói dịch vụ, mô tả gói và radio options.
                </p>
                <p>
                  Nên đặt <span className="text-white">service_key</span> ngắn gọn,
                  không dấu, cách nhau bằng dấu gạch ngang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}