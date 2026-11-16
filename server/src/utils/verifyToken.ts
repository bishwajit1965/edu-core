import jwt from "jsonwebtoken";
import AppError from "../errors/AppError";

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      throw new AppError(401, "Invalid or expired access token");
    }

    throw error;
  }
};

export default verifyToken;
