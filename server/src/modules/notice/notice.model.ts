import { Schema, model } from "mongoose";
import { INotice, NoticeModel } from "./notice.interface.js";
import {
  NOTICE_AUDIENCE,
  NOTICE_CATEGORY,
  NOTICE_STATUS,
} from "./notice.constant.js";

const noticeTargetSchema = new Schema(
  {
    academicSession: { type: String, trim: true },
    className: { type: String, trim: true },
    group: { type: String, trim: true },
    section: { type: String, trim: true },
  },
  { _id: false },
);

const attachmentSchema = new Schema<
  NonNullable<INotice["attachments"]>[number]
>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "raw", "video"],
      required: true,
    },
    format: {
      type: String,
    },
    bytes: {
      type: Number,
    },
  },
  { _id: false },
);

const noticeSchema = new Schema<INotice, NoticeModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: {
      type: [attachmentSchema] as any,
      default: [],
    },

    category: {
      type: String,
      enum: Object.values(NOTICE_CATEGORY),
      default: NOTICE_CATEGORY.GENERAL,
      required: true,
    },
    audience: {
      type: String,
      enum: Object.values(NOTICE_AUDIENCE),
      required: true,
    },
    target: {
      type: noticeTargetSchema,
    },

    status: {
      type: String,
      enum: Object.values(NOTICE_STATUS),
      default: NOTICE_STATUS.DRAFT,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      required: true,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      trim: true,
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      trim: true,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      trim: true,
    },
    deletionReason: {
      type: String,
      trim: true,
    },
    withdrawnAt: {
      type: Date,
    },
    withdrawnBy: {
      type: Schema.Types.ObjectId as any,
      ref: "User",
      trim: true,
    },
    withdrawalReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

noticeSchema.index({ audience: 1, status: 1, publishedAt: -1 });
noticeSchema.index({ category: 1, status: 1 });
noticeSchema.index({ expiresAt: 1 });

export const Notice = model<INotice, NoticeModel>("Notice", noticeSchema);
