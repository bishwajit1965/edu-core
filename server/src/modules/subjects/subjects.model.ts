import { Schema, model } from "mongoose";
import { ISubject, SubjectModel } from "./subjects.interface.js";
import { SUBJECT_STATUS } from "./subjects.constant.js";

const subjectPaperSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    boardCode: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    papers: {
      type: [subjectPaperSchema],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SUBJECT_STATUS),
      default: SUBJECT_STATUS.ACTIVE,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const Subject = model<ISubject, SubjectModel>("Subject", subjectSchema);
