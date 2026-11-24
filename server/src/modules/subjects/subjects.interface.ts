import { Model } from "mongoose";
import { SUBJECT_STATUS } from "./subjects.constant.js";

export type TSubjectStatus =
  (typeof SUBJECT_STATUS)[keyof typeof SUBJECT_STATUS];

export interface ISubjectPaper {
  name: string;
  boardCode?: string;
}

export interface ISubject {
  name: string;
  code: string;
  description?: string;
  papers: ISubjectPaper[];
  status: TSubjectStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectModel extends Model<ISubject> {}
