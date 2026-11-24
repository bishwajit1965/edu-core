import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PermissionService } from "./permission.service.js";

const createPermission = catchAsync(async (req, res) => {
  const result = await PermissionService.createPermissionService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Permission created successfully.",
    data: result,
  });
});

const getAllPermissions = catchAsync(async (_req, res) => {
  const result = await PermissionService.getAllPermissionsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Permissions retrieved successfully.",
    data: result,
  });
});

const getPermissionById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid permission id");
  }

  const result = await PermissionService.getPermissionByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Permission retrieved successfully.",
    data: result,
  });
});

const updatePermission = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid permission id");
  }

  const result = await PermissionService.updatePermissionService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Permission updated successfully.",
    data: result,
  });
});

const updatePermissionStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid permission id");
  }

  if (typeof isActive !== "boolean") {
    throw new AppError(400, "isActive must be a boolean");
  }

  const result = await PermissionService.updatePermissionStatusService(
    id,
    isActive,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Permission status updated successfully.",
    data: result,
  });
});

const softDeletePermission = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid permission id");
  }

  const result = await PermissionService.softDeletePermissionService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Permission deleted successfully.",
    data: result,
  });
});

export const PermissionController = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  updatePermissionStatus,
  softDeletePermission,
};
