import api from "./api";

export const submitGrievance = async (formData: FormData) => {
  const res = await api.post("/grievances", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data, headers) => {
      return data; // Prevent Axios from stringifying FormData
    },
  });
  return res.data;
};

export const getMyGrievances = async () => {
  const res = await api.get("/grievances/me");
  return res.data;
};

export const getGrievance = async (grievanceId: string) => {
  const res = await api.get(`/grievances/${grievanceId}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};
