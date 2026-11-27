import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios.js";
import { LucideEdit, LucideLoader, LucideTrash } from "lucide-react";
import UserModal from "./UserModal.js";
import { confirmDelete, showSuccess, showError } from "../../utils/alert.js";
import PageHeader from "../../components/ui/PageHeader.js";
import Button from "../../components/ui/Button.js";
import { LucideIcon } from "../../components/ui/LucideIcons.js";

type User = {
  _id: string | number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  createdAt: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users");
        setUsers(response.data.data);
        console.log("Users data:", response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleToggleModal = (userId?: string | number) => {
    const user = userId ? chosenUser(userId) : null;
    setSelectedUser(user);
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const chosenUser = (userId?: string | number): User | null => {
    if (!userId) return null;
    return users.find((user) => user._id === userId) ?? null;
  };

  const handleDelete = async (userId: string | number) => {
    const confirmed = await confirmDelete();

    if (!confirmed.isConfirmed) return;

    try {
      const response = await axiosInstance.patch(
        `/users/${userId}/soft-delete`,
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));

        showSuccess(response.data.message || "User deleted successfully.");
      } else {
        showError(response.data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error in deleting user", error);
      showError("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <PageHeader
        description="Can update registered users data here."
        actions={
          <div className="lg:flex flex-1 grid items-center gap-2">
            <div className="aura text-emerald-600">
              <div className="card bg-base-100 text-base-content">
                <div className="card-body p-0.5">
                  <h3 className="flex items-center gap-2 rounded-md border border-gray-300 bg-base-100 px-2 py-0.5 text-medium font-bold lg:text-normal">
                    <LucideIcon.List size={14} />
                    Users:
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-thin text-white">
                      {users?.length ?? 0}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <Button variant="primary" size="xs">
              Configure Me
            </Button>
          </div>
        }
      />
      {message && (
        <p className="text-blue-500 bg-blue-100 font-bold p-2 border border-blue-300 rounded-sm shadow flex items-center gap-1">
          <LucideLoader className="animate-spin" size={16} /> {message}
        </p>
      )}

      <h1 className="text-2xl font-bold">
        Users List {users ? users.length : "N/A"}
      </h1>

      <div className="overflow-x-auto">
        <table className="table lg:table-sm table-xs">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bio</th>
              <th>Registered on</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12 cursor-pointer">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          onClick={() => handleToggleModal(user._id)}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.bio}</td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="lg:flex grid items-center gap-1">
                  <button
                    className="btn lg:btn-sm btn-xs btn-primary"
                    title="Edit"
                    onClick={() => handleToggleModal(user._id)}
                  >
                    <LucideEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn lg:btn-sm btn-xs btn-secondary"
                    title="Delete"
                  >
                    <LucideTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bio</th>
              <th>Registered on</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>

        {/* CRUD MODAL TO UPDATE */}
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            user={selectedUser}
            onSubmit={() => {
              const fetchUsers = async () => {
                try {
                  const response = await axiosInstance.get("/auth/users");
                  setUsers(response.data.data);
                } catch (error) {
                  console.error("Error fetching users:", error);
                }
              };
              setTimeout(() => {
                setIsModalOpen(false);
                fetchUsers();
              }, 2000);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
