// mobile/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function RegisterScreen({ navigation }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "select",
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

  const validatePassword = (pwd: string) => {
    const length = pwd.length >= 8;
    const letter = /[A-Za-z]/.test(pwd);
    const number = /[0-9]/.test(pwd);
    const special = /[!@#$%^&*]/.test(pwd);
    return length && letter && number && special;
  };

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.primaryContact ||
      !form.email ||
      form.gender === "select" ||
      !form.dob
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!validatePassword(form.password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters and contain letters, numbers, and a special character."
      );
      return;
    }

    try {
      const payload = {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        gender: form.gender,
        // send ISO string so server-side validator accepts it
        dob: form.dob ? form.dob.toISOString() : null,
        primaryContact: form.primaryContact,
        email: form.email,
        password: form.password,
      };

      // for emulator: http://10.0.2.2:5000  ; for physical device use machine IP run ipconfig and look for IPV4 and paste the address
      const res = await axios.post(
        "http://192.168.34.126:5000/api/auth/register",
        payload,
        { timeout: 60000 }
      );

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (err: any) {
      console.log("Register error:", err?.response?.data || err.message);
      const message =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          err.response.data.errors.map((e: any) => e.msg).join(", ")) ||
        "Registration failed.";
      Alert.alert("Error", message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="First Name *"
        style={styles.input}
        value={form.firstName}
        onChangeText={(v) => handleChange("firstName", v)}
      />

      <TextInput
        placeholder="Middle Name"
        style={styles.input}
        value={form.middleName}
        onChangeText={(v) => handleChange("middleName", v)}
      />

      <TextInput
        placeholder="Last Name *"
        style={styles.input}
        value={form.lastName}
        onChangeText={(v) => handleChange("lastName", v)}
      />

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(v) => handleChange("gender", v)}
        >
          <Picker.Item label="Select Gender" value="select" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Transgender" value="transgender" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <Text style={styles.label}>Date of Birth *</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {form.dob ? form.dob.toDateString() : "Select Date of Birth"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.dob || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        placeholder="Primary Contact *"
        style={styles.input}
        value={form.primaryContact}
        onChangeText={(v) => handleChange("primaryContact", v)}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Email *"
        style={styles.input}
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password *"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
      />

      <TextInput
        placeholder="Confirm Password *"
        style={styles.input}
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(v) => handleChange("confirmPassword", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 20 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: { fontSize: 16, color: "#444" },
  button: {
    backgroundColor: "#43A047",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    color: "#1E88E5",
    textAlign: "center",
    marginTop: 15,
    fontSize: 15,
  },
});
