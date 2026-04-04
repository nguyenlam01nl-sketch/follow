import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { Mail, Send, FileText, Type, Megaphone } from "lucide-react";

export default function AdminEmailNotificationsPage() {
  const [form, setForm] = useState({
    subject: "",
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    total_users?: number;
    success_count?: number;
    fail_count?: number;
    message?: string;
  } | null>(null);

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setForm({
      subject: "",
      title: "",
      content: "",
    });
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.title.trim() || !form.content.trim()) {
      setError("Vui lòng nhập đầy đủ subject, tiêu đề và nội dung email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await api.post("/admin/email-notifications/send", form);

      setResult({
        total_users: res.data?.total_users ?? 0,
        success_count: res.data?.success_count ?? 0,
        fail_count: res.data?.fail_count ?? 0,
        message: res.data?.message ?? "Đã gửi email thành công",
      });

      setForm({
        subject: "",
        title: "",
        content: "",
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Không thể gửi email thông báo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="border-b border-white/6 pb-3 sm:pb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Admin &nbsp; &gt; &nbsp; Email Notifications
          </div>
        </div>

        <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] sm:h-14 sm:w-14">
                <Mail size={24} className="text-cyan-300 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[30px]">
                  GỬI THÔNG BÁO EMAIL
                </h1>
                <p className="mt-1 text-xs text-white/35 sm:mt-2 sm:text-sm">
                  Gửi email thông báo tới toàn bộ người dùng trong hệ thống.
                </p>
              </div>
            </div>

            <div className="self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-cyan-200 sm:px-4 sm:text-xs">
              Admin Broadcast
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Subject email
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#071226] px-3 sm:h-12 sm:px-4 lg:h-14">
                    <Type
                      size={16}
                      className="shrink-0 text-white/35 sm:h-[18px] sm:w-[18px]"
                    />
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Ví dụ: Thông báo bảo trì hệ thống"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Tiêu đề hiển thị trong mail
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#071226] px-3 sm:h-12 sm:px-4 lg:h-14">
                    <FileText
                      size={16}
                      className="shrink-0 text-white/35 sm:h-[18px] sm:w-[18px]"
                    />
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ví dụ: Thông báo từ Sola Vietnam"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Nội dung email
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-[#071226] p-3 sm:p-4">
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      rows={10}
                      placeholder="Nhập nội dung email muốn gửi cho tất cả người dùng..."
                      className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-[20px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
                  >
                    <Send size={16} />
                    {loading ? "Đang gửi..." : "Gửi email"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]">
                  <Megaphone size={20} className="text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Hướng dẫn
                  </h2>
                  <p className="mt-1 text-xs text-white/35 sm:text-sm">
                    Email sẽ được gửi tới toàn bộ người dùng có email trong hệ
                    thống.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Subject là tiêu đề thật của email trong hộp thư người nhận.
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Tiêu đề hiển thị là phần heading lớn bên trong giao diện email.
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Nội dung nên viết rõ ràng, ngắn gọn, tránh quá dài nếu gửi số
                  lượng lớn.
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Kết quả gửi
              </h2>

              {!result && !loading && (
                <div className="mt-4 rounded-[20px] border border-white/10 bg-[#071226] p-5 text-sm text-white/60">
                  Chưa có lần gửi nào trong phiên này.
                </div>
              )}

              {loading && (
                <div className="mt-4 rounded-[20px] border border-white/10 bg-[#071226] p-5 text-sm text-white/60">
                  Hệ thống đang gửi email tới người dùng...
                </div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                    {result.message || "Đã gửi email thành công"}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                        Tổng user
                      </div>
                      <div className="mt-2 text-xl font-bold text-white">
                        {result.total_users ?? 0}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                        Thành công
                      </div>
                      <div className="mt-2 text-xl font-bold text-emerald-300">
                        {result.success_count ?? 0}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                        Thất bại
                      </div>
                      <div className="mt-2 text-xl font-bold text-red-300">
                        {result.fail_count ?? 0}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}