import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject } from "zod";
import AppError from "../errors/AppError.js";
import upload from "../modules/media/media.middleware.js";

const validateMultipart =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const validateData = () => {
      try {
        let requestBody: unknown;

        if (req.is("multipart/form-data")) {
          if (typeof req.body?.data !== "string") {
            throw new AppError(
              400,
              'Please provide JSON data in the "data" field.',
            );
          }

          try {
            requestBody = JSON.parse(req.body.data);
          } catch {
            throw new AppError(
              400,
              'The "data" field must contain valid JSON.',
            );
          }
        } else if (req.is("application/json")) {
          requestBody = req.body;
        } else {
          throw new AppError(415, "Unsupported content type.");
        }

        const validatedData = schema.parse({
          body: requestBody,
          params: req.params,
          query: req.query,
        });

        req.body = validatedData.body;

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return next(error);
        }

        next(error);
      }
    };

    if (req.is("multipart/form-data")) {
      upload.array("files", 10)(req, _res, (error) => {
        if (error) {
          return next(error);
        }

        validateData();
      });

      return;
    }

    validateData();
  };

export default validateMultipart;

// import type { Request, Response, NextFunction } from "express";
// import { ZodError, type ZodObject } from "zod";
// import AppError from "../errors/AppError.js";

// const validateMultipart =
//   (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
//     try {
//       if (typeof req.body?.data !== "string") {
//         throw new AppError(
//           400,
//           'Please provide JSON data in the "data" field.',
//         );
//       }

//       let parsedData: unknown;

//       try {
//         parsedData = JSON.parse(req.body.data);
//       } catch {
//         throw new AppError(400, 'The "data" field must contain valid JSON.');
//       }

//       const validatedData = schema.parse({
//         body: parsedData,
//         params: req.params,
//         query: req.query,
//       });

//       req.body = validatedData.body;

//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return next(error);
//       }

//       next(error);
//     }
//   };

// export default validateMultipart;
