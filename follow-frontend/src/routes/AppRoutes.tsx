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

import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import AdminServicesPage from "@/pages/admin/services/AdminServicesPage";
import AdminServiceEditPage from "@/pages/admin/services/AdminServiceEditPage";
import AdminEngagementPlatformPage from "@/pages/admin/services/AdminEngagementPlatformPage";
import AdminWalletPage from "@/pages/admin/wallet/AdminWalletPage";
import AdminOrderPage from "@/pages/admin/orders/AdminOrderPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import AdminFeedbackPage from "@/pages/admin/feedback/AdminFeedbackPage";
import AdminEmailNotificationsPage from "@/pages/admin/notification/AdminEmailNotificationsPage";
import AdminReportPage from "@/pages/admin/report/AdminReportPage";

import FeedbackPage from "@/pages/user/feedback/FeedbackPage";
import FeedbackHistoryPage from "@/pages/user/feedback/FeedbackHistoryPage";

import ReportPage from "@/pages/user/report/ReportPage";
import ReportHistoryPage from "@/pages/user/report/ReportHistoryPage";

import AffiliatePage from "@/pages/user/affiliate/AffiliatePage";
import AdminAffiliatePage from "@/pages/admin/affiliate/AdminAffiliatePage";

import OrderSuccessPage from "@/pages/user/success/OrderSuccessPage";


function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 👤 USER */}
      <Route element={<ProtectedRoute role="user" />}>
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
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/feedback/history" element={<FeedbackHistoryPage />} />

        <Route path="/report" element={<ReportPage />} />
        <Route path="/report/history" element={<ReportHistoryPage />} />
        <Route path="/affiliate" element={<AffiliatePage />} />

        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Route>

      {/* 👑 ADMIN */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route
          path="/admin/services/:serviceId/edit"
          element={<AdminServiceEditPage />}
        />
        <Route path="/admin/orders" element={<AdminOrderPage />} />
        <Route
          path="/admin/services/engagement/:platform"
          element={<AdminEngagementPlatformPage />}
        />
        <Route path="/admin/wallet" element={<AdminWalletPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
        <Route
          path="/admin/email-notifications"
          element={<AdminEmailNotificationsPage />}
        />
      </Route>
      <Route path="/admin/reports" element={<AdminReportPage />} />
      <Route path="/admin/affiliate" element={<AdminAffiliatePage />} />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;