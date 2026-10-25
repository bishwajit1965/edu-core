import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { InstitutionSettingsService } from "./institution-settings.service";
import sendResponse from "../../utils/sendResponse";

const getInstitutionSettings = catchAsync(
  async (_req: Request, res: Response) => {
    const result =
      await InstitutionSettingsService.getInstitutionSettingsService();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Institution settings retrieved successfully",
      data: result,
    });
  },
);

const createInstitutionSettings = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await InstitutionSettingsService.createInstitutionSettingsService(
        req.body,
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Institution settings created successfully",
      data: result,
    });
  },
);

const updateInstitutionSettings = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await InstitutionSettingsService.updateInstitutionSettingsService(
        req.body,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Institution settings updated successfully",
      data: result,
    });
  },
);

export const InstitutionSettingsController = {
  getInstitutionSettings,
  createInstitutionSettings,
  updateInstitutionSettings,
};
