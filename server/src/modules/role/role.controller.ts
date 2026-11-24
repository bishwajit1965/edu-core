import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { RoleService } from "./role.service.js";

const createRole = catchAsync(async (req, res) => {
  const result = await RoleService.createRoleService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Role created successfully.",
    data: result,
  });
});

const getAllRoles = catchAsync(async (_req, res) => {
  const result = await RoleService.getAllRolesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Roles retrieved successfully.",
    data: result,
  });
});

const getRoleById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid role id");
  }

  const result = await RoleService.getRoleByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role retrieved successfully.",
    data: result,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid role id");
  }

  const result = await RoleService.updateRoleService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role updated successfully.",
    data: result,
  });
});

const updateRoleStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid role id");
  }

  if (typeof isActive !== "boolean") {
    throw new AppError(400, "isActive must be a boolean");
  }

  const result = await RoleService.updateRoleStatusService(id, isActive);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role status updated successfully.",
    data: result,
  });
});

const softDeleteRole = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid role id");
  }

  const result = await RoleService.softDeleteRoleService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role deleted successfully.",
    data: result,
  });
});

export const RoleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  updateRoleStatus,
  softDeleteRole,
};
