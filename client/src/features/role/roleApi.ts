import axiosInstance from "../../lib/axios.js";

export interface IRole {
  _id: string;
  name: string;
  key: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  key: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ROLE_ENDPOINT = "/roles";

// Get all roles
export const getAllRoles = async (): Promise<IRole[]> => {
  const response = await axiosInstance.get<ApiResponse<IRole[]>>(ROLE_ENDPOINT);

  return response.data.data;
};

// Get role by ID
export const getRoleById = async (id: string): Promise<IRole> => {
  const response = await axiosInstance.get<ApiResponse<IRole>>(
    `${ROLE_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

// Create role
export const createRole = async (
  payload: CreateRolePayload,
): Promise<IRole> => {
  const response = await axiosInstance.post<ApiResponse<IRole>>(
    ROLE_ENDPOINT,
    payload,
  );

  return response.data.data;
};

// Update role
export const updateRole = async (
  id: string,
  payload: UpdateRolePayload,
): Promise<IRole> => {
  const response = await axiosInstance.patch<ApiResponse<IRole>>(
    `${ROLE_ENDPOINT}/${id}`,
    payload,
  );

  return response.data.data;
};

// Update role status
export const updateRoleStatus = async (
  id: string,
  isActive: boolean,
): Promise<IRole> => {
  const response = await axiosInstance.patch<ApiResponse<IRole>>(
    `${ROLE_ENDPOINT}/${id}/status`,
    { isActive },
  );

  return response.data.data;
};

// Soft delete role
export const softDeleteRole = async (id: string): Promise<IRole> => {
  const response = await axiosInstance.patch<ApiResponse<IRole>>(
    `${ROLE_ENDPOINT}/${id}/soft-delete`,
  );

  return response.data.data;
};
