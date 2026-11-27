import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { Role } from "./role.model.js";

const createRoleService = async (payload: {
  name: string;
  key: string;
  description?: string;
}) => {
  const existingRole = await Role.findOne({
    key: payload.key.trim().toUpperCase(),
  });

  if (existingRole) {
    throw new AppError(409, "Role key already exists");
  }

  const role = await Role.create(payload);
  return role;
};

const getAllRolesService = async () => {
  const roles = await Role.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return roles;
};

const getRoleByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role id");
  }

  const role = await Role.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  return role;
};

const updateRoleService = async (
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    permissions: mongoose.Types.ObjectId[];
  }>,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role id");
  }

  const role = await Role.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  return role;
};

const updateRoleStatusService = async (id: string, isActive: boolean) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role id");
  }

  const role = await Role.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isActive },
    { new: true, runValidators: true },
  );

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  return role;
};

const softDeleteRoleService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role id");
  }

  const role = await Role.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true, runValidators: true },
  );

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  return role;
};

export const RoleService = {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  updateRoleStatusService,
  softDeleteRoleService,
};
