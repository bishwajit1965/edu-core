import { Schema, model } from "mongoose";

import { IStudent, StudentModel } from "./students.interface.js";

import {
  CLEARANCE_STATUS,
  STUDENT_ADMISSION_TYPE,
  STUDENT_STATUS,
} from "./students.constant.js";

const mediaReferenceSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const guardianSchema = new Schema({
  name: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  photo: { type: mediaReferenceSchema },
  address: { type: String, trim: true },
});

const previousInstitutionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    eiin: { type: String, trim: true },
    previousClass: { type: String, trim: true },
    previousRollNumber: { type: String, trim: true },
  },
  { _id: false },
);

const tcDetailsSchema = new Schema(
  {
    number: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    previousInstitution: {
      type: previousInstitutionSchema,
      required: true,
    },
  },
  { _id: false },
);

const clearanceSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(CLEARANCE_STATUS),
      default: CLEARANCE_STATUS.NOT_APPLICABLE,
      required: true,
    },
    verifiedBy: { type: String, trim: true, default: "Head Clerk" },
    verifiedAt: { type: Date },
    remarks: { type: String, trim: true },
  },
  { _id: false },
);

const studentSchema = new Schema<IStudent, StudentModel>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, trim: true },
    photo: { type: mediaReferenceSchema },

    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    yearlyFamilyIncome: { type: Number, min: 0 },

    guardians: { type: [guardianSchema], default: [] },

    presentAddress: { type: String, trim: true },
    permanentAddress: { type: String, trim: true },

    admissionDate: { type: Date, required: true },
    admissionType: {
      type: String,
      enum: Object.values(STUDENT_ADMISSION_TYPE),
      required: true,
    },
    tcDetails: { type: tcDetailsSchema },

    academicSession: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    group: { type: String, trim: true },
    section: { type: String, trim: true },
    rollNumber: { type: String, trim: true },

    educationBoard: { type: String, trim: true },
    boardRegistrationNumber: { type: String, trim: true },
    registrationYear: { type: Number, min: 1900 },
    boardRollNumber: { type: String, trim: true },

    duesClearance: {
      type: clearanceSchema,
      default: () => ({}),
      required: true,
    },
    libraryClearance: {
      type: clearanceSchema,
      default: () => ({}),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(STUDENT_STATUS),
      default: STUDENT_STATUS.ACTIVE,
      required: true,
    },
  },
  { timestamps: true },
);

export const Student = model<IStudent, StudentModel>("Student", studentSchema);
