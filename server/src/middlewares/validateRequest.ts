import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

const validateRequest =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = validatedData.body ?? req.body;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }

      next(error);
    }
  };

export default validateRequest;
