import { Model } from "mongoose";
import type { MediaReference } from "../media/media.interface.js";
import {
  CLEARANCE_STATUS,
  STUDENT_ACADEMIC_STATE,
  STUDENT_ADMISSION_TYPE,
  STUDENT_STATUS,
} from "./students.constant.js";

export type TStudentAdmissionType =
  (typeof STUDENT_ADMISSION_TYPE)[keyof typeof STUDENT_ADMISSION_TYPE];

export type TStudentStatus =
  (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export type TClearanceStatus =
  (typeof CLEARANCE_STATUS)[keyof typeof CLEARANCE_STATUS];

export type TStudentAcademicState =
  (typeof STUDENT_ACADEMIC_STATE)[keyof typeof STUDENT_ACADEMIC_STATE];

export interface IStudentAcademicHistory {
  academicSession: string;
  className: string;
  group?: string;
  section?: string;
  rollNumber?: string;
  academicState: TStudentAcademicState;
  remarks?: string;
}

export interface IGuardian {
  _id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: MediaReference;
}

export interface ITCClearance {
  status: TClearanceStatus;
  verifiedBy: string;
  verifiedAt?: Date;
  remarks?: string;
}

export interface IPreviousInstitution {
  name: string;
  address: string;
  eiin?: string;
  previousClass?: string;
  previousRollNumber?: string;
}

export interface ITCDetails {
  number: string;
  issueDate: Date;
  previousInstitution: IPreviousInstitution;
}

export interface IStudent {
  studentId: string;
  name: string;
  dateOfBirth?: Date;
  gender?: string;
  photo?: MediaReference;
  studentEmail: string;
  birthRegistrationNumber: string;
  academicHistory: IStudentAcademicHistory[];

  fatherName?: string;
  fatherOccupation: string;
  fatherNationalId?: string;
  motherName?: string;
  motherOccupation?: string;
  yearlyFamilyIncome: number;
  guardians: IGuardian[];

  presentAddress?: string;
  permanentAddress?: string;

  admissionDate: Date;
  admissionType: TStudentAdmissionType;
  tcDetails?: ITCDetails;

  academicSession: string;
  className: string;
  group?: string;
  section?: string;
  rollNumber?: string;

  educationBoard?: string;
  boardRegistrationNumber?: string;
  registrationYear?: number;
  boardRollNumber?: string;

  duesClearance: ITCClearance;
  libraryClearance: ITCClearance;

  status: TStudentStatus;
  createdAt?: Date;
  updatedAt?: Date;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  deletionReason?: string;

  restoredAt: Date;
  restoredBy: string;
}

export interface StudentModel extends Model<IStudent> {}
