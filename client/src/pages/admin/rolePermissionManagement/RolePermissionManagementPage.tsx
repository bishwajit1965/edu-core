import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "../../../hooks/apiQuery/useApiQuery";
import QueryStateHandler from "../../../components/ui/QueryStateHandler.js";
import Select from "../../../components/ui/Select.js";
import PageHeader from "../../../components/ui/PageHeader.js";
import { GLOBAL_API_KEY_CONSTANTS } from "../../../globalApiConstantKeyHub/globalApiKeyConstants";
import axiosInstance from "../../../lib/axios.js";
import { LucideIcon } from "../../../components/ui/LucideIcons.js";
import { LucideRefreshCcw } from "lucide-react";
import {
  getAllPermissions,
  type IPermission,
} from "../../../features/permission/permissionApi.js";
import { getAllRoles, updateRole } from "../../../features/role/roleApi.js";
import Button from "../../../components/ui/Button.js";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  bio?: string;
  status: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
};

const RolePermissionManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Local permission selections, indexed by role ID.
  const [permissionDrafts, setPermissionDrafts] = useState<
    Record<string, string[]>
  >({});

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");

        const response = await axiosInstance.get("/auth/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsersError("Unable to load users.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch roles
  const {
    data: roles = [],
    isLoading: rolesLoading,
    isPending: rolesPending,
    isError: rolesError,
    error: rolesErrorMessage,
  } = useApiQuery({
    key: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
    queryFn: getAllRoles,
  });

  // Fetch permissions
  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    isPending: permissionsPending,
    isError: permissionsError,
    error: permissionsErrorMessage,
  } = useApiQuery({
    key: [...GLOBAL_API_KEY_CONSTANTS.PERMISSION],
    queryFn: getAllPermissions,
  });

  // Data management
  const userOptions = users.map((user) => ({
    label: ` ${user.name} • ${user.email}`,
    value: String(user._id),
  }));

  const selectedUser = users.find(
    (user) => String(user._id) === selectedUserId,
  );

  const getRolePermissions = (roleId: string) => {
    const role = roles.find((item) => item._id === roleId);

    return permissionDrafts[roleId] ?? role?.permissions ?? [];
  };

  // Select a user and populate their existing role assignments.
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);

    const user = users.find((item) => item._id === userId);

    setSelectedRoleIds(user?.roles ?? []);
  };

  // Local role selection only.
  const handleRoleChange = (roleId: string, checked: boolean) => {
    setSelectedRoleIds((previous) =>
      checked
        ? [...new Set([...previous, roleId])]
        : previous.filter((id) => id !== roleId),
    );
  };

  // Local permission selection only.
  const handlePermissionChange = (
    roleId: string,
    permissionId: string,
    checked: boolean,
  ) => {
    setPermissionDrafts((previous) => {
      // const current = previous[roleId] ?? [];
      const current = getRolePermissions(roleId);
      const updated = checked
        ? [...new Set([...current, permissionId])]
        : current.filter((id) => id !== permissionId);

      return {
        ...previous,
        [roleId]: updated,
      };
    });
  };
  const activeRoles = useMemo(
    () => roles.filter((role) => role.isActive && !role.isDeleted),
    [roles],
  );

  const selectedRoles = useMemo(
    () => activeRoles.filter((role) => selectedRoleIds.includes(role._id)),
    [activeRoles, selectedRoleIds],
  );

  const activePermissions = useMemo(
    () =>
      permissions.filter(
        (permission) => permission.isActive && !permission.isDeleted,
      ),
    [permissions],
  );

  const groupedPermissions = useMemo(() => {
    return activePermissions.reduce<Record<string, IPermission[]>>(
      (groups, permission) => {
        const moduleName = permission.module || "Other";

        if (!groups[moduleName]) {
          groups[moduleName] = [];
        }

        groups[moduleName].push(permission);

        return groups;
      },
      {},
    );
  }, [activePermissions]);

  // MODULE WISE ALL CHECKBOX SELECTION HANDLER
  const handleModulePermissionChange = (
    roleId: string,
    modulePermissions: IPermission[],
    checked: boolean,
  ) => {
    setPermissionDrafts((previous) => {
      const current = previous[roleId] ?? [];
      const moduleIds = modulePermissions.map((p) => p._id);

      const updated = checked
        ? [...new Set([...current, ...moduleIds])]
        : current.filter((id) => !moduleIds.includes(id));

      return {
        ...previous,
        [roleId]: updated,
      };
    });
  };

  const handleApplyChanges = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);

      // Compare the user's current roles with the selected roles.
      const currentRoleIds = [...(selectedUser.roles ?? [])].sort();
      const updatedRoleIds = [...selectedRoleIds].sort();

      const rolesChanged =
        JSON.stringify(currentRoleIds) !== JSON.stringify(updatedRoleIds);

      // Save user role assignments only when they have changed.
      if (rolesChanged) {
        await axiosInstance.patch(`/users/${selectedUser._id}/assign-role`, {
          roles: selectedRoleIds,
        });
      }

      // Find selected roles whose permissions have changed.
      const changedRoles = selectedRoles.filter((role) => {
        const originalPermissions = [...(role.permissions ?? [])].sort();
        const updatedPermissions = [
          ...(permissionDrafts[role._id] ?? role.permissions ?? []),
        ].sort();

        return (
          JSON.stringify(originalPermissions) !==
          JSON.stringify(updatedPermissions)
        );
      });

      // Save permissions to their respective Role documents.
      for (const role of changedRoles) {
        await updateRole(role._id, {
          permissions: permissionDrafts[role._id] ?? [],
        });
      }

      // Refresh role data from the backend.
      await queryClient.invalidateQueries({
        queryKey: [...GLOBAL_API_KEY_CONSTANTS.ROLE],
      });

      // Refresh users because their role assignments may have changed.
      const response = await axiosInstance.get("/auth/users");
      setUsers(response.data.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Role and permission assignments saved successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error applying role-permission changes:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to save changes",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <QueryStateHandler
      isLoading={usersLoading || rolesLoading || permissionsLoading}
      isPending={rolesPending || permissionsPending}
      isError={Boolean(usersError) || rolesError || permissionsError}
      error={
        usersError ||
        (rolesError
          ? rolesErrorMessage
          : permissionsError
            ? permissionsErrorMessage
            : undefined)
      }
      loadingMessage="Loading role-permission management data..."
    >
      <div>
        <PageHeader
          description="Assign permissions to institution roles."
          subject="Total Roles"
          dataLength={roles?.length ?? 0}
          actions={
            <div className="lg:flex flex-wrap items-center gap-2">
              <div className="aura text-emerald-600">
                <div className="card bg-base-100 text-base-content">
                  <div className="card-body p-0.5">
                    <h3 className="flex items-center gap-2 rounded-md border border-gray-300 bg-base-100 px-2 py-0.5 text-sm font-bold lg:text-sm">
                      <LucideIcon.CalculatorIcon size={16} />
                      Permissions →
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-thin text-white">
                        {permissions?.length ?? 0}
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <Button
                size="xs"
                type="button"
                variant="primary"
                disabled={!selectedUser || isSaving}
                onClick={handleApplyChanges}
                title="Will be active on user selection"
              >
                {isSaving ? (
                  <LucideIcon.Loader size={16} className="animate-spin" />
                ) : (
                  <LucideIcon.Settings size={16} />
                )}
                {isSaving ? "Saving Changes..." : "Apply Changes"}
              </Button>
            </div>
          }
        />

        <div className="space-y-6">
          {/* User selection */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              1. Select User
            </h2>

            <div className="flex items-center gap-x-2">
              <div className="flex flex-wrap items-center lg:gap-x-8 gap-6">
                <div className="flex items-center gap-x-2 border rounded-lg border-gray-300 bg-gray-50 p-5.75">
                  <Select
                    name="role"
                    value={selectedUserId}
                    onChange={(event) => handleUserChange(event.target.value)}
                    options={userOptions}
                    placeholder="Choose an user"
                  />
                  {selectedUserId && (
                    <div className="">
                      <Button
                        onClick={() => {
                          setSelectedUserId("");
                          setSelectedRoleIds([]);
                        }}
                        icon={LucideRefreshCcw}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
                <div className="">
                  {selectedUser && (
                    <div className="rounded-lg bg-gray-50 py-2 px-4 border border-gray-300">
                      <p className="font-semibold text-gray-800">
                        {selectedUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedUser.email}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Account status: {selectedUser.status}
                        {selectedRoles.length > 0 &&
                          ` · Roles: ${selectedRoles.map((role) => role.name).join(", ")}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Roles selection */}

          {!selectedUser ? (
            <div className="rounded-xl border border-dashed bg-gray-50 p-10 text-center">
              <p className="font-medium text-gray-600">
                Select a user to view their access assignments.
              </p>
            </div>
          ) : (
            <>
              {/* Role assignments */}
              <section className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      2. Assign Roles
                    </h2>
                    <p className="text-sm text-gray-500">
                      Select the roles assigned to this user.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {selectedRoleIds.length} selected
                  </span>
                </div>

                {roles.length === 0 ? (
                  <p className="text-sm text-gray-500">No roles available.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {roles.map((role) => (
                      <label
                        key={role._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                          selectedRoleIds.includes(role._id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.includes(role._id)}
                          onChange={(event) =>
                            handleRoleChange(role._id, event.target.checked)
                          }
                          className="mt-1 h-4 w-4 accent-blue-600"
                        />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {role.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            {role.key}
                          </p>
                          {role.description && (
                            <p className="mt-2 text-sm text-gray-500">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Select Permission */}
          <section className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                3. Role Permissions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Permissions are grouped by module for each selected role.
              </p>
            </div>

            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Important:</strong> Permissions belong to roles, not
              individual users. Changing a role's permissions affects every user
              assigned to that role. Changes will be saved when you click Apply
              Changes.
            </div>

            {selectedRoles.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
                Select at least one role above to view its permissions.
              </div>
            ) : (
              <div className="space-y-6">
                {selectedRoles.map((role) => {
                  const rolePermissions =
                    permissionDrafts[role._id] ?? role.permissions ?? [];

                  return (
                    <div
                      key={role._id}
                      className="overflow-hidden rounded-xl border border-gray-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 px-4 py-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {role.name}
                          </h3>
                          <p className="text-xs text-gray-500">{role.key}</p>
                        </div>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {rolePermissions.length} permissions
                        </span>
                      </div>

                      <div className="space-y-5 p-4">
                        {Object.entries(groupedPermissions).map(
                          ([moduleName, modulePermissions]) => (
                            <div key={moduleName}>
                              <div className="flex items-center justify-between">
                                <h4 className="mb-3 border-b border-gray-300 pb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                                  {moduleName} →
                                </h4>
                                <div className="">
                                  <Button
                                    size="xs"
                                    icon={LucideIcon.ArrowUpDown}
                                    variant="outline"
                                    onClick={() =>
                                      handleModulePermissionChange(
                                        role._id,
                                        modulePermissions,
                                        !modulePermissions.every((permission) =>
                                          rolePermissions.includes(
                                            permission._id,
                                          ),
                                        ),
                                      )
                                    }
                                  >
                                    {modulePermissions.every((permission) =>
                                      rolePermissions.includes(permission._id),
                                    )
                                      ? "Deselect All"
                                      : "Select All"}
                                  </Button>
                                </div>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {modulePermissions.map((permission) => (
                                  <label
                                    key={permission._id}
                                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={rolePermissions.includes(
                                        permission._id,
                                      )}
                                      onChange={(event) =>
                                        handlePermissionChange(
                                          role._id,
                                          permission._id,
                                          event.target.checked,
                                        )
                                      }
                                      className="mt-1 h-4 w-4 accent-blue-600"
                                    />

                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-800">
                                        {permission.name}
                                      </p>
                                      <p className="break-all text-xs text-gray-400">
                                        {permission.key}
                                      </p>
                                      {permission.description && (
                                        <p className="mt-1 text-xs text-gray-500">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          {/* Save intentionally deferred */}
          <div className="flex justify-end">
            <div className="flex justify-end">
              <Button
                size="xs"
                type="button"
                variant="primary"
                disabled={!selectedUser || isSaving}
                onClick={handleApplyChanges}
                title="Will be active on user selection"
              >
                {isSaving ? (
                  <LucideIcon.Loader size={16} className="animate-spin" />
                ) : (
                  <LucideIcon.Settings size={16} />
                )}
                {isSaving ? "Saving Changes..." : "Apply Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </QueryStateHandler>
  );
};

export default RolePermissionManagementPage;
