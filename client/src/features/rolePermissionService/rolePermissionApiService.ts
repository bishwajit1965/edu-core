import axiosInstance from "../../lib/axios.js";
import type { IPermission } from "../permission/permissionApi.js";
import type { IRole } from "../role/roleApi.js";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IRolePermission {
  _id: string;
  role: string;
  permission: IPermission;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveRolePermissionsPayload {
  role: string;
  permission: string[];
}

// Get all roles
export const getAllRolesForAssignment = async (): Promise<IRole[]> => {
  const response = await axiosInstance.get<ApiResponse<IRole[]>>("/roles");

  return response.data.data;
};

// Get all permissions
export const getAllPermissionsForAssignment = async (): Promise<
  IPermission[]
> => {
  const response =
    await axiosInstance.get<ApiResponse<IPermission[]>>("/permissions");

  return response.data.data;
};

// Get permissions assigned to a role
export const getRolePermissions = async (
  roleId: string,
): Promise<IRolePermission[]> => {
  const response = await axiosInstance.get<ApiResponse<IRolePermission[]>>(
    `/role-permissions/role/${roleId}`,
  );

  return response.data.data;
};

// Synchronize role permissions
export const saveRolePermissions = async (
  payload: SaveRolePermissionsPayload,
): Promise<IRolePermission[]> => {
  const response = await axiosInstance.post<ApiResponse<IRolePermission[]>>(
    "/role-permissions",
    payload,
  );

  return response.data.data;
};
