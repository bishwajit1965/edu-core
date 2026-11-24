import { model, Schema } from "mongoose";
import { IRolePermission } from "./rolePermission.interface";

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },

    permission: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate role-permission assignment
rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

const rolePermission = model<IRolePermission>(
  "RolePermission",
  rolePermissionSchema,
);

export default rolePermission;
