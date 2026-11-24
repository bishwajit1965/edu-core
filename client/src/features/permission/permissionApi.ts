import axiosInstance from "../../lib/axios.js";

export interface IPermission {
  _id: string;
  name: string;
  key: string;
  module: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePermissionPayload {
  name: string;
  key: string;
  module: string;
  description: string;
}

export interface UpdatePermissionPayload {
  name?: string;
  key: string;
  module: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const PERMISSION_ENDPOINT = "/permissions";

// Get all permissions
export const getAllPermissions = async (): Promise<IPermission[]> => {
  const response =
    await axiosInstance.get<ApiResponse<IPermission[]>>(PERMISSION_ENDPOINT);
  return response.data.data;
};

// Get Permission by Id
export const getPermissionById = async (id: string): Promise<IPermission> => {
  const response = await axiosInstance.get<ApiResponse<IPermission>>(
    `${PERMISSION_ENDPOINT}/${id}`,
  );
  return response.data.data;
};

// Create Permission
export const createPermission = async (
  payload: CreatePermissionPayload,
): Promise<IPermission> => {
  const response = await axiosInstance.post<ApiResponse<IPermission>>(
    PERMISSION_ENDPOINT,
    payload,
  );
  return response.data.data;
};

// Update Permission
export const updatePermission = async (
  id: string,
  payload: UpdatePermissionPayload,
): Promise<IPermission> => {
  const response = await axiosInstance.patch<ApiResponse<IPermission>>(
    `${PERMISSION_ENDPOINT}/${id}`,
    payload,
  );
  return response.data.data;
};

// Update Permission Status
export const updatePermissionStatus = async (
  id: string,
  isActive: boolean,
): Promise<IPermission> => {
  const response = await axiosInstance.patch<ApiResponse<IPermission>>(
    `${PERMISSION_ENDPOINT}/${id}/status`,
    { isActive },
  );
  return response.data.data;
};

// Soft Delete Permission
export const softDeletePermission = async (
  id: string,
): Promise<IPermission> => {
  const response = await axiosInstance.patch<
    ApiResponse<IPermission>
  >(`${PERMISSION_ENDPOINT}/${id}/soft-delete
`);
  return response.data.data;
};
