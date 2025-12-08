/**
 * @file userService.ts
 * @description API service for User Profile management.
 * Handles Profile fetching/updating and Phone Verification via OTP.
 */

import api from "./api";

/**
 * Get current logged-in user's profile.
 */
export const getMyProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

/**
 * Update user profile details.
 * @param payload - subset of allowed fields (contact, address, etc.)
 */
export const updateMyProfile = async (payload: any) => {
  const res = await api.patch("/profile/me", payload);
  return res.data;
};

/**
 * Trigger OTP sending for Phone Verification.
 */
export const sendPhoneVerificationOtp = async () => {
  const res = await api.post("/profile/verify-phone/send");
  return res.data;
};

/**
 * Confirm OTP to verify phone number.
 * @param otp - One Time Password
 */
export const verifyPhoneOtp = async (otp: string) => {
  const res = await api.post("/profile/verify-phone/verify", { otp });
  return res.data;
};
