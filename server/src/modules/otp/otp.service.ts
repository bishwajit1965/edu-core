import { timingSafeEqual } from "crypto";
import { redisClient } from "../../database/redis.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendOTPEmail } from "../../utils/sendOTPEmail.js";
import { OTP_CONFIG, OtpPurpose } from "./otp.constant.js";
import type { IGenerateOTP, IVerifyOTP, IOTPResult } from "./otp.interface.js";

import {
  hashOTP,
  generateOTPRedisKey,
  generateOTPCooldownKey,
  generateOTPAttemptsKey,
} from "./otp.utils.js";

const getAttemptsKey = (purpose: string, identity: string) =>
  `otp:attempts:${purpose}:${encodeURIComponent(identity)}`;

// Generate and send OTP
export const sendPurposeOTP = async ({
  purpose,
  identity,
  email,
}: IGenerateOTP): Promise<IOTPResult> => {
  const otpKey = generateOTPRedisKey(purpose, identity);
  const cooldownKey = generateOTPCooldownKey(purpose, identity);
  const attemptsKey = generateOTPAttemptsKey(purpose, identity);

  // Prevent repeated OTP requests
  const cooldown = await redisClient.set(cooldownKey, "1", {
    EX: OTP_CONFIG.RESEND_COOLDOWN,
    NX: true,
  });

  if (!cooldown) {
    return {
      success: false,
      message: "Please wait before requesting another OTP.",
    };
  }

  try {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    await redisClient.set(otpKey, hashedOTP, {
      EX: OTP_CONFIG.EXPIRES_IN,
    });

    await redisClient.del(attemptsKey);

    await sendOTPEmail(email, otp);

    return {
      success: true,
      message: "OTP sent successfully.",
    };
  } catch (error) {
    await redisClient.del(otpKey);
    await redisClient.del(cooldownKey);
    await redisClient.del(attemptsKey);

    throw error;
  }
};

// Verify OTP
export const verifyPurposeOTP = async ({
  purpose,
  identity,
  otp,
}: IVerifyOTP): Promise<IOTPResult> => {
  const otpKey = generateOTPRedisKey(purpose, identity);
  const cooldownKey = generateOTPCooldownKey(purpose, identity);
  const attemptsKey = generateOTPAttemptsKey(purpose, identity);

  const storedHash = await redisClient.get(otpKey);

  if (!storedHash) {
    return {
      success: false,
      message: "OTP is invalid or expired.",
    };
  }

  const currentAttempts = Number((await redisClient.get(attemptsKey)) || 0);

  if (currentAttempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    return {
      success: false,
      message: "Maximum OTP attempts exceeded. Please request a new OTP.",
    };
  }

  const submittedHash = hashOTP(otp);

  // Compare hashes safely
  const storedBuffer = Buffer.from(storedHash, "hex");
  const submittedBuffer = Buffer.from(submittedHash, "hex");

  const isValid =
    storedBuffer.length === submittedBuffer.length &&
    timingSafeEqual(storedBuffer, submittedBuffer);

  if (!isValid) {
    const attempts = await redisClient.incr(attemptsKey);

    if (attempts === 1) {
      await redisClient.expire(attemptsKey, OTP_CONFIG.EXPIRES_IN);
    }

    if (attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      await redisClient.del(otpKey);
      await redisClient.del(attemptsKey);

      return {
        success: false,
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      };
    }

    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  // Successful verification
  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);
  await redisClient.del(cooldownKey);

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};

// Invalidate OTP manually
export const invalidatePurposeOTP = async (
  purpose: OtpPurpose,
  identity: string,
): Promise<void> => {
  const otpKey = generateOTPRedisKey(purpose, identity);
  const cooldownKey = generateOTPCooldownKey(purpose, identity);
  const attemptsKey = generateOTPAttemptsKey(purpose, identity);

  await redisClient.del(otpKey);
  await redisClient.del(cooldownKey);
  await redisClient.del(attemptsKey);
};
