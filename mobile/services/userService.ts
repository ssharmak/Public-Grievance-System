import api from "./api";

export const getMyProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateMyProfile = async (payload: any) => {
  const res = await api.patch("/profile/me", payload);
  return res.data;
};
