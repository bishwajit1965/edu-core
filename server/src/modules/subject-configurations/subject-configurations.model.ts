import { Schema, model } from "mongoose";
import {
  ISubjectConfiguration,
  SubjectConfigurationModel,
} from "./subject-configurations.interface.js";

const configuredSubjectSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subjectType: {
      type: String,
      enum: ["COMPULSORY", "GROUP_MANDATORY", "REQUIRED_SELECTION", "CHOICE"],
      required: true,
    },
    isMainSubjectEligible: {
      type: Boolean,
      default: false,
    },
    isFourthSubjectEligible: {
      type: Boolean,
      default: false,
    },
    selectionGroup: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { _id: false },
);

const selectionGroupSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    minSelections: {
      type: Number,
      required: true,
      min: 0,
    },
    maxSelections: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const subjectConfigurationSchema = new Schema<
  ISubjectConfiguration,
  SubjectConfigurationModel
>(
  {
    programme: {
      type: String,
      required: true,
      trim: true,
    },
    academicSession: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      trim: true,
      default: "",
    },
    subjects: {
      type: [configuredSubjectSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: "At least one subject is required",
      },
    },
    selectionGroups: {
      type: [selectionGroupSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

subjectConfigurationSchema.index(
  {
    programme: 1,
    academicSession: 1,
    className: 1,
    group: 1,
  },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  },
);

export const SubjectConfiguration = model<
  ISubjectConfiguration,
  SubjectConfigurationModel
>("SubjectConfiguration", subjectConfigurationSchema);
