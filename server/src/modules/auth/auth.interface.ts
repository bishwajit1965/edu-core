import { Model, Types } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./auth.constant.js";

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface IAuthPermission {
  _id: Types.ObjectId;
  key: string;
  module: string;
  description: string;
}

export interface IAuthRole {
  _id: Types.ObjectId;
  name: string;
  key: string;
  permissions: IAuthPermission[];
}

export interface IAuthenticatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar: string;
  status: string;

  roles: IAuthRole[];
  // Derived effective permissions
  permissions: string[];
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  // role: TUserRole;
  // RBAC
  roles: Types.ObjectId[];

  bio: string;
  status: TUserStatus;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
}
