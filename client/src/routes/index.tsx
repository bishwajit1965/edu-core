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
import NoticeManagement from "../pages/admin/notice/NoticeManagement";
import Notices from "../pages/public/Notices";
import ThemeManagement from "../pages/admin/theme/ThemeManagement";
import NoticeDetails from "../pages/public/NoticeDetails";
import StudentAdmission from "../pages/public/StudentAdmission";
import StudentPortalLayout from "../features/website/layouts/StudentPortalLayout";
import StudentDashboard from "../features/website/publicModules/student/StudentDashboard";
import StudentExaminations from "../features/website/publicModules/student/StudentExaminations";
import StudentProfile from "../features/website/publicModules/student/StudentProfile";
import StudentNotices from "../features/website/publicModules/student/StudentNotices";
import StudentRoutine from "../features/website/publicModules/student/StudentRoutine";
import StudentResults from "../features/website/publicModules/student/StudentResults";
import StudentLogin from "../features/website/publicModules/student/StudentLogin";
import StudentVerifyOTP from "../features/website/publicModules/student/StudentVerifyOTP";
import StudentAuthLayout from "../features/website/layouts/StudentAuthLayout";
import SubjectConfigurationManagementPage from "../pages/admin/subjectConfigurationManagementPage/SubjectConfigurationManagementPage";
import StudentsAdmissionManagementPage from "../pages/admin/students/StudentsAdmissionManagementPage";
import NotFound from "../pages/notFoundPage/NotFound";
import RoleManagementPage from "../pages/admin/role/RoleManagementPage";
import PermissionManagementPage from "../pages/admin/permission/PermissionManagementPage";
import RolePermissionManagementPage from "../pages/admin/rolePermissionManagement/RolePermissionManagementPage";

export const router = createBrowserRouter([
  // MAIN LAYOUT
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        handle: { title: "Home" },
      },
      {
        path: "/about",
        element: <About />,
        handle: { title: "About Us" },
      },
      {
        path: "/contact",
        element: <Contact />,
        handle: { title: "Contact" },
      },
      {
        path: "/notices",
        element: <Notices />,
        handle: { title: "Notices" },
      },
      {
        path: "/notices/:noticeId",
        handle: { title: "Notice Details" },
        element: <NoticeDetails />,
        loader: async ({ params }) => {
          return fetch(`/api/v1/notices/public/${params.noticeId}`);
        },
      },
      {
        path: "/student-admissions",
        element: <StudentAdmission />,
        handle: { title: "Admission" },
      },
      {
        path: "/profile",
        element: <Profile />,
        handle: { title: "My Profile" },
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // STUDENT AUTH LAYOUT
  {
    path: "/student-portal",
    element: <StudentAuthLayout />,
    children: [
      {
        path: "/student-portal/student/login",
        element: <StudentLogin />,
        handle: { title: "Student Login" },
      },
      {
        path: "/student-portal/student/verify-otp",
        element: <StudentVerifyOTP />,
        handle: { title: "Verify OTP" },
      },
    ],
  },

  // STUDENT PORTAL DASHBOARD LAYOUT
  {
    path: "/student-portal",
    element: <StudentPortalLayout />,
    children: [
      {
        path: "/student-portal/student/dashboard",
        element: <StudentDashboard />,
        handle: { title: "My Dashboard" },
      },
      {
        path: "/student-portal/student/profile",
        element: <StudentProfile />,
        handle: { title: "My Profile" },
      },
      {
        path: "/student-portal/student/notices",
        element: <StudentNotices />,
        handle: { title: "Student Notices" },
      },
      {
        path: "/student-portal/student/routine",
        element: <StudentRoutine />,
        handle: { title: "Class Routine" },
      },
      {
        path: "/student-portal/student/examinations",
        element: <StudentExaminations />,
        handle: { title: "My Profile" },
      },
      {
        path: "/student-portal/student/results",
        element: <StudentResults />,
        handle: { title: "My Results" },
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // AUTH LAYOUT
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

  // ADMIN LAYOUT
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
        element: <StudentsAdmissionManagementPage />,
      },
      {
        path: "/admin/dashboard/notice-management",
        element: <NoticeManagement />,
      },
      {
        path: "/admin/dashboard/theme-management",
        element: <ThemeManagement />,
      },
      {
        path: "/admin/dashboard/subject-configuration-management",
        element: <SubjectConfigurationManagementPage />,
      },
      {
        path: "/admin/dashboard/role-management",
        element: <RoleManagementPage />,
      },
      {
        path: "/admin/dashboard/permission-management",
        element: <PermissionManagementPage />,
      },
      {
        path: "/admin/dashboard/role-permission-management",
        element: <RolePermissionManagementPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
