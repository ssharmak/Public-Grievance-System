import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Card,
  Text,
  Chip,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { getMyGrievances } from "../services/grievanceService";

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

export default function GrievanceHistoryScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyGrievances();
      setItems(res);
    } catch (err) {
      console.error("HISTORY ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Grievance History" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading...</Text>
        </View>
      ) : (
        <>
          {items.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ opacity: 0.7 }}>No grievance records found</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              contentContainerStyle={{ padding: 16 }}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ marginBottom: 14 }}
                  onPress={() =>
                    navigation.navigate("GrievanceDetails", {
                      id: item.grievanceId,
                    })
                  }
                >
                  <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                      <View style={styles.row}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.category}>
                          {item.category?.name}
                        </Text>
                      </View>
                      <Text style={styles.grievanceId}>
                        ID: {item.grievanceId}
                      </Text>

                      <View style={styles.row}>
                        <Text style={styles.dateText}>
                          📅 {new Date(item.createdAt).toLocaleString()}
                        </Text>

                        <Chip
                          style={[
                            styles.statusChip,
                            {
                              backgroundColor:
                                getStatusColor(item.status) + "20",
                            },
                          ]}
                          textStyle={{
                            color: getStatusColor(item.status),
                            fontWeight: "700",
                          }}
                        >
                          {item.status}
                        </Chip>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FB" },

  card: {
    borderRadius: 14,
    padding: 6,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
    flex: 1,
  },

  category: {
    fontSize: 12,
    color: "#1E88E5",
    fontWeight: "600",
    marginLeft: 8,
  },

  grievanceId: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },

  statusChip: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
  },

  dateText: {
    fontSize: 12,
    color: "#777",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
