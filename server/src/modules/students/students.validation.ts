import { z } from "zod";

import {
  CLEARANCE_STATUS,
  STUDENT_ADMISSION_TYPE,
  STUDENT_STATUS,
} from "./students.constant.js";

const mediaReferenceSchema = z.object({
  url: z.string().trim().url(),
  publicId: z.string().trim().min(1),
});

const guardianSchema = z.object({
  name: z.string().trim().min(1).max(200),
  relationship: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  photo: mediaReferenceSchema.optional(),
  address: z.string().trim().optional(),
});

const previousInstitutionSchema = z.object({
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  eiin: z.string().trim().optional(),
  previousClass: z.string().trim().optional(),
  previousRollNumber: z.string().trim().optional(),
});

const tcDetailsSchema = z.object({
  number: z.string().trim().min(1),
  issueDate: z.coerce.date(),
  previousInstitution: previousInstitutionSchema,
});

const clearanceSchema = z.object({
  status: z.enum(Object.values(CLEARANCE_STATUS) as [string, ...string[]]),
  verifiedBy: z.string().trim().optional(),
  verifiedAt: z.coerce.date().optional(),
  remarks: z.string().trim().optional(),
});

const studentBaseSchema = z.object({
  name: z.string().trim().min(1).max(200),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().trim().optional(),
  photo: mediaReferenceSchema.optional(),
  fatherName: z.string().trim().optional(),
  motherName: z.string().trim().optional(),
  fatherOccupation: z.string().trim().optional(),
  yearlyFamilyIncome: z.coerce.number().min(0).optional(),
  guardians: z.array(guardianSchema).min(1),
  presentAddress: z.string().trim().optional(),
  permanentAddress: z.string().trim().optional(),
  admissionDate: z.coerce.date(),
  admissionType: z.enum(
    Object.values(STUDENT_ADMISSION_TYPE) as [string, ...string[]],
  ),
  tcDetails: tcDetailsSchema.optional(),
  academicSession: z.string().trim().min(1),
  className: z.string().trim().min(1),
  group: z.string().trim().optional(),
  section: z.string().trim().optional(),
  rollNumber: z.string().trim().optional(),
  educationBoard: z.string().trim().optional(),
  boardRegistrationNumber: z.string().trim().optional(),
  registrationYear: z.number().int().min(1900).optional(),
  boardRollNumber: z.string().trim().optional(),
  duesClearance: clearanceSchema.optional(),
  libraryClearance: clearanceSchema.optional(),
  status: z
    .enum(Object.values(STUDENT_STATUS) as [string, ...string[]])
    .optional(),
});

const studentSchema = studentBaseSchema.superRefine((student, ctx) => {
  if (
    student.admissionType === STUDENT_ADMISSION_TYPE.TC &&
    !student.tcDetails
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["tcDetails"],
      message: "TC details are required for TC admission.",
    });
  }

  if (
    student.admissionType === STUDENT_ADMISSION_TYPE.REGULAR &&
    student.tcDetails
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["tcDetails"],
      message: "TC details are only allowed for TC admission.",
    });
  }
});

export const createStudentValidationSchema = z.object({
  body: studentSchema,
});

export const updateStudentValidationSchema = z.object({
  body: studentBaseSchema
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one student field must be provided.",
    }),
});
