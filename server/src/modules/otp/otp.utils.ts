import crypto from "node:crypto";
import type { OtpPurpose } from "./otp.constant.js";

export const hashOTP = (otp: string): string => {
  const secret = process.env.OTP_HASH_SECRET;

  if (!secret) {
    throw new Error("OTP_HASH_SECRET is not configured.");
  }

  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
};

export const generateOTPRedisKey = (
  purpose: OtpPurpose,
  identity: string,
): string => {
  return `otp:${purpose}:${encodeURIComponent(identity)}`;
};

export const generateOTPCooldownKey = (
  purpose: OtpPurpose,
  identity: string,
): string => {
  return `otp:cooldown:${purpose}:${encodeURIComponent(identity)}`;
};

export const generateOTPAttemptsKey = (
  purpose: OtpPurpose,
  identity: string,
): string => {
  return `otp:attempts:${purpose}:${encodeURIComponent(identity)}`;
};
