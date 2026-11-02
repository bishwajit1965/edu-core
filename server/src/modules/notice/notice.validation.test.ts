import { describe, expect, it } from "vitest";
import {
  createNoticeValidationSchema,
  updateNoticeValidationSchema,
  noticeIdValidationSchema,
} from "./notice.validation.js";
import { NOTICE_AUDIENCE, NOTICE_CATEGORY } from "./notice.constant.js";

describe("Notice validation", () => {
  describe("Create notice", () => {
    const validNotice = {
      title: "Annual Sports Day",
      content: "The annual sports day will be held next Monday.",
      audience: NOTICE_AUDIENCE.GENERAL,
    };

    it("should accept a valid notice", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: validNotice,
      });

      expect(result.success).toBe(true);
    });

    it("should apply default category and attachments", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: validNotice,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.body.category).toBe(NOTICE_CATEGORY.GENERAL);
        expect(result.data.body.attachments).toEqual([]);
      }
    });

    it("should reject a title shorter than three characters", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: {
          ...validNotice,
          title: "AB",
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject a class notice without its required target", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: {
          ...validNotice,
          audience: NOTICE_AUDIENCE.CLASS,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should accept a class notice with its required target", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: {
          ...validNotice,
          audience: NOTICE_AUDIENCE.CLASS,
          target: {
            academicSession: "2026",
            className: "Class 10",
          },
        },
      });

      expect(result.success).toBe(true);
    });

    it("should reject an invalid attachment URL", () => {
      const result = createNoticeValidationSchema.safeParse({
        body: {
          ...validNotice,
          attachments: [
            {
              url: "not-a-valid-url",
              publicId: "notice/file-123",
            },
          ],
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Update notice", () => {
    const validId = "507f1f77bcf86cd799439011";

    it("should accept a valid partial update", () => {
      const result = updateNoticeValidationSchema.safeParse({
        params: { id: validId },
        body: { title: "Updated Notice Title" },
      });

      expect(result.success).toBe(true);
    });

    it("should reject an empty update body", () => {
      const result = updateNoticeValidationSchema.safeParse({
        params: { id: validId },
        body: {},
      });

      expect(result.success).toBe(false);
    });

    it("should reject an invalid notice ID", () => {
      const result = updateNoticeValidationSchema.safeParse({
        params: { id: "invalid-id" },
        body: { title: "Updated Notice Title" },
      });

      expect(result.success).toBe(false);
    });

    it("should reject fields that are not allowed in an update", () => {
      const result = updateNoticeValidationSchema.safeParse({
        params: { id: validId },
        body: { status: "PUBLISHED" },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Notice ID validation", () => {
    it("should accept a valid MongoDB ObjectId", () => {
      const result = noticeIdValidationSchema.safeParse({
        params: { id: "507f1f77bcf86cd799439011" },
      });

      expect(result.success).toBe(true);
    });

    it("should reject an invalid MongoDB ObjectId", () => {
      const result = noticeIdValidationSchema.safeParse({
        params: { id: "12345" },
      });

      expect(result.success).toBe(false);
    });
  });
});
