import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth() as { user?: { role?: string } };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold lg:text-4xl">Admin Dashboard</h1>

      <p className="text-gray-700">Welcome, {user?.role || "User"}!</p>

      <p className="mt-2 text-sm text-gray-500">
        Manage your institution from one place.
      </p>
    </div>
  );
};

export default AdminDashboard;
