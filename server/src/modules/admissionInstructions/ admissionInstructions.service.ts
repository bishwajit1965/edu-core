import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { AdmissionInstructions } from "./admissionInstructions.model.js";

const createAdmissionInstructionsService = async (
  payload: {
    title: string;
    academicSession: string;
    introduction?: string;
    sections?: object[];
    faqs?: object[];
    attachments?: object[];
  },
  userId?: string,
) => {
  const existingInstructions = await AdmissionInstructions.findOne({
    academicSession: payload.academicSession.trim(),
    isDeleted: false,
  });

  if (existingInstructions) {
    throw new AppError(
      409,
      "Admission instructions already exist for this academic session",
    );
  }

  const instructions = await AdmissionInstructions.create({
    ...payload,
    academicSession: payload.academicSession.trim(),
    ...(userId ? { createdBy: userId } : {}),
  });

  return instructions;
};

const getAllAdmissionInstructionsService = async () => {
  const instructions = await AdmissionInstructions.find({
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return instructions;
};

const getAdmissionInstructionsByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const instructions = await AdmissionInstructions.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!instructions) {
    throw new AppError(404, "Admission instructions not found");
  }

  return instructions;
};

// Public service
const getPublicAdmissionInstructionsService = async (
  academicSession: string,
) => {
  const instructions = await AdmissionInstructions.findOne({
    academicSession: academicSession.trim(),
    isPublished: true,
    isDeleted: false,
  }).lean();

  if (!instructions) {
    throw new AppError(404, "Admission instructions not found");
  }

  // Return only publicly required information
  return {
    _id: instructions._id,
    title: instructions.title,
    academicSession: instructions.academicSession,
    introduction: instructions.introduction,

    sections: instructions.sections
      .filter((section) => section.isVisible)
      .sort((a, b) => a.order - b.order),

    faqs: instructions.faqs
      .filter((faq) => faq.isVisible)
      .sort((a, b) => a.order - b.order),

    attachments: instructions.attachments,

    publishedAt: instructions.publishedAt,
  };
};

const updateAdmissionInstructionsService = async (
  id: string,
  payload: {
    title?: string;
    academicSession?: string;
    introduction?: string;
    sections?: object[];
    faqs?: object[];
    attachments?: object[];
  },
  userId?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid admission instructions id");
  }

  if (payload.academicSession) {
    const existingInstructions = await AdmissionInstructions.findOne({
      academicSession: payload.academicSession.trim(),
      _id: { $ne: id },
      isDeleted: false,
    });

    if (existingInstructions) {
      throw new AppError(
        409,
        "Admission instructions already exist for this academic session",
      );
    }
  }

  const instructions = await AdmissionInstructions.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      ...payload,
      ...(payload.academicSession && {
        academicSession: payload.academicSession.trim(),
      }),
      updatedBy: userId,
    },
    { new: true, runValidators: true },
  );

  if (!instructions) {
    throw new AppError(404, "Admission instructions not found");
  }

  return instructions;
};

const updateAdmissionInstructionsStatusService = async (
  id: string,
  isPublished: boolean,
  userId?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const instructions = await AdmissionInstructions.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      updatedBy: userId,
    },
    { new: true, runValidators: true },
  );

  if (!instructions) {
    throw new AppError(404, "Admission instructions not found");
  }

  return instructions;
};

const softDeleteAdmissionInstructionsService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const instructions = await AdmissionInstructions.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isPublished: false },
    { new: true, runValidators: true },
  );

  if (!instructions) {
    throw new AppError(404, "Admission instructions not found");
  }

  return instructions;
};

// Revoke soft-delete OR restore
const restoreAdmissionInstructionsService = async (
  id: string,
  userId?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid admission instructions id");
  }

  const instructions = await AdmissionInstructions.findOneAndUpdate(
    { _id: id, isDeleted: true },
    {
      isDeleted: false,
      isPublished: false,
      publishedAt: null,
      updatedBy: userId,
    },
    { new: true, runValidators: true },
  );

  if (!instructions) {
    throw new AppError(404, "Deleted admission instructions not found");
  }

  return instructions;
};

export const AdmissionInstructionsService = {
  createAdmissionInstructionsService,
  getAllAdmissionInstructionsService,
  getAdmissionInstructionsByIdService,
  getPublicAdmissionInstructionsService,
  updateAdmissionInstructionsService,
  updateAdmissionInstructionsStatusService,
  softDeleteAdmissionInstructionsService,
  restoreAdmissionInstructionsService,
};
