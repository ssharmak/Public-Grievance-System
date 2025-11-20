import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PGS</Text>
      <Text style={styles.subtitle}>Public Grievance System Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SubmitGrievance")}
      >
        <Text style={styles.buttonText}>Submit Grievance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TrackGrievances")}
      >
        <Text style={styles.buttonText}>Track Grievances</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GrievanceHistory")}
      >
        <Text style={styles.buttonText}>Grievance History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    width: "80%",
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
