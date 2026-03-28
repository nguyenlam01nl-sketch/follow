import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/user/dashboard/DashboardPage";
import ServicesPage from "@/pages/user/services/ServicesPage";
import OrdersPage from "@/pages/user/orders/OrdersPage";
import WalletPage from "@/pages/user/wallet/WalletPage";
import AccountPage from "@/pages/user/account/AccountPage";
import ServiceOrderPage from "@/pages/user/services/ServiceOrderPage";
import EngagementPlatformPage from "@/pages/user/services/EngagementPlatformPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔒 Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceOrderPage />} />
        <Route
          path="/services/engagement/:platform"
          element={<EngagementPlatformPage />}
        />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;