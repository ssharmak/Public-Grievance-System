import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { login } from "../services/authService";
// Push notification imports removed

const PRIMARY = "#1E88E5";

export default function LoginScreen({ navigation }: any) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password) {
      Alert.alert("Validation", "Please enter your email/phone and password");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ emailOrPhone: emailOrPhone.trim(), password });

      if (res.token) {
        // Push notification registration removed

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Error", "Token missing! Try logging in again.");
      }
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err?.message || err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          err.response.data.errors.map((e: any) => e.msg).join(", ")) ||
        "Login failed. Check credentials.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue</Text>
        </View>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <TextInput
              label="Email or Phone"
              mode="outlined"
              style={styles.input}
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={secureText}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              right={
                <TextInput.Icon
                  icon={secureText ? "eye" : "eye-off"}
                  onPress={() => setSecureText(!secureText)}
                />
              }
              left={<TextInput.Icon icon="lock" />}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              contentStyle={{ height: 50 }}
              style={styles.button}
              buttonColor={PRIMARY}
            >
              Login
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>Register</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA", justifyContent: "center" },
  container: { padding: 20, justifyContent: "center" },
  headerContainer: { marginBottom: 30, alignItems: "center" },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 16, color: "#666" },
  card: { borderRadius: 20, paddingVertical: 10 },
  input: { marginBottom: 16, backgroundColor: "#fff" },
  button: { borderRadius: 10, marginTop: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: "#666" },
  link: { color: PRIMARY, fontWeight: "bold" },
});
