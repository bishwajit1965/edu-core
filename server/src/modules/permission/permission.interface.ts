import { Model } from "mongoose";

export interface IPermission {
  name: string;
  key: string;
  module: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionModel extends Model<IPermission> {}
