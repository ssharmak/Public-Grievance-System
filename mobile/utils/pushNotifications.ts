import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 * @returns Expo push token or null if registration failed
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    // Check if running on physical device
    if (!Device.isDevice) {
      console.warn("Push notifications only work on physical devices");
      return null;
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permission for push notifications not granted");
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "your-expo-project-id", // Replace with your Expo project ID from app.json
    });

    // Android specific channel setup
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#1E88E5",
      });
    }

    return tokenData.data;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
}

/**
 * Setup notification listeners
 * @param onNotificationReceived - Callback when notification is received while app is open
 * @param onNotificationTapped - Callback when user taps on notification
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  // Listener for when notification is received while app is in foreground
  const receivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📬 Notification received:", notification);
      onNotificationReceived?.(notification);
    }
  );

  // Listener for when user taps on notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("👆 Notification tapped:", response);
      onNotificationTapped?.(response);
    }
  );

  // Return cleanup function
  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}
