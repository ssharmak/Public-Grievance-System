/**
 * @file RegisterScreen.tsx
 * @description Registration screen for new Citizen accounts.
 * Collects Personal Info, Contact Details, and Password.
 * Features validation for phone numbers (Strict 10-digit Indian format) and password strength.
 */

import React, { useState, useRef } from "react";
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
  Appbar,
  Card,
  Chip,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhoneInput from "react-native-phone-number-input";
import { register } from "../services/authService";

const PRIMARY = "#1E88E5";

export default function RegisterScreen({ navigation }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);
  const secondaryPhoneInput = useRef<PhoneInput>(null);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: null as Date | null,
    primaryContact: "",
    secondaryContact: "",
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

  /**
   * Helper: Strong Password Validation
   * Min 8 chars, 1 letter, 1 number, 1 special char.
   */
  const validatePassword = (p: string) =>
    p.length >= 8 &&
    /[A-Za-z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[!@#$%^&*]/.test(p);

  /**
   * Handle Registration Submission
   * Validates all fields, numbers, and password consistency.
   * Calls API and redirects to Login/Home on success.
   */
  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.gender || !form.dob) {
      return Alert.alert("Missing Fields", "Please fill all required fields");
    }

    if (!form.primaryContact) {
      return Alert.alert("Missing Fields", "Primary contact is required");
    }

    const primaryCode = phoneInput.current?.getCountryCode();
    const isPrimaryValid = phoneInput.current?.isValidNumber(form.primaryContact);
    
    // Strict 10-digit check for India (+91 + 10 digits = 13 chars)
    if (primaryCode === 'IN') {
       if (form.primaryContact.length !== 13) {
          return Alert.alert("Invalid Contact", "Primary contact must be exactly 10 digits");
       }
    }

    if (!isPrimaryValid) {
      return Alert.alert("Invalid Contact", "Please enter a valid primary contact number");
    }

    if (form.secondaryContact) {
      const secondaryCode = secondaryPhoneInput.current?.getCountryCode();
      const isSecondaryValid = secondaryPhoneInput.current?.isValidNumber(form.secondaryContact);
      
      if (secondaryCode === 'IN') {
         if (form.secondaryContact.length !== 13) {
            return Alert.alert("Invalid Contact", "Secondary contact must be exactly 10 digits");
         }
      }

      if (!isSecondaryValid) {
        return Alert.alert("Invalid Contact", "Please enter a valid secondary contact number");
      }
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
      setLoading(true);
      const payload = {
        ...form,
        dob: form.dob?.toISOString(),
      };

      const res = await register(payload);

      if (res.token) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Success", "Registration successful! Please login.");
        navigation.navigate("Login");
      }
    } catch (err: any) {
      console.log(err.response?.data || err);
      
      let errorMessage = "Something went wrong";
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Handle express-validator errors array
        errorMessage = err.response.data.errors.map((e: any) => e.msg).join("\n");
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Create Account" />
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
                    textStyle={{
                      color: form.gender === g ? PRIMARY : "#666",
                      fontWeight: form.gender === g ? "bold" : "normal",
                    }}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Chip>
                ))}
              </View>

              {/* Date Picker */}
              <Text style={styles.label}>Date of Birth *</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateBtn}
              >
                <Text style={{ color: form.dob ? "#000" : "#666" }}>
                  {form.dob ? form.dob.toDateString() : "Select Date"}
                </Text>
                <TextInput.Icon icon="calendar" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={form.dob || new Date(2000, 0, 1)}
                  mode="date"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}

              <Text style={[styles.section, { marginTop: 20 }]}>
                Account Details
              </Text>

              <Text style={styles.label}>Primary Contact *</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={form.primaryContact}
                defaultCode="IN"
                layout="first"
                onChangeFormattedText={(text: string) => {
                  handleChange("primaryContact", text);
                }}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                withDarkTheme
                withShadow
                textInputProps={{ maxLength: 10 }}
              />

              <Text style={styles.label}>Secondary Contact</Text>
              <PhoneInput
                ref={secondaryPhoneInput}
                defaultValue={form.secondaryContact}
                defaultCode="IN"
                layout="first"
                onChangeFormattedText={(text: string) => {
                  handleChange("secondaryContact", text);
                }}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                withDarkTheme
                withShadow
                textInputProps={{ maxLength: 10 }}
              />

              <TextInput
                label="Email *"
                mode="outlined"
                style={styles.input}
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password *"
                mode="outlined"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                left={<TextInput.Icon icon="lock" />}
              />

              <TextInput
                label="Confirm Password *"
                mode="outlined"
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  />
                }
                left={<TextInput.Icon icon="lock-check" />}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                buttonColor={PRIMARY}
                loading={loading}
                style={styles.registerBtn}
                contentStyle={{ height: 48 }}
              >
                Register
              </Button>

              <View style={styles.footer}>
                <Text style={{ color: "#666" }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  container: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, paddingVertical: 8 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  label: { marginBottom: 8, marginTop: 10, fontWeight: "600", color: "#444" },
  genderRow: { flexDirection: "row", marginBottom: 10, gap: 8, flexWrap: "wrap" },
  genderChip: { backgroundColor: "#fff", borderColor: "#ddd" },
  genderChipActive: { backgroundColor: "#E3F2FD", borderColor: PRIMARY },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#79747E",
    padding: 14,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 16,
  },
  registerBtn: {
    marginTop: 20,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  loginLink: { color: PRIMARY, fontWeight: "bold" },
  phoneContainer: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#79747E",
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 56,
  },
  phoneTextContainer: {
    backgroundColor: "#fff",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    paddingVertical: 0,
  },
});
