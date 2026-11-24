import { Types } from "mongoose";

export interface IRolePermission {
  role: Types.ObjectId;
  permission: Types.ObjectId;
  isActive: boolean;
  isDeleted: boolean;
}
