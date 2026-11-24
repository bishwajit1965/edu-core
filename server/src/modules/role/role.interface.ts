import { Model } from "mongoose";

export interface IRole {
  name: string;
  key: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleModel extends Model<IRole> {}
