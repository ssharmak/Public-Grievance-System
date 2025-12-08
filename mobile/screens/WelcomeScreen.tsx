/**
 * @file WelcomeScreen.tsx
 * @description Splash/Landing screen for the mobile app.
 * Provides entry points for Login and Registration.
 */

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";

const PRIMARY = "#1E88E5";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/921/921347.png",
          }}
          style={styles.logo}
        />

        <Text style={styles.title}>Public Grievance System</Text>
        <Text style={styles.subtitle}>
          Empowering citizens to voice their concerns and ensuring efficient
          resolution by the government.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={{ height: 50 }}
            buttonColor={PRIMARY}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            style={[styles.button, styles.outlineBtn]}
            contentStyle={{ height: 50 }}
            textColor={PRIMARY}
            onPress={() => navigation.navigate("Register")}
          >
            Create Account
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    borderRadius: 12,
    width: "100%",
  },
  outlineBtn: {
    borderColor: PRIMARY,
    borderWidth: 2,
  },
});
