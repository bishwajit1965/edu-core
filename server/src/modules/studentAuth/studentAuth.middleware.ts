import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import verifyToken from "../../utils/verifyToken.js";
import AppError from "../../errors/AppError";

const studentAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  const token = req.cookies?.studentAccessToken || bearerToken;

  if (!token) {
    throw new AppError(401, "You are not authorized");
  }

  // const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);

  let decoded: jwt.JwtPayload | string;

  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      throw new AppError(401, "Invalid or expired student access token");
    }

    throw error;
  }
  console.log("Decoded in student auth middleware", decoded);
  if (
    typeof decoded === "string" ||
    decoded.role !== "STUDENT" ||
    !decoded.studentId
  ) {
    throw new AppError(403, "Student access only");
  }

  (req as Request & { user: string | jwt.JwtPayload }).user = decoded;

  next();
};

export default studentAuthMiddleware;
