import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError.js";
import verifyToken from "../utils/verifyToken.js";

import { User } from "../modules/auth/auth.model.js";
import { USER_STATUS } from "../modules/auth/auth.constant.js";

const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(401, "You are not authorized");
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw new AppError(401, "Invalid authorization token");
    }

    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);

    if (typeof decoded === "string" || !decoded.userId) {
      throw new AppError(401, "Invalid authentication payload");
    }

    const user = await User.findOne({
      _id: decoded.userId,
      status: USER_STATUS.ACTIVE,
      isDeleted: false,
      isVerified: true,
    })
      .select("_id name email avatar status roles")
      .populate({
        path: "roles",
        select: "_id name key permissions",
        populate: {
          path: "permissions",
          select: "_id key module description",
        },
      });

    if (!user) {
      throw new AppError(401, "User not found or inactive");
    }

    req.user = user as unknown as NonNullable<Express.Request["user"]>;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import verifyToken from "../utils/verifyToken.js";

// import AppError from "../errors/AppError";

// const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     throw new AppError(401, "You are not authorized");
//   }

//   const bearerToken = token.split(" ")[1];

//   if (!bearerToken) {
//     throw new AppError(401, "You are not authorized");
//   }

//   const decoded = verifyToken(
//     bearerToken,
//     process.env.JWT_ACCESS_SECRET as string,
//   );

//   (req as Request & { user: string | jwt.JwtPayload }).user = decoded;

//   next();
// };

// export default authMiddleware;
