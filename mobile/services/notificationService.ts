import api from "./api";

/**
 * Register push token with backend
 */
export const registerPushToken = async (pushToken: string) => {
  try {
    const res = await api.post("/notifications/register-token", { pushToken });
    return res.data;
  } catch (error) {
    console.error("Failed to register push token:", error);
    throw error;
  }
};

/**
 * Unregister push token (on logout)
 */
export const unregisterPushToken = async () => {
  try {
    const res = await api.post("/notifications/unregister-token");
    return res.data;
  } catch (error) {
    console.error("Failed to unregister push token:", error);
    throw error;
  }
};
