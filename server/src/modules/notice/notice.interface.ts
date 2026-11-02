import { Model } from "mongoose";
import type { MediaReference } from "../media/media.interface.js";
import {
  NOTICE_AUDIENCE,
  NOTICE_CATEGORY,
  NOTICE_STATUS,
} from "./notice.constant.js";

export type TNoticeAudience =
  (typeof NOTICE_AUDIENCE)[keyof typeof NOTICE_AUDIENCE];

export type TNoticeCategory =
  (typeof NOTICE_CATEGORY)[keyof typeof NOTICE_CATEGORY];

export type TNoticeStatus = (typeof NOTICE_STATUS)[keyof typeof NOTICE_STATUS];

export interface INoticeTarget {
  academicSession?: string;
  className?: string;
  group?: string;
  section?: string;
}

export interface INotice {
  title: string;
  content: string;

  category: TNoticeCategory;
  audience: TNoticeAudience;
  target?: INoticeTarget;
  attachments: MediaReference[];

  status: TNoticeStatus;

  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  updatedBy?: string;
  rejectionReason?: string;

  publishedAt?: Date;
  expiresAt?: Date;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  deletionReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
  withdrawnAt?: Date;
  withdrawnBy?: string;
  withdrawalReason?: string;
}

export interface NoticeModel extends Model<INotice> {}
