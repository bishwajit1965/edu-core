import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";

const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, "You are not authenticated");
      }

      const userRoles = req.user.roles.map((role) => role.key);

      const hasRole = allowedRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new AppError(403, "You do not have the required role");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;
