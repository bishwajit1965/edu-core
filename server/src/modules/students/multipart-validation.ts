import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject } from "zod";
import AppError from "../../errors/AppError.js";

const validateStudentMultipart =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (typeof req.body?.data !== "string") {
        throw new AppError(
          400,
          'Please provide student JSON in the "data" field.',
        );
      }

      let parsedData: unknown;

      try {
        parsedData = JSON.parse(req.body.data);
      } catch {
        throw new AppError(400, 'The "data" field must contain valid JSON.');
      }

      const result = schema.parse({ body: parsedData });

      // Expose the validated student object to the controller.
      req.body = result.body;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }

      next(error);
    }
  };

export default validateStudentMultipart;
