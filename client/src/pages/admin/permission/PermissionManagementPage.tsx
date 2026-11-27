import { useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LucideIcon } from "../../../components/ui/LucideIcons.js";
import DataTable, {
  type DataTableColumn,
} from "../../../components/ui/DataTable.js";
import {
  createPermission,
  getAllPermissions,
  softDeletePermission,
  updatePermission,
  updatePermissionStatus,
  type CreatePermissionPayload,
  type IPermission,
  type UpdatePermissionPayload,
} from "../../../features/permission/permissionApi.js";
import PageHeader from "../../../components/ui/PageHeader.js";
import Card from "../../../components/ui/Card.js";
import Button from "../../../components/ui/Button.js";
import Modal from "../../../components/ui/Modal.js";
import Textarea from "../../../components/ui/Textarea.js";
import Input from "../../../components/ui/Input.js";
import { confirmDelete, showError } from "../../../utils/alert.js";
import { useApiQuery } from "../../../hooks/apiQuery/useApiQuery.js";
import { GLOBAL_API_KEY_CONSTANTS } from "../../../globalApiConstantKeyHub/globalApiKeyConstants.js";
import QueryStateHandler from "../../../components/ui/QueryStateHandler.js";
import { useApiMutation } from "../../../hooks/apiMutation/useApiMutation.js";

const PermissionManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<IPermission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const permission = selectedPermission;
  const isEditing = Boolean(permission);

  const {
    data: permissions = [],
    isLoading,
    isPending,
    isError,
    error,
  } = useApiQuery({
    key: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    queryFn: getAllPermissions,
  });

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    module: "",
    description: "",
  });

  const handleCreateRole = () => {
    setSelectedPermission(null);
    setFormData({ name: "", key: "", module: "", description: "" });
    setIsOpenModal(true);
  };

  const handleCloseRoleModal = () => {
    setSelectedPermission(null);
    setIsOpenModal(false);
  };

  // Create/Update permission mutation
  const permissionMutation = useApiMutation({
    method: isEditing && selectedPermission ? "update" : "create",
    key: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    mutationFn:
      isEditing && selectedPermission
        ? ({ permissionId, payload }) =>
            updatePermission(
              permissionId as string,
              payload as UpdatePermissionPayload,
            )
        : ({ payload }) => createPermission(payload as CreatePermissionPayload),
  });

  // Deactivate Permission TanStack Mutation
  const permissionDeactivateMutation = useApiMutation({
    method: "update",
    key: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    mutationFn: ({ permissionId, isActive }) =>
      updatePermissionStatus(permissionId as string, isActive as boolean),
    successMessage: ({ variables }) =>
      variables.isActive
        ? "Permission activated successfully!"
        : "Permission deactivated successfully!",
  });

  // Deactivate Permission status change Mutation handler
  const handlePermissionStatusChange = async (
    permissionId: string,
    isActive: boolean,
  ) => {
    await permissionDeactivateMutation.mutateAsync({ permissionId, isActive });
  };

  // Permission delete mutation
  const permissionDeleteMutation = useApiMutation({
    method: "delete",
    key: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    mutationFn: ({ permissionId }) =>
      softDeletePermission(permissionId as string),
  });

  const handleRefetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    });
  };

  const onSubmit = async (
    payload: CreatePermissionPayload | UpdatePermissionPayload,
    permissionId?: string,
  ): Promise<void> => {
    if (permissionId) {
      await permissionMutation.mutateAsync({ permissionId, payload });
    } else {
      await permissionMutation.mutateAsync({ payload });
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
      if (isEditing && selectedPermission) {
        const payload: UpdatePermissionPayload = {
          name: formData.name.trim(),
          key: formData.key.trim(),
          module: formData.module.trim(),
          description: formData.description.trim(),
        };

        await onSubmit(payload, selectedPermission._id);
      } else {
        const payload: CreatePermissionPayload = {
          name: formData.name.trim(),
          key: formData.key.trim(),
          module: formData.module.trim(),
          description: formData.description.trim(),
        };

        await onSubmit(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPermissions = useMemo(() => {
    const search = searchValue.toLowerCase().trim();

    if (!search) return permissions;

    return permissions.filter((permission: IPermission) =>
      [
        permission.name,
        permission.key,
        permission.description ?? "",
        permission.isActive ? "active" : "inactive",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [permissions, searchValue]);

  const columns = useMemo<DataTableColumn<IPermission>[]>(
    () => [
      {
        header: "Permission Name",
        accessorKey: "name",
        sortable: true,
      },
      {
        header: "Permission Key",
        accessorKey: "key",
        sortable: true,
      },
      {
        header: "Description",
        cell: (permission) => permission.description || "N/A",
      },
      {
        header: "Module",
        cell: (permission) => permission.module || "N/A",
      },
      {
        header: "Status",
        cell: (permission) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              permission.isActive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {permission.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Created Date",
        cell: (permission) =>
          permission.createdAt
            ? new Date(permission.createdAt).toLocaleDateString()
            : "N/A",
      },
    ],
    [],
  );

  const handleEdit = (permission: IPermission) => {
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      key: permission.key,
      module: permission.module ?? "",
      description: permission.description ?? "",
    });
    setIsOpenModal(true);
  };

  const handleDelete = async (permissionId: string) => {
    try {
      const confirmed = await confirmDelete();
      if (!confirmed.isConfirmed) return;

      await permissionDeleteMutation.mutateAsync({ permissionId });
      await handleRefetch();
    } catch (error) {
      showError("Encountered error!");
      console.error(error);
    }
  };

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isPending={isPending}
      isError={isError}
      error={error}
      loadingMessage="Loading permissions..."
    >
      <div className="space-y-4">
        <PageHeader
          subject="Total Permissions"
          dataLength={permissions?.length ?? 0}
          description="Create and manage institution permissions and responsibilities."
          actions={
            <div className="lg:flex flex-1 grid items-center gap-2">
              <Button
                onClick={isOpenModal ? handleCloseRoleModal : handleCreateRole}
                icon={isOpenModal ? LucideIcon.Eye : LucideIcon.UploadCloudIcon}
                size="xs"
              >
                {isOpenModal ? "Back to Permissions" : "Create Permission"}
              </Button>
            </div>
          }
        />

        <Card>
          <DataTable
            data={filteredPermissions}
            columns={columns}
            getRowId={(permission) => permission._id}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchClear={() => setSearchValue("")}
            searchPlaceholder="Search roles..."
            labelText="Number of permissions displayed:"
            emptyMessage="No roles found."
            icon={<LucideIcon.List size={19} />}
            dataLength={permissions?.length ?? 0}
            actions={(permission) => (
              <>
                <Button
                  variant="base"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => handleEdit(permission)}
                  title="Edit Permission"
                >
                  <LucideIcon.Edit size={16} />
                </Button>
                {permission.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() =>
                      handlePermissionStatusChange(permission._id, false)
                    }
                    title="Deactivate Permission"
                  >
                    <LucideIcon.ToggleLeftIcon size={16} />
                  </Button>
                )}
                {!permission.isActive && (
                  <Button
                    variant="success"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() =>
                      handlePermissionStatusChange(permission._id, true)
                    }
                    title="Activate Permission"
                  >
                    <LucideIcon.ToggleRightIcon size={16} />
                  </Button>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(permission._id)}
                  title="Delete Permission"
                >
                  <LucideIcon.Trash2 size={16} />
                </Button>
              </>
            )}
          />
        </Card>

        {/* CREATE & UPDATE PERMISSIONS MODAL */}
        <Modal
          isOpen={isOpenModal}
          onClose={handleCloseRoleModal}
          title={isEditing ? "Update Permission" : "Create New Permission"}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Permission Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Library Officer"
              required
            />

            {!isEditing && (
              <Input
                label="Permission Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="e.g. SETTINGS_UPDATE"
                required
              />
            )}
            <Input
              label="Permission Module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              placeholder="e.g. ATTENDANCE"
              required
            />

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
                    ? "Update Permission"
                    : "Create Permission"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </QueryStateHandler>
  );
};

export default PermissionManagementPage;
