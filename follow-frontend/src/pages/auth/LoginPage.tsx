import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
      const message = "Vui lòng nhập username, email hoặc số điện thoại và mật khẩu";
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
      <AuthCard
        title="Đăng nhập"
        subtitle="Đăng nhập vào Sola Vietnam để tiếp tục sử dụng nền tảng."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <AuthInput
            label="Username hoặc Email hoặc Số điện thoại"
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

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="group relative h-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(34,211,238,0.36)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/8" />
              <span className="absolute inset-y-0 left-[-30%] w-[30%] skew-x-[-20deg] bg-white/20 blur-md transition-all duration-700 group-hover:left-[120%]" />
              <span className="relative">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </span>
            </button>
          </div>
        </form>

        <AuthSwitch
          text="Chưa có tài khoản?"
          linkText="Đăng ký"
          to="/register"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;