import { Model } from "mongoose";
import type { MediaReference } from "../media/media.interface.js";
import {
  CLEARANCE_STATUS,
  STUDENT_ADMISSION_TYPE,
  STUDENT_STATUS,
} from "./students.constant.js";

export type TStudentAdmissionType =
  (typeof STUDENT_ADMISSION_TYPE)[keyof typeof STUDENT_ADMISSION_TYPE];

export type TStudentStatus =
  (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export type TClearanceStatus =
  (typeof CLEARANCE_STATUS)[keyof typeof CLEARANCE_STATUS];

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

  fatherName?: string;
  motherName?: string;
  fatherOccupation: string;
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
}

export interface StudentModel extends Model<IStudent> {}
