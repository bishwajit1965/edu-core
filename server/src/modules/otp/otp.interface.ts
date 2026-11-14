import { OtpPurpose } from "./otp.constant.js";

export interface IGenerateOTP {
  purpose: OtpPurpose;
  identity: string;
  email: string;
}

export interface IVerifyOTP {
  purpose: OtpPurpose;
  identity: string;
  otp: string;
}

export interface IOTPRecord {
  hashedOTP: string;
  attempts: number;
}

export interface IOTPResult {
  success: boolean;
  message: string;
}
