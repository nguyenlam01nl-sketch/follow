import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TrendingUp, ShieldCheck, KeyRound } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthSwitch from "../../components/auth/AuthSwitch";
import api from "../../api/axios";

function LoginPage() {
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.login.trim() || !form.password.trim()) {
      const message =
        "Vui lòng nhập username, email hoặc số điện thoại và mật khẩu";
      setError(message);

      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: message,
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", {
        login: form.login.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      await Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công",
        text: "Bạn đã đăng nhập vào hệ thống",
        confirmButtonText: "Tiếp tục",
      });

      const role = res.data.user?.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.login?.[0] ||
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.username?.[0] ||
        err?.response?.data?.errors?.phone?.[0] ||
        err?.response?.data?.errors?.password?.[0] ||
        "Sai username, email, số điện thoại hoặc mật khẩu";

      setError(message);

      await Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: message,
        confirmButtonText: "Thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Đăng nhập" subtitle="">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300/90">
                  Sola Vietnam
                </p>
                <h3 className="mt-1 text-sm font-semibold leading-5 text-white">
                  Uy tín hàng đầu Việt Nam 🇻🇳
                </h3>
              </div>

              <div className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-200">
                Hỗ trợ 24/7
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] px-2 py-2">
                <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
                  <TrendingUp size={13} />
                </div>
                <p className="text-[10px] font-medium leading-4 text-white">
                  Tăng tương tác
                </p>
              </div>

              <div className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] px-2 py-2">
                <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-rose-400/15 text-rose-200">
                  <ShieldCheck size={13} />
                </div>
                <p className="text-[10px] font-medium leading-4 text-white">
                  Xoá tài khoản
                </p>
              </div>

              <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.07] px-2 py-2">
                <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200">
                  <KeyRound size={13} />
                </div>
                <p className="text-[10px] font-medium leading-4 text-white">
                  Mở khoá
                </p>
              </div>
            </div>

            <p className="mt-2.5 text-[11px] leading-4.5 text-slate-300">
              Hệ thống cung cấp dịch vụ tăng tương tác uy tín nhất Việt Nam 🇻🇳
              <br />
              Chuyên xoá tài khoản Tiktok, Facebook, Instagram nhanh chóng và
              bảo mật !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <AuthInput
              label="Username, Email hoặc Số điện thoại"
              name="login"
              value={form.login}
              onChange={handleChange}
              placeholder="Nhập username, email hoặc số điện thoại"
            />

            <PasswordInput
              label="Mật khẩu"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
            />

            <button
              type="submit"
              disabled={loading}
              className="group relative h-11 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(34,211,238,0.24)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_42px_rgba(34,211,238,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/8" />
              <span className="absolute inset-y-0 left-[-30%] w-[30%] skew-x-[-20deg] bg-white/20 blur-md transition-all duration-700 group-hover:left-[120%]" />
              <span className="relative">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </span>
            </button>
          </form>

          <AuthSwitch
            text="Chưa có tài khoản?"
            linkText="Đăng ký"
            to="/register"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;