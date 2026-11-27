import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { User } from "../auth/auth.model.js";
import { USER_ROLE, USER_STATUS } from "../auth/auth.constant.js";
import { redisClient } from "../../database/redis.js";
import { Role } from "../role/role.model.js";

const getAllUsersService = async () => {
  // Redis cash
  const cacheKey = "users:all";

  const cachedUsers = await redisClient.get(cacheKey);

  if (cachedUsers) {
    console.log("CACHE HIT");
    return JSON.parse(cachedUsers);
  }

  console.log("CACHE MISS");

  const users = await User.find({ isDeleted: false });

  await redisClient.set(cacheKey, JSON.stringify(users), {
    EX: 60, //60 seconds
  });

  return users;
};

const getUserByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false }).select(
    "_id name email role status createdAt updatedAt",
  );

  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

const updateUserService = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    avatar: string;
    bio: string;
    role: string;
    status: string;
  }>,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("_id name email avatar bio role status createdAt updatedAt");

  return updatedUser;
};

const blockUserService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }

  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const blockedUser = await User.findByIdAndUpdate(
    id,
    { status: USER_STATUS.BLOCKED },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select(
    "_id name email avatar bio role status isDeleted createdAt updatedAt",
  );

  return blockedUser;
};

const softDeleteUserService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const softDeletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select(
    "_id name email avatar bio role status isDeleted createdAt updatedAt",
  );

  return softDeletedUser;
};

// const assignRoleService = async (id: string, role: string) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new AppError(400, "Invalid user id");
//   }

//   if (!Object.values(USER_ROLE).includes(role as any)) {
//     throw new AppError(400, "Invalid user role");
//   }

//   const user = await User.findOne({ _id: id, isDeleted: false });

//   if (!user) {
//     throw new AppError(404, "User not found");
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     id,
//     { role },
//     {
//       new: true,
//       runValidators: true,
//     },
//   ).select("_id name email avatar bio role status createdAt updatedAt");

//   return updatedUser;
// };

const assignRoleService = async (id: string, roles: string[]) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }

  if (!Array.isArray(roles)) {
    throw new AppError(400, "Roles must be an array");
  }

  // Remove duplicate role IDs
  const uniqueRoleIds = [...new Set(roles)];

  // Validate role IDs
  const invalidIds = uniqueRoleIds.some(
    (roleId) => !mongoose.Types.ObjectId.isValid(roleId),
  );

  if (invalidIds) {
    throw new AppError(400, "Invalid role id");
  }

  // Verify that all selected roles exist and are active
  const validRoles = await Role.find({
    _id: { $in: uniqueRoleIds },
    isActive: true,
    isDeleted: false,
  }).select("_id");

  if (validRoles.length !== uniqueRoleIds.length) {
    throw new AppError(400, "One or more selected roles are invalid");
  }

  const user = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { roles: uniqueRoleIds },
    { new: true, runValidators: true },
  ).select("_id name email avatar bio roles status createdAt updatedAt");

  return updatedUser;
};
export const UserService = {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  blockUserService,
  softDeleteUserService,
  assignRoleService,
};
