import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Linking } from "react-native";
import {
  Text,
  Card,
  ActivityIndicator,
  Appbar,
  Chip,
  Divider,
  Button,
  Paragraph,
} from "react-native-paper";
import { getGrievance } from "../services/grievanceService";
import { API_BASE } from "../services/api";

const PRIMARY = "#1E88E5";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "#FB8C00";
    case "In Progress":
      return "#1E88E5";
    case "Resolved":
      return "#43A047";
    case "Rejected":
      return "#D32F2F";
    default:
      return "#757575";
  }
};

export default function GrievanceDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [g, setG] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getGrievance(id);
      setG(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading || !g)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={{ marginTop: 10 }}>Loading Details...</Text>
      </View>
    );

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Grievance Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        {/* STATUS CARD */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.idText}>ID: {g.grievanceId}</Text>
              <Chip
                style={{ backgroundColor: getStatusColor(g.status) + "20" }}
                textStyle={{
                  color: getStatusColor(g.status),
                  fontWeight: "bold",
                }}
              >
                {g.status}
              </Chip>
            </View>
            <Text style={styles.date}>
              Submitted on {new Date(g.createdAt).toLocaleString()}
            </Text>
          </Card.Content>
        </Card>

        {/* MAIN CONTENT */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{g.title}</Text>

            <Divider style={styles.divider} />

            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>
              {g.category?.name || "Uncategorized"}
            </Text>

            <Divider style={styles.divider} />

            <Text style={styles.label}>Priority</Text>
            <Text style={styles.value}>{g.priority}</Text>

            <Divider style={styles.divider} />

            <Text style={styles.label}>Description</Text>
            <Paragraph style={styles.desc}>{g.description}</Paragraph>
          </Card.Content>
        </Card>

        {/* LOCATION */}
        {g.location && (
          <Card style={styles.card}>
            <Card.Title title="Location" left={(props) => <Appbar.Action icon="map-marker" {...props} />} />
            <Card.Content>
               <Text>{g.location}</Text>
            </Card.Content>
          </Card>
        )}

        {/* ATTACHMENTS */}
        {g.attachments && g.attachments.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="Attachments" />
            <Card.Content>
              {g.attachments.map((a: string, i: number) => {
                let url = a;
                if (!a.startsWith("http")) {
                   const baseUrl = API_BASE.replace("/api", "");
                   // Ensure 'a' starts with / if not present, though usually it does from backend
                   const path = a.startsWith("/") ? a : "/" + a;
                   url = baseUrl + path;
                }
                return (
                  <View key={i} style={styles.attachmentRow}>
                    <Text style={{ flex: 1 }} numberOfLines={1}>
                      {a.split("/").pop()}
                    </Text>
                    <Button
                      mode="text"
                      compact
                      onPress={() => Linking.openURL(url)}
                    >
                      View
                    </Button>
                  </View>
                );
              })}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, marginBottom: 16, backgroundColor: "#fff" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  idText: { fontWeight: "700", fontSize: 16, color: "#333" },
  date: { fontSize: 12, color: "#777" },
  label: { fontSize: 12, color: "#888", marginBottom: 2, textTransform: "uppercase", fontWeight: "600" },
  value: { fontSize: 16, color: "#222", marginBottom: 4 },
  divider: { marginVertical: 12 },
  desc: { fontSize: 15, lineHeight: 22, color: "#444" },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});
