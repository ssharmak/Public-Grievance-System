/**
 * @file ForgotPasswordScreen.tsx
 * @description Screen for resetting a forgotten password securely via OTP.
 * Step 1: Request OTP by providing registered mobile number.
 * Step 2: Verify OTP and set a new password.
 */

import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import {
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} from "../services/authService";

const PRIMARY = "#1E88E5";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Request OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [primaryContact, setPrimaryContact] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);

  /**
   * Step 1: Validation and OTP Request
   */
  const handleRequestOtp = async () => {
    if (!primaryContact) {
      return Alert.alert("Error", "Please enter your registered mobile number");
    }

    const isValid = phoneInput.current?.isValidNumber(primaryContact);
    const countryCode = phoneInput.current?.getCountryCode();

    if (countryCode === "IN" && primaryContact.length !== 13) {
      return Alert.alert("Error", "Mobile number must be 10 digits");
    }

    if (!isValid) {
      return Alert.alert("Error", "Invalid mobile number");
    }

    try {
      setLoading(true);
      await requestPasswordResetOtp(primaryContact);
      Alert.alert("OTP Sent", "Please check your mobile for the OTP.");
      setStep(2);
    } catch (err: any) {
      console.log(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Password Reset Confirmation
   */
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    if (newPassword.length < 8) {
      return Alert.alert("Error", "Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      await resetPasswordWithOtp({
        primaryContact,
        otp,
        newPassword,
      });
      Alert.alert(
        "Success",
        "Password reset successfully! Please login with your new password.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (err: any) {
      console.log(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Forgot Password" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              {step === 1 ? (
                <>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.subtitle}>
                    Enter your registered mobile number to receive an OTP.
                  </Text>

                  <Text style={styles.label}>Mobile Number</Text>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={primaryContact}
                    defaultCode="IN"
                    layout="first"
                    onChangeFormattedText={(text) => setPrimaryContact(text)}
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.phoneTextContainer}
                    withDarkTheme
                    withShadow
                    textInputProps={{ maxLength: 10 }}
                  />

                  <Button
                    mode="contained"
                    onPress={handleRequestOtp}
                    loading={loading}
                    style={styles.button}
                    buttonColor={PRIMARY}
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Verify & Reset</Text>
                  <Text style={styles.subtitle}>
                    Enter the OTP sent to {primaryContact}
                  </Text>

                  <TextInput
                    label="OTP"
                    mode="outlined"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    style={styles.input}
                    maxLength={6}
                  />

                  <TextInput
                    label="New Password"
                    mode="outlined"
                    secureTextEntry={!passwordVisible}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon={passwordVisible ? "eye-off" : "eye"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                  />

                  <TextInput
                    label="Confirm Password"
                    mode="outlined"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon={confirmPasswordVisible ? "eye-off" : "eye"}
                        onPress={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                      />
                    }
                  />

                  <Button
                    mode="contained"
                    onPress={handleResetPassword}
                    loading={loading}
                    style={styles.button}
                    buttonColor={PRIMARY}
                  >
                    Reset Password
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => setStep(1)}
                    style={{ marginTop: 10 }}
                    textColor="#666"
                  >
                    Change Mobile Number
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  container: { padding: 16, justifyContent: "center", flexGrow: 1 },
  card: { borderRadius: 16, paddingVertical: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  label: { marginBottom: 8, fontWeight: "600", color: "#444" },
  input: { marginBottom: 16, backgroundColor: "#fff" },
  button: { marginTop: 8, borderRadius: 8, paddingVertical: 4 },
  phoneContainer: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#79747E",
    marginBottom: 20,
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
