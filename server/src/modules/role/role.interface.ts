import { Model, Types } from "mongoose";

export interface IRole {
  name: string;
  key: string;
  description?: string;
  // Permissions assigned to this role
  permissions: Types.ObjectId[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleModel extends Model<IRole> {}
