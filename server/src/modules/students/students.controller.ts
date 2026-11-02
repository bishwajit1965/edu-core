import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StudentsService } from "./students.service";
import AppError from "../../errors/AppError";

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const files = (req.files ?? []) as Express.Multer.File[];
  const result = await StudentsService.createStudentService(
    payload as Parameters<typeof StudentsService.createStudentService>[0],
    files,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Student admitted successfully",
    data: result,
  });
});

const getAllStudents = catchAsync(async (_req: Request, res: Response) => {
  const result = await StudentsService.getAllStudentsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Students retrieved successfully",
    data: result,
  });
});

const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentsService.getStudentByIdService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const files = (req.files ?? []) as Express.Multer.File[];
  const result = await StudentsService.updateStudentService(
    req.params.id as string,
    payload as Parameters<typeof StudentsService.updateStudentService>[1],
    files,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

const softDeleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { deletionReason } = req.body;

    // Replace req.user with your project's authenticated-user property.
    const deletedBy =
      typeof req.user === "object" &&
      req.user !== null &&
      "userId" in req.user &&
      typeof req.user.userId === "string"
        ? req.user.userId
        : undefined;

    if (!deletedBy) {
      throw new AppError(401, "Authentication required.");
    }

    const student = await StudentsService.softDeleteStudentService(
      id,
      deletedBy,
      deletionReason,
    );

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const restoreStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    // Replace req.user with your project's authenticated-user property.
    const restoredBy =
      typeof req.user === "object" &&
      req.user !== null &&
      "userId" in req.user &&
      typeof req.user.userId === "string"
        ? req.user.userId
        : undefined;

    if (!restoredBy) {
      throw new AppError(401, "Authentication required.");
    }
    const student = await StudentsService.restoreStudentService(id, restoredBy);

    res.status(200).json({
      success: true,
      message: "Student restored successfully.",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getDeletedStudents = catchAsync(async (_req: Request, res: Response) => {
  const result = await StudentsService.getDeletedStudentsService();
  if (!result) {
    throw new AppError(404, "Deleted students not found.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deleted students fetched successfully!",
    data: result,
  });
});

export const StudentsController = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  softDeleteStudent,
  restoreStudent,
  getDeletedStudents,
};
