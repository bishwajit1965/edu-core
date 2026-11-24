import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { SubjectConfigurationServices } from "./subject-configurations.service.js";

// Create Subject Configuration
const createSubjectConfiguration = catchAsync(async (req, res) => {
  const result =
    await SubjectConfigurationServices.createSubjectConfigurationService(
      req.body,
    );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subject configuration created successfully",
    data: result,
  });
});

// Get All Subject Configurations
const getAllSubjectConfigurations = catchAsync(async (req, res) => {
  const result =
    await SubjectConfigurationServices.getAllSubjectConfigurationsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subject configurations retrieved successfully",
    data: result,
  });
});

// Get Single Subject Configuration
const getSingleSubjectConfiguration = catchAsync(async (req, res) => {
  const result =
    await SubjectConfigurationServices.getSingleSubjectConfigurationService(
      req.params.id as string,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subject configuration retrieved successfully",
    data: result,
  });
});

// Update Subject Configuration
const updateSubjectConfiguration = catchAsync(async (req, res) => {
  const result =
    await SubjectConfigurationServices.updateSubjectConfigurationService(
      req.params.id as string,
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subject configuration updated successfully",
    data: result,
  });
});

// Delete Subject Configuration
const deleteSubjectConfiguration = catchAsync(async (req, res) => {
  const result =
    await SubjectConfigurationServices.deleteSubjectConfigurationService(
      req.params.id as string,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subject configuration deleted successfully",
    data: result,
  });
});

export const SubjectConfigurationControllers = {
  createSubjectConfiguration,
  getAllSubjectConfigurations,
  getSingleSubjectConfiguration,
  updateSubjectConfiguration,
  deleteSubjectConfiguration,
};
