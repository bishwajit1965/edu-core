import { Model, Types } from "mongoose";

export type SubjectType =
  | "COMPULSORY"
  | "GROUP_MANDATORY"
  | "REQUIRED_SELECTION"
  | "CHOICE";

export interface IConfiguredSubject {
  subject: Types.ObjectId;
  subjectType: SubjectType;
  isMainSubjectEligible: boolean;
  isFourthSubjectEligible: boolean;
  selectionGroup?: string;
}

export interface ISubjectSelectionGroup {
  code: string;
  label: string;
  minSelections: number;
  maxSelections: number;
}

export interface ISubjectConfiguration {
  programme: string;
  academicSession: string;
  className: string;
  group?: string;
  subjects: IConfiguredSubject[];
  selectionGroups: ISubjectSelectionGroup[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectConfigurationModel extends Model<ISubjectConfiguration> {}
