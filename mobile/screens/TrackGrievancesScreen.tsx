import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getMyGrievances } from "../services/grievanceService";
import { useIsFocused } from "@react-navigation/native";

export default function TrackGrievancesScreen({ navigation }: any) {
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
        Track
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={() =>
              navigation.navigate("GrievanceDetails", { id: item.grievanceId })
            }
          >
            <Text style={{ fontWeight: "600" }}>
              {item.grievanceId} — {item.title}
            </Text>
            <Text style={{ color: "#666" }}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
