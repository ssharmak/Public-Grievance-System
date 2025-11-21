import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  ActivityIndicator,
  Chip,
  IconButton,
  Divider,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";

import { submitGrievance } from "../services/grievanceService";

// -----------------------------------------
// ⭐ OFFICIAL STATIC PUBLIC GRIEVANCE CATEGORIES
// -----------------------------------------
const FIXED_CATEGORIES = [
  { _id: "electricity", name: "Electricity & Power" },
  { _id: "water", name: "Water Supply" },
  { _id: "waste", name: "Waste Management" },
  { _id: "roads", name: "Roads & Infrastructure" },
  { _id: "public_transport", name: "Public Transport" },
  { _id: "public_safety", name: "Public Safety / Police" },
  { _id: "health", name: "Health & Sanitation" },
  { _id: "govt_services", name: "Government Services" },
  { _id: "housing", name: "Housing & Building" },
  { _id: "environment", name: "Environment" },
  { _id: "education", name: "Education" },
  { _id: "welfare", name: "Welfare & Social Justice" },
  { _id: "others", name: "Others" },
];

// Colors
const PRIMARY = "#1E88E5";

export default function SubmitGrievanceScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories] = useState(FIXED_CATEGORIES); // ⭐ using static categories
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<
    { uri: string; name: string; size?: number; type?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // subtle header animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // -----------------------------------------
  // 📄 Pick File
  // -----------------------------------------
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: false,
      });

      if (!res.canceled) {
        const file = res.assets[0];

        setAttachments((prev) => [
          ...prev,
          {
            uri: file.uri,
            name: file.name,
            size: file.size ?? 0,
            type: file.mimeType ?? "file",
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Attachment Error", "Unable to pick file.");
      console.log(err);
    }
  };

  const removeAttachment = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    if (!title.trim()) return Alert.alert("Validation", "Enter title.");
    if (!description.trim())
      return Alert.alert("Validation", "Enter description.");
    return true;
  };

  // -----------------------------------------
  // 🚀 Submit Form
  // -----------------------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        priority,
        location: location.trim(),
        attachments: attachments.map((a) => a.name),
      };

      await submitGrievance(payload);

      setLoading(false);
      Alert.alert("Submitted", "Grievance submitted successfully.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("GrievanceHistory"),
        },
      ]);
    } catch (err: any) {
      setLoading(false);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Submission failed."
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.headerTitle}>New Grievance</Text>
        <Text style={styles.headerSubtitle}>
          Report an issue — we’ll route it to the right department.
        </Text>
      </Animated.View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            {/* ✔ Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Short, descriptive title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.row}>
              {/* CATEGORY */}
              <View style={styles.column}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={categoryId}
                    onValueChange={(v) => setCategoryId(v)}
                  >
                    <Picker.Item label="Select category" value={null} />
                    {categories.map((c) => (
                      <Picker.Item key={c._id} label={c.name} value={c._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* SPACING */}
              <View style={{ width: 20 }} />

              {/* PRIORITY */}
              <View style={styles.column}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={priority}
                    onValueChange={(v) => setPriority(v)}
                  >
                    <Picker.Item label="Low Priority" value="Low" />
                    <Picker.Item label="Medium Priority" value="Medium" />
                    <Picker.Item label="High Priority" value="High" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* ✔ Location */}
            <Text style={[styles.label, { marginTop: 12 }]}>Location</Text>
            <TextInput
              placeholder="Reference point or address (optional)"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
            />

            {/* ✔ Description */}
            <Text style={[styles.label, { marginTop: 12 }]}>Description</Text>
            <TextInput
              placeholder="Explain the issue"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={[
                styles.input,
                { minHeight: 120, textAlignVertical: "top" },
              ]}
            />

            <Divider style={{ marginVertical: 14 }} />

            {/* ✔ Attachments */}
            <View style={styles.attachmentRow}>
              <Text style={styles.label}>Attachments</Text>

              <IconButton
                icon="paperclip"
                size={24}
                onPress={pickDocument}
                iconColor={PRIMARY} // FIXED PROP
              />
            </View>

            {attachments.length > 0 && (
              <View style={{ marginTop: 6 }}>
                {attachments.map((a, i) => (
                  <View key={i} style={styles.attachmentItem}>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={{ fontWeight: "600" }}>
                        {a.name}
                      </Text>
                      <Text style={{ color: "#666", fontSize: 12 }}>
                        {a.type || ""}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => removeAttachment(i)}>
                      <IconButton icon="close" size={20} iconColor="#000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* ✔ Submit */}
            <View style={{ marginTop: 18 }}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                contentStyle={{ paddingVertical: 8 }}
                style={styles.submitButton}
              >
                Submit Grievance
              </Button>

              <Button mode="text" onPress={() => navigation.goBack()}>
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FB" },

  header: {
    backgroundColor: PRIMARY,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  headerSubtitle: { color: "#E8F3FF", marginTop: 6 },

  container: {
    padding: 20,
    paddingTop: 18,
  },

  card: {
    borderRadius: 16,
    padding: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
  },

  column: { flex: 1 },

  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#E6EEF8",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  priorityRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },

  chip: { marginRight: 6, borderRadius: 8, backgroundColor: "#fff" },
  chipActive: { backgroundColor: "#E3F2FD", borderColor: PRIMARY },

  attachmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  submitButton: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },
});
