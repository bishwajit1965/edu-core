import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";

const AdminDashboard = () => {
  const { user } = useAuth() as {
    user?: {
      name?: string;
      roles?: {
        name?: string;
        key?: string;
      }[];
    };
  };

  const roleNames = user?.roles?.map((role) => role.name).join(", ");

  return (
    <div>
      <PageHeader
        description="Manage your institution's information and preferences."
        actions={
          <Button size="xs" variant="primary">
            Configure Me to Use
          </Button>
        }
      />

      <p className="text-gray-700">Welcome, {user?.name || "User"}!</p>

      <p className="mt-2 text-sm text-gray-500">
        Your Role: {roleNames || "No role assigned"}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Manage your institution from one place.
      </p>
    </div>
  );
};

export default AdminDashboard;
