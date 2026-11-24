import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { SubjectServices } from "./subjects.service.js";

const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Create Subject
const createSubject = catchAsync(async (req, res) => {
  const result = await SubjectServices.createSubjectService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subject created successfully",
    data: result,
  });
});

// Get All Subjects
const getAllSubjects = catchAsync(async (req, res) => {
  const result = await SubjectServices.getAllSubjectsService();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subjects retrieved successfully",
    data: result,
  });
});

// Get Single Subject
const getSingleSubject = catchAsync(async (req, res) => {
  const result = await SubjectServices.getSingleSubjectService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subject retrieved successfully",
    data: result,
  });
});

// Update Subject
const updateSubject = catchAsync(async (req, res) => {
  const result = await SubjectServices.updateSubjectService(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subject updated successfully",
    data: result,
  });
});

// Delete Subject
const deleteSubject = catchAsync(async (req, res) => {
  const result = await SubjectServices.deleteSubjectService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subject deleted successfully",
    data: result,
  });
});

export const SubjectControllers = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};
