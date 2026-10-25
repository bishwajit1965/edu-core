import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth() as {
    user?: { name?: string; email: string; role: string };
    logout: () => void;
  };
  return (
    <div>
      <div className="aura aura-rainbow">
        <div className="card bg-base-200 p-8 shadow-sm">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p>Welcome {user?.name}</p>
          <p>{user?.email}</p>
          <p>{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
