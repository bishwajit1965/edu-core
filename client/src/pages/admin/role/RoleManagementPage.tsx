import { useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LucideIcon } from "../../../components/ui/LucideIcons.js";
import DataTable, {
  type DataTableColumn,
} from "../../../components/ui/DataTable.js";
import {
  createRole,
  getAllRoles,
  softDeleteRole,
  updateRole,
  updateRoleStatus,
  type CreateRolePayload,
  type IRole,
  type UpdateRolePayload,
} from "../../../features/role/roleApi.js";
import PageHeader from "../../../components/ui/PageHeader.js";
import Card from "../../../components/ui/Card.js";
import Button from "../../../components/ui/Button.js";
import Modal from "../../../components/ui/Modal.js";
import Textarea from "../../../components/ui/Textarea.js";
import Input from "../../../components/ui/Input.js";
import { confirmDelete, showError } from "../../../utils/alert.js";
import { useApiQuery } from "../../../hooks/apiQuery/useApiQuery.js";
import { GLOBAL_API_KEY_CONSTANTS } from "../../../globalApiConstantKeyHub/globalApiKeyConstants.js";
import { useApiMutation } from "../../../hooks/apiMutation/useApiMutation.js";
import QueryStateHandler from "../../../components/ui/QueryStateHandler.js";

const RoleManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = selectedRole;
  const isEditing = Boolean(role);

  const {
    data: roles = [],
    isLoading,
    isPending,
    isError,
    error,
  } = useApiQuery({
    key: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    queryFn: getAllRoles,
  });

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  });

  const handleCreateRole = () => {
    setSelectedRole(null);
    setFormData({ name: "", key: "", description: "" });
    setIsOpenModal(true);
  };

  const handleCloseRoleModal = () => {
    setSelectedRole(null);
    setIsOpenModal(false);
  };

  // Create/Update Role mutation
  const roleMutation = useApiMutation({
    method: isEditing && selectedRole ? "update" : "create",
    key: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    mutationFn:
      isEditing && selectedRole
        ? ({ roleId, payload }) =>
            updateRole(roleId as string, payload as UpdateRolePayload)
        : ({ payload }) => createRole(payload as CreateRolePayload),
  });

  // Role delete mutation
  const roleDeleteMutation = useApiMutation({
    method: "delete",
    key: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    mutationFn: ({ roleId }) => softDeleteRole(roleId as string),
  });

  // Deactivate Role TanStack Mutation
  const roleStatusDeactivationMutation = useApiMutation({
    method: "update",
    key: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    mutationFn: ({ roleId, isActive }) =>
      updateRoleStatus(roleId as string, isActive as boolean),

    successMessage: ({ variables }) =>
      variables.isActive
        ? "Role activated successfully!"
        : "Role deactivated successfully!",
  });

  const handleRoleStatusChange = async (roleId: string, isActive: boolean) => {
    await roleStatusDeactivationMutation.mutateAsync({ roleId, isActive });
  };

  const handleRefetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    });
  };

  const onSubmit = async (
    payload: CreateRolePayload | UpdateRolePayload,
    roleId?: string,
  ): Promise<void> => {
    if (roleId) {
      await roleMutation.mutateAsync({ roleId, payload });
    } else {
      await roleMutation.mutateAsync({ payload });
    }

    handleRefetch();
    handleCloseRoleModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "key" ? value.toUpperCase().replace(/\s+/g, "_") : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (isEditing && selectedRole) {
        const payload: UpdateRolePayload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
        };

        await onSubmit(payload, selectedRole._id);
      } else {
        const payload: CreateRolePayload = {
          name: formData.name.trim(),
          key: formData.key.trim(),
          description: formData.description.trim(),
        };

        await onSubmit(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = useMemo(() => {
    const search = searchValue.toLowerCase().trim();

    if (!search) return roles;

    return roles.filter((role: IRole) =>
      [
        role.name,
        role.key,
        role.description ?? "",
        role.isActive ? "active" : "inactive",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [roles, searchValue]);

  const columns = useMemo<DataTableColumn<IRole>[]>(
    () => [
      {
        header: "Role Name",
        accessorKey: "name",
        sortable: true,
      },
      {
        header: "Role Key",
        accessorKey: "key",
        sortable: true,
      },
      {
        header: "Description",
        cell: (role) => role.description || "N/A",
      },
      {
        header: "Status",
        cell: (role) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              role.isActive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {role.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Created Date",
        cell: (role) =>
          role.createdAt
            ? new Date(role.createdAt).toLocaleDateString()
            : "N/A",
      },
    ],
    [],
  );

  const handleEdit = (role: IRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      key: role.key,
      description: role.description ?? "",
    });
    setIsOpenModal(true);
  };

  const handleDelete = async (roleId: string) => {
    try {
      const confirmed = await confirmDelete();
      if (!confirmed.isConfirmed) return;

      await roleDeleteMutation.mutateAsync({ roleId });
      handleRefetch();
    } catch (error) {
      showError("Encountered error!");
      console.error(error);
    }
    console.log("Delete role:", role);
  };

  if (isLoading) {
    return <div className="p-6">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-error">
        Failed to load roles. Please try again.
      </div>
    );
  }

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isPending={isPending}
      isError={isError}
      error={error}
      loadingMessage="Loading roles..."
    >
      <div className="space-y-">
        <PageHeader
          title="Role Management"
          description="Create and manage institution roles and responsibilities."
          actions={
            <div className="lg:flex flex-1 grid items-center gap-2">
              <div className="aura text-emerald-600">
                <div className="card bg-base-100 text-base-content">
                  <div className="card-body p-0.5">
                    <h3 className="flex items-center gap-2 rounded-md border border-gray-300 bg-base-100 px-2 py-1 text-sm font-bold lg:text-lg">
                      <LucideIcon.List size={16} />
                      Roles:
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white">
                        {roles?.length ?? 0}
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <Button
                onClick={isOpenModal ? handleCloseRoleModal : handleCreateRole}
                icon={isOpenModal ? LucideIcon.Eye : LucideIcon.UploadCloudIcon}
                size="xs"
              >
                {isOpenModal ? "Back to Roles" : "Create Role"}
              </Button>
            </div>
          }
        />

        <Card>
          <DataTable
            data={filteredRoles}
            columns={columns}
            getRowId={(role) => role._id}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchClear={() => setSearchValue("")}
            searchPlaceholder="Search roles..."
            labelText="Number of roles displayed:"
            emptyMessage="No roles found."
            icon={<LucideIcon.List size={19} />}
            dataLength={roles?.length ?? 0}
            actions={(role) => (
              <>
                <Button
                  variant="base"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleEdit(role)}
                  title="Edit role"
                >
                  <LucideIcon.Edit size={16} />
                </Button>

                {role.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRoleStatusChange(role._id, false)}
                    title="Deactivate Role"
                  >
                    <LucideIcon.ToggleLeftIcon size={16} />
                  </Button>
                )}

                {!role.isActive && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleRoleStatusChange(role._id, true)}
                    title="Activate Role"
                  >
                    <LucideIcon.ToggleRightIcon size={16} />
                  </Button>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(role._id)}
                  title="Delete role"
                >
                  <LucideIcon.Trash2 size={16} />
                </Button>
              </>
            )}
          />
        </Card>

        {/* CREATE & UPDATE ROLES MODAL */}
        <Modal
          isOpen={isOpenModal}
          onClose={handleCloseRoleModal}
          title={isEditing ? "Update Role" : "Create New Role"}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Library Officer"
              required
            />

            {!isEditing && (
              <Input
                label="Role Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="e.g. LIBRARY_OFFICER"
                required
              />
            )}

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the responsibilities of this role"
              rows={4}
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="warning"
                size="xs"
                onClick={handleCloseRoleModal}
                disabled={isSubmitting}
                icon={LucideIcon.XCircle}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LucideIcon.Loader className="animate-spin" size={18} />
                ) : isEditing ? (
                  <LucideIcon.Edit size={16} />
                ) : (
                  <LucideIcon.UploadCloudIcon size={16} />
                )}
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Role"
                    : "Create Role"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </QueryStateHandler>
  );
};

export default RoleManagementPage;
