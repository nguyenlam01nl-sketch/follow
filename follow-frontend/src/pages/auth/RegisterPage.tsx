import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthSwitch from "../../components/auth/AuthSwitch";
import api from "../../api/axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      const message = "Vui lòng nhập đầy đủ thông tin";
      setError(message);

      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: message,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      await Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Tài khoản đã được tạo",
      });

      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.username?.[0] ||
        error?.response?.data?.errors?.email?.[0] ||
        "Đăng ký thất bại";

      setError(message);

      await Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Tạo tài khoản"
        subtitle="Đăng ký nhanh để sử dụng Sola Vietnam"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <AuthInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="nhap_username"
          />

          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <PasswordInput
            label="Mật khẩu"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tạo mật khẩu"
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="group relative h-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.28)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(34,211,238,0.36)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative">
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </span>
            </button>
          </div>
        </form>

        <AuthSwitch
          text="Đã có tài khoản?"
          linkText="Đăng nhập"
          to="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default RegisterPage;