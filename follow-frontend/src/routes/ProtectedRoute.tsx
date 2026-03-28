import { Navigate, Outlet } from "react-router-dom";

type Props = {
  role?: "admin" | "user";
};

function ProtectedRoute({ role }: Props) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // 🔥 điều hướng đúng theo role của user
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;