import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ServicesPage from "../pages/services/ServicesPage";
import OrdersPage from "../pages/orders/OrdersPage";
import WalletPage from "../pages/wallet/WalletPage";
import AccountPage from "../pages/account/AccountPage";
import ServiceOrderPage from "../pages/services/ServiceOrderPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:serviceId" element={<ServiceOrderPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}

export default AppRoutes;