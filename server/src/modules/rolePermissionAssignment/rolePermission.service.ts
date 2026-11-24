import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { Role } from "../role/role.model.js";
import { Permission } from "../permission/permission.model.js";
import RolePermission from "./rolePermission.model.js";

const createRolePermissionService = async (payload: {
  role: string;
  permission: string[];
}) => {
  const { role: roleId, permission: permissionIds } = payload;

  // Validate role ID
  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    throw new AppError(400, "Invalid role id");
  }

  // Validate permission IDs
  if (
    !Array.isArray(permissionIds) ||
    permissionIds.length === 0 ||
    permissionIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
  ) {
    throw new AppError(400, "Invalid permission id");
  }

  // Remove duplicate IDs from the request
  const uniquePermissionIds = [...new Set(permissionIds)];

  // Check role
  const role = await Role.findOne({
    _id: roleId,
    isDeleted: false,
  });

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  if (!role.isActive) {
    throw new AppError(400, "Cannot assign permission to an inactive role");
  }

  // Check all permissions
  const permissions = await Permission.find({
    _id: { $in: uniquePermissionIds },
    isDeleted: false,
    isActive: true,
  });

  if (permissions.length !== uniquePermissionIds.length) {
    throw new AppError(
      400,
      "One or more permissions are invalid, deleted, or inactive",
    );
  }

  // Create or reactivate assignments
  const assignments = await Promise.all(
    uniquePermissionIds.map(async (permissionId) => {
      const existingAssignment = await RolePermission.findOne({
        role: roleId,
        permission: permissionId,
      });

      if (existingAssignment) {
        if (!existingAssignment.isDeleted && existingAssignment.isActive) {
          return existingAssignment;
        }

        existingAssignment.isDeleted = false;
        existingAssignment.isActive = true;

        await existingAssignment.save();

        return existingAssignment;
      }

      return RolePermission.create({
        role: roleId,
        permission: permissionId,
      });
    }),
  );

  return assignments;
};

const getAllRolePermissionsService = async () => {
  const assignments = await RolePermission.find({
    isDeleted: false,
  })
    .populate("role")
    .populate("permission")
    .sort({ createdAt: -1 });

  return assignments;
};

const getRolePermissionsService = async (roleId: string) => {
  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    throw new AppError(400, "Invalid role id");
  }

  const role = await Role.findOne({
    _id: roleId,
    isDeleted: false,
  });

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  const assignments = await RolePermission.find({
    role: roleId,
    isDeleted: false,
  })
    .populate("permission")
    .sort({ createdAt: -1 });

  return assignments;
};

const updateRolePermissionStatusService = async (
  id: string,
  isActive: boolean,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role-permission id");
  }

  const assignment = await RolePermission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isActive },
    { new: true, runValidators: true },
  );

  if (!assignment) {
    throw new AppError(404, "Role-permission assignment not found");
  }

  return assignment;
};

const softDeleteRolePermissionService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid role-permission id");
  }

  const assignment = await RolePermission.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true, runValidators: true },
  );

  if (!assignment) {
    throw new AppError(404, "Role-permission assignment not found");
  }

  return assignment;
};

export const RolePermissionService = {
  createRolePermissionService,
  getAllRolePermissionsService,
  getRolePermissionsService,
  updateRolePermissionStatusService,
  softDeleteRolePermissionService,
};
