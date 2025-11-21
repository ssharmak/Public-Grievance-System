// mobile/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyProfile, updateMyProfile } from "../services/userService";
import { logout } from "../services/authService";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      console.log("📌 Attempting to load profile...");
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      console.log("🔐 token (stored):", !!token);

      const data = await getMyProfile();
      console.log("📥 PROFILE DATA:", data);
      setUser(data);
    } catch (err: any) {
      console.log(
        "❌ PROFILE ERROR:",
        err?.response?.data || err.message || err
      );
      // If unauthorized, force logout and navigate to Login
      const status = err?.response?.status;
      if (status === 401) {
        Alert.alert("Session expired", "Please login again.", [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            },
          },
        ]);
        return;
      }
      Alert.alert("Error", "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load on mount
    loadProfile();
    // also reload when screen focused (optionally)
    const unsub = navigation.addListener("focus", () => loadProfile());
    return unsub;
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      const payload: any = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender: user.gender,
        dob: user.dob,
        primaryContact: user.primaryContact,
        secondaryContact: user.secondaryContact,
        email: user.email,
        address: user.address || {},
      };
      const updated = await updateMyProfile(payload);
      console.log("Profile updated:", updated);
      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (err: any) {
      console.log("Update error:", err?.response?.data || err.message || err);
      Alert.alert("Error", err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingBox}>
        <Text>No profile available.</Text>
        <Button
          mode="contained"
          onPress={loadProfile}
          style={{ marginTop: 12 }}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Profile" />
      </Appbar.Header>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.headerSubtitle}>{user.email}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text style={styles.sectionTitle}>Personal Details</Text>

              <TextInput
                label="First Name"
                mode="outlined"
                style={styles.input}
                value={user.firstName || ""}
                onChangeText={(v) => setUser({ ...user, firstName: v })}
              />

              <TextInput
                label="Middle Name"
                mode="outlined"
                style={styles.input}
                value={user.middleName || ""}
                onChangeText={(v) => setUser({ ...user, middleName: v })}
              />

              <TextInput
                label="Last Name"
                mode="outlined"
                style={styles.input}
                value={user.lastName || ""}
                onChangeText={(v) => setUser({ ...user, lastName: v })}
              />

              <Text style={styles.sectionTitle}>Contact Details</Text>

              <TextInput
                label="Primary Contact"
                mode="outlined"
                style={styles.input}
                value={user.primaryContact || ""}
                keyboardType="phone-pad"
                onChangeText={(v) => setUser({ ...user, primaryContact: v })}
              />

              <TextInput
                label="Secondary Contact"
                mode="outlined"
                style={styles.input}
                value={user.secondaryContact || ""}
                keyboardType="phone-pad"
                onChangeText={(v) => setUser({ ...user, secondaryContact: v })}
              />

              <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                value={user.email || ""}
                keyboardType="email-address"
                onChangeText={(v) => setUser({ ...user, email: v })}
              />

              <Text style={styles.sectionTitle}>Address</Text>

              <TextInput
                label="House Name/Number"
                mode="outlined"
                style={styles.input}
                value={user.address?.houseNameOrNumber || ""}
                onChangeText={(v) =>
                  setUser({
                    ...user,
                    address: { ...(user.address || {}), houseNameOrNumber: v },
                  })
                }
              />

              <TextInput
                label="Locality"
                mode="outlined"
                style={styles.input}
                value={user.address?.locality || ""}
                onChangeText={(v) =>
                  setUser({
                    ...user,
                    address: { ...(user.address || {}), locality: v },
                  })
                }
              />

              <TextInput
                label="District"
                mode="outlined"
                style={styles.input}
                value={user.address?.district || ""}
                onChangeText={(v) =>
                  setUser({
                    ...user,
                    address: { ...(user.address || {}), district: v },
                  })
                }
              />

              <TextInput
                label="State"
                mode="outlined"
                style={styles.input}
                value={user.address?.state || ""}
                onChangeText={(v) =>
                  setUser({
                    ...user,
                    address: { ...(user.address || {}), state: v },
                  })
                }
              />

              <TextInput
                label="Pincode"
                mode="outlined"
                style={styles.input}
                value={user.address?.pincode || ""}
                keyboardType="numeric"
                onChangeText={(v) =>
                  setUser({
                    ...user,
                    address: { ...(user.address || {}), pincode: v },
                  })
                }
              />

              <Button
                mode="contained"
                style={styles.saveButton}
                onPress={save}
                loading={loading}
              >
                Save Changes
              </Button>

              <Button
                mode="outlined"
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                Logout
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  headerContainer: {
    backgroundColor: "#1E88E5",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#E3F2FD", marginTop: 4 },
  formContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#444",
  },
  card: { borderRadius: 18, padding: 5 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  saveButton: { marginTop: 15, paddingVertical: 6, borderRadius: 10 },
  logoutButton: { marginTop: 12, borderRadius: 10, paddingVertical: 6 },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
});
