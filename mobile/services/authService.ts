/**
 * @file authService.ts
 * @description Authentication services for the mobile app.
 * Handles Login, Registration, Password Reset, and Token Storage management.
 */

import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Log in a user.
 * Stores the JWT token in AsyncStorage upon success.
 * @param payload - { emailOrPhone, password }
 */
export const login = async (payload: any) => {
  const res = await api.post("/auth/login", payload);

  // Save token automatically
  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
    console.log("TOKEN STORED ===>", res.data.token);
  } else {
    console.log("NO TOKEN RETURNED FROM BACKEND");
  }

  return res.data;
};

/**
 * Register a new user.
 * Stores the JWT token in AsyncStorage upon success.
 * @param payload - Registration fields (firstName, lastName, etc.)
 */
export const register = async (payload: any) => {
  const res = await api.post("/auth/register", payload);

  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
  }

  return res.data;
};

/**
 * Logout user.
 * Removes the JWT token from storage.
 */
export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

/**
 * Request OTP for Password Reset.
 * @param primaryContact - User's registered phone number.
 */
export const requestPasswordResetOtp = async (primaryContact: string) => {
  const res = await api.post("/auth/forgot-password-otp", { primaryContact });
  return res.data;
};

/**
 * Verify OTP and Reset Password.
 * @param payload - { primaryContact, otp, newPassword }
 */
export const resetPasswordWithOtp = async (payload: any) => {
  const res = await api.post("/auth/reset-password-otp", payload);
  return res.data;
};
