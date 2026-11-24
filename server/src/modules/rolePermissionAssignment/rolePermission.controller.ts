import { Request, Response } from "express";

const httpStatus = {
  CREATED: 201,
  OK: 200,
} as const;

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { RolePermissionService } from "./rolePermission.service.js";

const createRolePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await RolePermissionService.createRolePermissionService(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Permission assigned to role successfully",
    data: result,
  });
});

const getAllRolePermissions = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await RolePermissionService.getAllRolePermissionsService();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Role-permission assignments retrieved successfully",
      data: result,
    });
  },
);

const getRolePermissions = catchAsync(async (req: Request, res: Response) => {
  const roleId = req.params.roleId as string;

  const result = await RolePermissionService.getRolePermissionsService(roleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role permissions retrieved successfully",
    data: result,
  });
});

const updateRolePermissionStatus = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { isActive } = req.body;

    const result =
      await RolePermissionService.updateRolePermissionStatusService(
        id,
        isActive,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Role-permission status updated successfully",
      data: result,
    });
  },
);

const softDeleteRolePermission = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result =
      await RolePermissionService.softDeleteRolePermissionService(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Role-permission assignment removed successfully",
      data: result,
    });
  },
);

export const RolePermissionController = {
  createRolePermission,
  getAllRolePermissions,
  getRolePermissions,
  updateRolePermissionStatus,
  softDeleteRolePermission,
};
