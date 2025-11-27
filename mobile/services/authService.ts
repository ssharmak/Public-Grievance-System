import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (payload: any) => {
  const res = await api.post("/auth/login", payload);

  // Save token
  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
    console.log("TOKEN STORED ===>", res.data.token);
  } else {
    console.log("NO TOKEN RETURNED FROM BACKEND");
  }

  return res.data;
};

export const register = async (payload: any) => {
  const res = await api.post("/auth/register", payload);

  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const requestPasswordResetOtp = async (primaryContact: string) => {
  const res = await api.post("/auth/forgot-password-otp", { primaryContact });
  return res.data;
};

export const resetPasswordWithOtp = async (payload: any) => {
  const res = await api.post("/auth/reset-password-otp", payload);
  return res.data;
};
