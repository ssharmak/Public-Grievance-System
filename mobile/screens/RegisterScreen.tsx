import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Appbar,
  Card,
  IconButton,
  Chip,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const PRIMARY = "#1E88E5";

export default function RegisterScreen({ navigation }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: null as Date | null,
    primaryContact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm({ ...form, dob: selectedDate });
    }
  };

  const validatePassword = (pwd: string) =>
    pwd.length >= 8 &&
    /[A-Za-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[!@#$%^&*]/.test(pwd);

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.primaryContact ||
      !form.email ||
      !form.gender ||
      !form.dob
    ) {
      return alert("Please fill all required fields.");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }

    if (!validatePassword(form.password)) {
      return alert(
        "Password must contain 8+ characters, letters, numbers & a special symbol."
      );
    }

    try {
      const payload = { ...form, dob: form.dob?.toISOString() };

      await axios.post("http://192.168.34.126:5000/api/auth/register", payload);

      alert("Registration Successful!");
      navigation.navigate("Login");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Register" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              {/* Full Name */}
              <Text style={styles.section}>Personal Info</Text>

              <TextInput
                mode="outlined"
                label="First Name *"
                style={styles.input}
                value={form.firstName}
                onChangeText={(v) => handleChange("firstName", v)}
              />

              <TextInput
                mode="outlined"
                label="Middle Name"
                style={styles.input}
                value={form.middleName}
                onChangeText={(v) => handleChange("middleName", v)}
              />

              <TextInput
                mode="outlined"
                label="Last Name *"
                style={styles.input}
                value={form.lastName}
                onChangeText={(v) => handleChange("lastName", v)}
              />

              {/* Gender */}
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.dropdown}>
                <TouchableOpacity
                  onPress={() =>
                    handleChange("gender", form.gender ? "" : "select")
                  }
                >
                  <Text style={styles.dropdownText}>
                    {form.gender ? form.gender.toUpperCase() : "Select Gender"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.genderRow}>
                {["male", "female", "transgender", "other"].map((g) => (
                  <Chip
                    key={g}
                    mode={form.gender === g ? "flat" : "outlined"}
                    style={[
                      styles.genderChip,
                      form.gender === g && styles.genderChipActive,
                    ]}
                    onPress={() => handleChange("gender", g)}
                  >
                    {g}
                  </Chip>
                ))}
              </View>

              {/* Date of Birth */}
              <Text style={styles.label}>Date of Birth *</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateBtn}
              >
                <Text style={styles.dateText}>
                  {form.dob ? form.dob.toDateString() : "Select Date"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={form.dob || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}

              {/* Contact + Email */}
              <TextInput
                label="Primary Contact *"
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                value={form.primaryContact}
                onChangeText={(v) => handleChange("primaryContact", v)}
              />

              <TextInput
                label="Email *"
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
              />

              {/* Password */}
              <TextInput
                label="Password *"
                mode="outlined"
                secureTextEntry={!passwordVisible}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
              />

              {/* Confirm Password */}
              <TextInput
                label="Confirm Password *"
                mode="outlined"
                secureTextEntry={!confirmPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  />
                }
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
              />

              <HelperText type="info">
                * Mandatory fields must be filled.
              </HelperText>

              <Button
                mode="contained"
                style={styles.registerBtn}
                buttonColor={PRIMARY}
                onPress={handleRegister}
              >
                Register
              </Button>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  container: { padding: 18, paddingBottom: 60 },
  card: {
    borderRadius: 20,
    paddingVertical: 10,
  },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "600", color: "#444" },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: PRIMARY,
  },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  genderChip: { backgroundColor: "#fff" },
  genderChipActive: { backgroundColor: "#E3F2FD", borderColor: PRIMARY },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: { fontSize: 15, color: "#555" },
  dateBtn: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: { fontSize: 15, color: "#333" },
  registerBtn: { marginTop: 15, paddingVertical: 8, borderRadius: 10 },
  loginLink: {
    textAlign: "center",
    color: PRIMARY,
    marginTop: 15,
    fontWeight: "600",
  },
});
