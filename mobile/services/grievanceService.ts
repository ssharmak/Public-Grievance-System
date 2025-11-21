import api from "./api";

export const submitGrievance = async (payload: any) => {
  const res = await api.post("/grievances", payload);
  return res.data;
};

export const getMyGrievances = async () => {
  const res = await api.get("/grievances/my"); // ✔ FIXED
  return res.data;
};

export const getGrievance = async (grievanceId: string) => {
  const res = await api.get(`/grievances/${grievanceId}`); // ✔ Correct
  return res.data;
};
