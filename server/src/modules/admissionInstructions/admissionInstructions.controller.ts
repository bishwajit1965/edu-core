import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AdmissionInstructionsService } from "./ admissionInstructions.service.js";

const createAdmissionInstructions = catchAsync(async (req, res) => {
  const result =
    await AdmissionInstructionsService.createAdmissionInstructionsService(
      req.body,
      req.user?._id?.toString(),
    );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admission instructions created successfully.",
    data: result,
  });
});

const getAllAdmissionInstructions = catchAsync(async (_req, res) => {
  const result =
    await AdmissionInstructionsService.getAllAdmissionInstructionsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions retrieved successfully.",
    data: result,
  });
});

const getAdmissionInstructionsById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const result =
    await AdmissionInstructionsService.getAdmissionInstructionsByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions retrieved successfully.",
    data: result,
  });
});

// Public controller
const getPublicAdmissionInstructions = catchAsync(async (req, res) => {
  const { academicSession } = req.params;

  if (typeof academicSession !== "string") {
    throw new AppError(400, "Academic session is required");
  }

  const result =
    await AdmissionInstructionsService.getPublicAdmissionInstructionsService(
      academicSession,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions retrieved successfully.",
    data: result,
  });
});

const updateAdmissionInstructions = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const result =
    await AdmissionInstructionsService.updateAdmissionInstructionsService(
      id,
      req.body,
      req.user?._id?.toString(),
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions updated successfully.",
    data: result,
  });
});

const updateAdmissionInstructionsStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isPublished } = req.body;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid admission instructions id");
  }

  if (typeof isPublished !== "boolean") {
    throw new AppError(400, "isPublished must be a boolean");
  }

  const result =
    await AdmissionInstructionsService.updateAdmissionInstructionsStatusService(
      id,
      isPublished,
      req.user?._id?.toString(),
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions publication status updated successfully.",
    data: result,
  });
});

const softDeleteAdmissionInstructions = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const result =
    await AdmissionInstructionsService.softDeleteAdmissionInstructionsService(
      id,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instructions deleted successfully.",
    data: result,
  });
});

const restoreInstructionService = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid admission instruction id");
  }
  const result =
    await AdmissionInstructionsService.restoreAdmissionInstructionsService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admission instruction restored successfully.",
    data: result,
  });
});

export const AdmissionInstructionsController = {
  createAdmissionInstructions,
  getAllAdmissionInstructions,
  getAdmissionInstructionsById,
  getPublicAdmissionInstructions,
  updateAdmissionInstructions,
  updateAdmissionInstructionsStatus,
  softDeleteAdmissionInstructions,
  restoreInstructionService,
};
