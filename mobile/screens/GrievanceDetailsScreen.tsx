import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getGrievance } from "../services/grievanceService";

export default function GrievanceDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [g, setG] = useState<any>(null);

  const load = async () => {
    try {
      const res = await getGrievance(id);
      setG(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!g)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{g.title}</Text>
      <Text style={{ color: "#666", marginBottom: 10 }}>
        {g.grievanceId} • {new Date(g.createdAt).toLocaleString()}
      </Text>
      <Text style={{ marginBottom: 10 }}>{g.description}</Text>
      <Text style={{ fontWeight: "600", marginTop: 15 }}>
        Status: {g.status}
      </Text>
      {g.attachments && g.attachments.length > 0 && (
        <>
          <Text style={{ fontWeight: "600", marginTop: 10 }}>Attachments</Text>
          {g.attachments.map((a: string, i: number) => (
            <Text key={i}>{a}</Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}
