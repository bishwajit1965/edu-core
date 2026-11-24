import { model, Schema } from "mongoose";
import { IPermission, PermissionModel } from "./permission.interface";

const permissionSchema = new Schema<IPermission, PermissionModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Permission = model<IPermission, PermissionModel>(
  "Permission",
  permissionSchema,
);
