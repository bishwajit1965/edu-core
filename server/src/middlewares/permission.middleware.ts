import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";

const authorizePermission =
  (...requiredPermissions: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError(401, "Unauthorized");
    }

    const userPermissions = user.permissions ?? [];

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new AppError(403, "Forbidden Access");
    }

    next();
  };

export default authorizePermission;
