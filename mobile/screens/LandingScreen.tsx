import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function LandingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/4762/4762313.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Public Grievance System</Text>
      <Text style={styles.subtitle}>
        Submit, track and resolve grievances easily.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E88E5",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#43A047",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
