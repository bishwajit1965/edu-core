import { JwtPayload } from "jsonwebtoken";
import { IAuthenticatedUser } from "../../modules/auth/auth.interface.js";

declare global {
  namespace Express {
    interface Request {
      // user?: JwtPayload | string;
      user?: IAuthenticatedUser;
    }
  }
}

export {};
