import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ThemeService } from "./theme.service.js";

const createTheme = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files ?? []) as Express.Multer.File[];

  const previewFile = files.find((file) => file.fieldname === "preview");
  const slideFiles = files.filter((file) =>
    file.fieldname.startsWith("slides["),
  );

  const result = await ThemeService.createThemeService(
    req.body,
    previewFile,
    slideFiles,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Theme created successfully.",
    data: result,
  });
});

const getAllThemes = catchAsync(async (_req: Request, res: Response) => {
  const result = await ThemeService.getAllThemesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Themes retrieved successfully.",
    data: result,
  });
});

const getActiveThemes = catchAsync(async (_req: Request, res: Response) => {
  const result = await ThemeService.getActiveThemesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Active themes retrieved successfully.",
    data: result,
  });
});

const getThemeById = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.getThemeByIdService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theme retrieved successfully.",
    data: result,
  });
});

const getThemeBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.getThemeBySlugService(
    req.params.slug as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theme retrieved successfully.",
    data: result,
  });
});

const updateTheme = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files ?? []) as Express.Multer.File[];

  const previewFile = files.find((file) => file.fieldname === "preview");
  const slideFiles = files.filter((file) =>
    file.fieldname.startsWith("slides["),
  );

  const result = await ThemeService.updateThemeService(
    req.params.id as string,
    req.body,
    previewFile,
    slideFiles,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theme updated successfully.",
    data: result,
  });
});

const updateThemeStatus = catchAsync(async (req: Request, res: Response) => {
  const { isActive } = req.body;

  const result = await ThemeService.updateThemeStatusService(
    req.params.id as string,
    isActive,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Theme ${isActive ? "activated" : "deactivated"} successfully.`,
    data: result,
  });
});

const deleteTheme = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.deleteThemeService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theme deleted successfully.",
    data: result,
  });
});

export const ThemeController = {
  createTheme,
  getAllThemes,
  getActiveThemes,
  getThemeById,
  getThemeBySlug,
  updateTheme,
  updateThemeStatus,
  deleteTheme,
};
