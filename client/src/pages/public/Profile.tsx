import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth() as {
    user?: { name?: string; email: string; role: string };
    logout: () => void;
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p>Welcome {user?.name}</p>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
    </div>
  );
};

export default Profile;
