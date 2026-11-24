import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { Permission } from "./permission.model.js";

const createPermissionService = async (payload: {
  name: string;
  key: string;
  module: string;
  description?: string;
}) => {
  const existingPermission = await Permission.findOne({
    key: payload.key.trim().toUpperCase(),
  });

  if (existingPermission) {
    throw new AppError(409, "Permission key already exists");
  }

  const permission = await Permission.create(payload);

  return permission;
};

const getAllPermissionsService = async () => {
  const permissions = await Permission.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return permissions;
};

const getPermissionByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid permission id");
  }

  const permission = await Permission.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!permission) {
    throw new AppError(404, "Permission not found");
  }

  return permission;
};

const updatePermissionService = async (
  id: string,
  payload: Partial<{
    name: string;
    module: string;
    description: string;
  }>,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid permission id");
  }

  const permission = await Permission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!permission) {
    throw new AppError(404, "Permission not found");
  }

  return permission;
};

const updatePermissionStatusService = async (id: string, isActive: boolean) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid permission id");
  }

  const permission = await Permission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!permission) {
    throw new AppError(404, "Permission not found");
  }

  return permission;
};

const softDeletePermissionService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid permission id");
  }

  const permission = await Permission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!permission) {
    throw new AppError(404, "Permission not found");
  }

  return permission;
};

export const PermissionService = {
  createPermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  updatePermissionStatusService,
  softDeletePermissionService,
};
