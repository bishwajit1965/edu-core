import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StudentsService } from "./students.service";

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

export const StudentsController = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
};
