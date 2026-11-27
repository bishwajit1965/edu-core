import { LucideLoader } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AccessDenied from "../pages/notFoundPage/AccessDenied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const ProtectedRoute = ({
  children,
  requiredRoles,
  requiredPermissions,
}: ProtectedRouteProps) => {
  const { user, authReady, loading } = useAuth() as {
    user?: {
      roles?: {
        name?: string;
        key?: string;
      }[];
      permissions?: string[];
    };
    authReady: boolean;
    loading: boolean;
  };

  const location = useLocation();

  if (loading || !authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LucideLoader className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasRequiredRoles = requiredRoles
    ? requiredRoles.some((requiredRole) =>
        user.roles?.some((role) => role.key === requiredRole),
      )
    : true;

  const hasRequiredPermissions = requiredPermissions
    ? requiredPermissions.some((permission) =>
        user.permissions?.includes(permission),
      )
    : true;

  if (!hasRequiredRoles || !hasRequiredPermissions) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
