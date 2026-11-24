import AppError from "../../errors/AppError.js";
import { Subject } from "./subjects.model.js";
import { ISubject } from "./subjects.interface.js";

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
const createSubjectService = async (payload: ISubject) => {
  const existingSubject = await Subject.findOne({
    code: payload.code,
    isDeleted: false,
  });

  if (existingSubject) {
    throw new AppError(httpStatus.CONFLICT, "Subject code already exists");
  }

  return await Subject.create(payload);
};

// Get All Subjects
const getAllSubjectsService = async () => {
  return await Subject.find({ isDeleted: false }).sort({ name: 1 });
};

// Get Single Subject
const getSingleSubjectService = async (id: string) => {
  const subject = await Subject.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject not found");
  }

  return subject;
};

// Update Subject
const updateSubjectService = async (id: string, payload: Partial<ISubject>) => {
  const subject = await Subject.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject not found");
  }

  if (payload.code && payload.code !== subject.code) {
    const existingSubject = await Subject.findOne({
      code: payload.code,
      isDeleted: false,
      _id: { $ne: id },
    });

    if (existingSubject) {
      throw new AppError(httpStatus.CONFLICT, "Subject code already exists");
    }
  }

  Object.assign(subject, payload);
  await subject.save();

  return subject;
};

// Soft Delete Subject
const deleteSubjectService = async (id: string) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject not found");
  }

  return subject;
};

export const SubjectServices = {
  createSubjectService,
  getAllSubjectsService,
  getSingleSubjectService,
  updateSubjectService,
  deleteSubjectService,
};
