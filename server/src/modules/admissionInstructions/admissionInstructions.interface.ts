import { Model, Types } from "mongoose";

export interface IAdmissionAttachment {
  name: string;
  url: string;
  publicId: string;
  resourceType: "image" | "raw" | "video";
  format?: string;
  size?: number;
}

export interface IAdmissionInstructionSection {
  title: string;
  content: string;
  attachment: IAdmissionAttachment[];
  order: number;
  isVisible: boolean;
}

export interface IAdmissionFAQ {
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

export interface IAdmissionInstructions {
  title: string;
  academicSession: string;
  introduction?: string;

  sections: IAdmissionInstructionSection[];
  faqs: IAdmissionFAQ[];
  attachments?: IAdmissionAttachment[];

  isPublished: boolean;
  publishedAt: Date;

  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdmissionInstructionsModel extends Model<IAdmissionInstructions> {}
