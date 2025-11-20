import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Button, Text, Card } from "react-native-paper";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.main}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.Content title="Public Grievance System" />
        <Button mode="text" onPress={() => navigation.navigate("Login")}>
          Login
        </Button>
        <Button mode="text" onPress={() => navigation.navigate("Register")}>
          Register
        </Button>
      </Appbar.Header>

      {/* Info Section */}
      <View style={styles.container}>
        <Card style={styles.card} elevation={4}>
          <Card.Content>
            <Text style={styles.title}>Why Public Grievance System?</Text>

            <Text style={styles.text}>
              This system allows people to submit problems, complaints, and
              suggestions directly to government departments.
            </Text>

            <Text style={styles.text}>
              It improves transparency, speeds up resolutions, and ensures
              proper monitoring of public issues.
            </Text>

            <Text style={styles.text}>
              It helps in building better governance by identifying public needs
              and resolving them efficiently.
            </Text>

            <Button
              mode="contained"
              style={styles.exploreBtn}
              onPress={() => navigation.navigate("Landing")}
            >
              Explore Features
            </Button>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
    lineHeight: 22,
  },
  exploreBtn: {
    marginTop: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
