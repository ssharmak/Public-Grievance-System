/**
 * @file grievanceService.ts
 * @description API service for Grievance operations.
 * Handles submission (multipart/form-data for files), fetching lists, and details.
 */

import api from "./api";

/**
 * Submit a new Grievance.
 * Uses Multipart File Upload to handle images/PDFs.
 * @param formData - FormData object containing fields + file blobs
 */
export const submitGrievance = async (formData: FormData) => {
  const res = await api.post("/grievances", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data, headers) => {
      return data; // Prevent Axios from stringifying FormData automatically
    },
  });
  return res.data;
};

/**
 * fetch my grievances history.
 */
export const getMyGrievances = async () => {
  const res = await api.get("/grievances/me");
  return res.data;
};

/**
 * Fetch a single grievance detail.
 * @param grievanceId - public ID or _id
 */
export const getGrievance = async (grievanceId: string) => {
  const res = await api.get(`/grievances/${grievanceId}`);
  return res.data;
};

/**
 * Fetch available grievance categories.
 */
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};
