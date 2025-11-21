import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getMyGrievances } from "../services/grievanceService";
import { useIsFocused } from "@react-navigation/native";

export default function GrievanceHistoryScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const load = async () => {
    try {
      const res = await getMyGrievances();
      setItems(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
        My Grievances
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("GrievanceDetails", { id: item.grievanceId })
            }
          >
            <Text style={{ fontWeight: "600" }}>
              {item.grievanceId} — {item.title}
            </Text>
            <Text style={{ color: "#666" }}>
              {item.status} • {new Date(item.createdAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
});
