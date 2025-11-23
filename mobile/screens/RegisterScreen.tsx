import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Appbar,
  Card,
  Chip,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { register } from "../services/authService";

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

  const handleChange = (key: string, value: any) =>
    setForm({ ...form, [key]: value });

  const handleDateChange = (_: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) setForm({ ...form, dob: selectedDate });
  };

  const validatePassword = (p: string) =>
    p.length >= 8 &&
    /[A-Za-z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[!@#$%^&*]/.test(p);

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.gender || !form.dob) {
      return Alert.alert("Missing Fields", "Please fill all required fields");
    }

    if (form.password !== form.confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    if (!validatePassword(form.password)) {
      return Alert.alert(
        "Weak Password",
        "Min 8 chars, include letters, numbers, and symbols"
      );
    }

    try {
      const payload = {
        ...form,
        dob: form.dob?.toISOString(),
      };

      console.log("REGISTER SENDING:", payload);

      const res = await register(payload);
      console.log("REGISTER RESPONSE:", res);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err: any) {
      console.log(err.response?.data || err);
      Alert.alert(
        "Registration Failed",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
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
              <Text style={styles.section}>Personal Info</Text>

              <TextInput
                label="First Name *"
                mode="outlined"
                style={styles.input}
                value={form.firstName}
                onChangeText={(v) => handleChange("firstName", v)}
              />

              <TextInput
                label="Middle Name"
                mode="outlined"
                style={styles.input}
                value={form.middleName}
                onChangeText={(v) => handleChange("middleName", v)}
              />

              <TextInput
                label="Last Name *"
                mode="outlined"
                style={styles.input}
                value={form.lastName}
                onChangeText={(v) => handleChange("lastName", v)}
              />

              {/* Gender */}
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderRow}>
                {["male", "female", "transgender", "other"].map((g) => (
                  <Chip
                    key={g}
                    onPress={() => handleChange("gender", g)}
                    mode={form.gender === g ? "flat" : "outlined"}
                    style={[
                      styles.genderChip,
                      form.gender === g && styles.genderChipActive,
                    ]}
                  >
                    {g}
                  </Chip>
                ))}
              </View>

              {/* Date Picker */}
              <Text style={styles.label}>Date of Birth *</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateBtn}
              >
                <Text>
                  {form.dob ? form.dob.toDateString() : "Select Date"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={form.dob || new Date(2000, 0, 1)}
                  mode="date"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}

              {/* Contact */}
              <TextInput
                label="Primary Contact *"
                mode="outlined"
                style={styles.input}
                value={form.primaryContact}
                onChangeText={(v) => handleChange("primaryContact", v)}
                keyboardType="phone-pad"
              />

              <TextInput
                label="Email *"
                mode="outlined"
                style={styles.input}
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {/* Password */}
              <TextInput
                label="Password *"
                mode="outlined"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
              />

              <TextInput
                label="Confirm Password *"
                mode="outlined"
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                buttonColor={PRIMARY}
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
  container: { padding: 20 },
  card: { borderRadius: 18, padding: 10 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  label: { marginBottom: 8, marginTop: 10 },
  genderRow: { flexDirection: "row", marginBottom: 10, gap: 8 },
  genderChip: {},
  genderChipActive: { backgroundColor: "#E3F2FD", borderColor: PRIMARY },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 10,
  },
  loginLink: { textAlign: "center", marginTop: 15, color: PRIMARY },
});
