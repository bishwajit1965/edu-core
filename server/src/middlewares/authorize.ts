import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";

const authorize =
  (...requiredRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (
      !user ||
      !user.roles.some(
        (role) =>
          "key" in role &&
          typeof role.key === "string" &&
          requiredRoles.includes(role.key),
      )
    ) {
      throw new AppError(403, "Forbidden Access");
    }

    next();
  };

export default authorize;
