import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { User } from "../auth/auth.model.js";
import { USER_ROLE, USER_STATUS } from "../auth/auth.constant.js";
import { redisClient } from "../../database/redis.js";

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

const assignRoleService = async (id: string, role: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }

  if (!Object.values(USER_ROLE).includes(role as any)) {
    throw new AppError(400, "Invalid user role");
  }

  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true,
    },
  ).select("_id name email avatar bio role status createdAt updatedAt");

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
