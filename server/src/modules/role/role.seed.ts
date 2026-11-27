import { Role } from "./role.model.js";
import { USER_ROLE } from "../auth/auth.constant.js";

const defaultRoles = [
  {
    name: "Administrator",
    key: USER_ROLE.ADMIN,
    description: "System administrator with administrative access.",
  },
  {
    name: "User",
    key: USER_ROLE.USER,
    description: "Default role assigned to newly registered users.",
  },
  {
    name: "Principal",
    key: USER_ROLE.PRINCIPAL,
    description: "Institution principal.",
  },
  {
    name: "Vice Principal",
    key: USER_ROLE.VICE_PRINCIPAL,
    description: "Institution vice principal.",
  },
  {
    name: "Teacher",
    key: USER_ROLE.TEACHER,
    description: "Institution teaching staff.",
  },
  {
    name: "Staff",
    key: USER_ROLE.STAFF,
    description: "Institution administrative and office staff.",
  },
];

export const seedDefaultRoles = async () => {
  for (const role of defaultRoles) {
    await Role.updateOne(
      { key: role.key },
      {
        $setOnInsert: role,
      },
      { upsert: true },
    );
  }

  console.log("Default roles initialized.");
};
