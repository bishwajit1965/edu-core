import { Schema, model } from "mongoose";
import {
  IAdmissionInstructions,
  AdmissionInstructionsModel,
} from "./admissionInstructions.interface.js";

const attachmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "raw", "video"],
      required: true,
    },
    format: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
  { _id: false },
);

const instructionSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const admissionInstructionsSchema = new Schema<
  IAdmissionInstructions,
  AdmissionInstructionsModel
>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    academicSession: {
      type: String,
      required: true,
      trim: true,
    },
    introduction: {
      type: String,
      default: "",
    },
    sections: {
      type: [instructionSectionSchema],
      default: [],
    },
    faqs: {
      type: [faqSchema],
      default: [],
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

admissionInstructionsSchema.index({ academicSession: 1, isDeleted: 1 });

export const AdmissionInstructions = model<
  IAdmissionInstructions,
  AdmissionInstructionsModel
>("AdmissionInstructions", admissionInstructionsSchema);
