/**
 * @file ProfileScreen.tsx
 * @description User Profile Management Screen.
 * Allows users to view and update personal details, contact info, and address.
 * Includes functionality for Phone Number Verification via OTP.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  ActivityIndicator,
  Avatar,
  Chip,
  Divider,
  Portal,
  Modal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  getMyProfile,
  updateMyProfile,
  sendPhoneVerificationOtp,
  verifyPhoneOtp,
} from "../services/userService";
import { logout } from "../services/authService";

const PRIMARY = "#1E88E5";
const CHIP_ACTIVE = "#E3F2FD";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Verification State
  const [verifying, setVerifying] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Token Available:", !!token);

      const data = await getMyProfile();
      setUser(data);
    } catch (err: any) {
      console.log("Profile Loading Error:", err?.response?.data || err);
      Alert.alert("Error", "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    const unsub = navigation.addListener("focus", loadProfile);
    return unsub;
  }, []);

  if (!user)
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
      </View>
    );

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUser({ ...user, dob: selectedDate.toISOString() });
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      await updateMyProfile(user);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  /**
   * Phone Verification handlers
   * Step 1: Send OTP to registered number.
   * Step 2: Verify OTP entered by user.
   */
  const handleRequestVerification = async () => {
    try {
      setVerifying(true);
      await sendPhoneVerificationOtp();
      setShowOtpModal(true);
      Alert.alert("OTP Sent", "Please check your mobile number for the OTP.");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to send OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Error", "Please enter OTP");
    try {
      setVerifying(true);
      await verifyPhoneOtp(otp);
      Alert.alert("Success", "Phone number verified!");
      setShowOtpModal(false);
      setOtp("");
      loadProfile(); // Reload to update verified status icon
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Profile" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {/* User Card */}
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={70}
          label={(user.firstName?.[0] || "?") + (user.lastName?.[0] || "")}
          style={{ backgroundColor: PRIMARY }}
          color="#fff"
        />
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* PERSONAL CARD */}
          <Card style={styles.card}>
            <Card.Title title="Personal Details" />
            <Divider />
            <Card.Content>
              <TextInput
                mode="outlined"
                label="First Name"
                style={styles.input}
                value={user.firstName}
                onChangeText={(v) => setUser({ ...user, firstName: v })}
              />

              <TextInput
                mode="outlined"
                label="Middle Name"
                style={styles.input}
                value={user.middleName || ""}
                onChangeText={(v) => setUser({ ...user, middleName: v })}
              />

              <TextInput
                mode="outlined"
                label="Last Name"
                style={styles.input}
                value={user.lastName || ""}
                onChangeText={(v) => setUser({ ...user, lastName: v })}
              />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                {["male", "female", "transgender", "other"].map((g) => (
                  <Chip
                    key={g}
                    style={[
                      styles.genderChip,
                      user.gender === g && styles.genderChipActive,
                    ]}
                    onPress={() => setUser({ ...user, gender: g })}
                  >
                    {g}
                  </Chip>
                ))}
              </View>

              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {user.dob ? new Date(user.dob).toDateString() : "Select Date"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={user.dob ? new Date(user.dob) : new Date(2000, 0, 1)}
                  mode="date"
                  onChange={handleDateChange}
                  display="default"
                  maximumDate={new Date()}
                />
              )}
            </Card.Content>
          </Card>

          {/* CONTACT CARD */}
          <Card style={styles.card}>
            <Card.Title title="Contact Details" />
            <Divider />
            <Card.Content>
              <View>
                <TextInput
                  mode="outlined"
                  label="Primary Contact"
                  style={styles.input}
                  value={user.primaryContact || ""}
                  keyboardType="phone-pad"
                  onChangeText={(v) => setUser({ ...user, primaryContact: v })}
                  right={
                    <TextInput.Icon
                      icon={user.isPhoneVerified ? "check-circle" : "alert-circle"}
                      color={user.isPhoneVerified ? "green" : "orange"}
                    />
                  }
                />
                {!user.isPhoneVerified && (
                  <TouchableOpacity
                    onPress={handleRequestVerification}
                    style={styles.verifyLink}
                  >
                    <Text style={{ color: PRIMARY, fontWeight: "bold" }}>
                      Verify Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                mode="outlined"
                label="Secondary Contact"
                style={styles.input}
                value={user.secondaryContact || ""}
                keyboardType="phone-pad"
                onChangeText={(v) => setUser({ ...user, secondaryContact: v })}
              />
            </Card.Content>
          </Card>

          {/* ADDRESS CARD */}
          <Card style={styles.card}>
            <Card.Title title="Address" />
            <Divider />
            <Card.Content>
              {[
                "houseNameOrNumber",
                "locality",
                "district",
                "state",
                "pincode",
              ].map((field, index) => (
                <TextInput
                  key={index}
                  mode="outlined"
                  label={
                    field === "houseNameOrNumber"
                      ? "House Name/Number"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  style={styles.input}
                  value={user.address?.[field] || ""}
                  onChangeText={(v) =>
                    setUser({
                      ...user,
                      address: { ...(user.address || {}), [field]: v },
                    })
                  }
                  keyboardType={field === "pincode" ? "numeric" : "default"}
                />
              ))}
            </Card.Content>
          </Card>

          {/* BUTTONS */}
          <Button
            mode="contained"
            onPress={save}
            loading={loading}
            buttonColor={PRIMARY}
            style={styles.saveButton}
          >
            Save Changes
          </Button>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP Modal */}
      <Portal>
        <Modal
          visible={showOtpModal}
          onDismiss={() => setShowOtpModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Enter OTP</Text>
          <Text style={{ marginBottom: 16, color: "#666" }}>
            Sent to {user.primaryContact}
          </Text>
          <TextInput
            mode="outlined"
            label="6-Digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            style={{ marginBottom: 20, backgroundColor: "#fff" }}
          />
          <Button
            mode="contained"
            onPress={handleVerifyOtp}
            loading={verifying}
            buttonColor={PRIMARY}
          >
            Verify
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userName: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: 8 },
  userEmail: { color: "#E8F3FF", fontSize: 13, marginTop: 2 },

  formContainer: { padding: 18, paddingBottom: 60 },

  card: {
    borderRadius: 18,
    marginBottom: 18,
  },

  input: { marginBottom: 12, backgroundColor: "#fff" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    marginBottom: 6,
  },
  genderRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  genderChip: { backgroundColor: "#fff" },
  genderChipActive: { backgroundColor: CHIP_ACTIVE, borderColor: PRIMARY },

  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  dateText: { color: "#555" },

  saveButton: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },

  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  verifyLink: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 12,
    marginRight: 4,
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: PRIMARY,
  },
});
