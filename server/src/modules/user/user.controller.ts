import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (_req, res) => {
  const result = await UserService.getAllUsersService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid user ID");
  }
  const result = await UserService.getUserByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully.",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid user id");
  }
  const result = await UserService.updateUserService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully.",
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid user id");
  }

  const result = await UserService.blockUserService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is blocked successfully.",
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid user id");
  }

  const result = await UserService.softDeleteUserService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is soft deleted successfully.",
    data: result,
  });
});

const assignRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid user id");
  }

  if (typeof role !== "string") {
    throw new AppError(400, "Role is required");
  }

  const result = await UserService.assignRoleService(id, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role assigned successfully.",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  blockUser,
  softDeleteUser,
  assignRole,
};
