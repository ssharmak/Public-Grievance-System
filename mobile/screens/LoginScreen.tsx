import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }: any) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password) {
      Alert.alert("Validation", "Please enter your email/phone and password");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ emailOrPhone: emailOrPhone.trim(), password });

      console.log("LOGIN SUCCESS:", res);

      // navigate to Home (reset stack)
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email or Phone"
        style={styles.input}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  link: { color: "#1E88E5", textAlign: "center" },
});
