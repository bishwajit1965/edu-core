import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Test from "../pages/admin/Test";
import SettingsPage from "../pages/admin/SettingsPage";
import UsersPage from "../pages/admin/UsersPage";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Profile from "../pages/public/Profile";
import StudentsPage from "../pages/admin/StudentsPage";
import NoticeManagement from "../pages/admin/notice/NoticeManagement";
import Notices from "../pages/public/Notices";
import ThemeManagement from "../pages/admin/theme/ThemeManagement";
import NoticeDetails from "../pages/public/NoticeDetails";

export const router = createBrowserRouter([
  // Main layout
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/notices",
        element: <Notices />,
      },
      {
        path: "/notices/:noticeId",
        element: <NoticeDetails />,
        loader: async ({ params }) => {
          return fetch(`/api/v1/notices/${params.noticeId}`);
        },
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  // Auth layout
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/auth/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/logout",
        element: <p>Logging out...</p>,
      },
    ],
  },

  // Admin layout
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/dashboard/test",
        element: <Test />,
      },
      {
        path: "/admin/dashboard/users",
        element: <UsersPage />,
      },
      {
        path: "/admin/dashboard/settings",
        element: <SettingsPage />,
      },
      {
        path: "/admin/dashboard/students",
        element: <StudentsPage />,
      },
      {
        path: "/admin/dashboard/notice-management",
        element: <NoticeManagement />,
      },
      {
        path: "/admin/dashboard/theme-management",
        element: <ThemeManagement />,
      },
    ],
  },
]);
