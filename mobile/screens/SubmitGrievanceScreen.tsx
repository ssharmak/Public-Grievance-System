import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  Divider,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { submitGrievance } from "../services/grievanceService";

const PRIMARY = "#1E88E5";

// ⭐ Static categories (NO DB required)
const CATEGORIES = [
  { id: "electricity", name: "Electricity & Power" },
  { id: "water", name: "Water Supply" },
  { id: "waste", name: "Waste Management" },
  { id: "roads", name: "Roads & Infrastructure" },
  { id: "transport", name: "Public Transport" },
  { id: "safety", name: "Public Safety / Police" },
  { id: "health", name: "Health & Sanitation" },
  { id: "govt", name: "Government Services" },
  { id: "housing", name: "Housing & Building" },
  { id: "environment", name: "Environment" },
  { id: "education", name: "Education" },
  { id: "welfare", name: "Welfare & Social Justice" },
  { id: "others", name: "Others" },
];

export default function SubmitGrievanceScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setAttachments([...attachments, file]);
      }
    } catch (err) {
      console.log("Attachment Error", err);
    }
  };

  const removeAttachment = (i: number) =>
    setAttachments(attachments.filter((_, idx) => idx !== i));

  const validate = () => {
    if (!title.trim()) return Alert.alert("Error", "Please enter title");
    if (!description.trim())
      return Alert.alert("Error", "Please enter description");
    if (!categoryId) return Alert.alert("Error", "Please select a category");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await submitGrievance({
        title,
        description,
        categoryId,
        priority,
        location,
        attachments: attachments.map((a) => a.name),
        isAnonymous,
      });

      setLoading(false);
      Alert.alert("Success", "Grievance submitted!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("GrievanceHistory"),
        },
      ]);
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong!");
      console.log(err.response?.data || err);
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <Animated.View style={styles.header}>
        <Text style={styles.headerTitle}>New Grievance</Text>
        <Text style={styles.headerSubtitle}>
          Help us take action on issues that matter
        </Text>
      </Animated.View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Title</Text>
            <TextInput
              mode="outlined"
              placeholder="Short and clear title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(v) => setCategoryId(v)}
              >
                <Picker.Item label="Select category" value={null} />
                {CATEGORIES.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={priority}
                onValueChange={(v) => setPriority(v)}
              >
                <Picker.Item label="Low" value="Low" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="High" value="High" />
              </Picker>
            </View>

            <Text style={styles.label}>Location (optional)</Text>
            <TextInput
              mode="outlined"
              placeholder="Nearby landmark"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={5}
              placeholder="Describe the issue"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { textAlignVertical: "top" }]}
            />

            <View style={styles.anonRow}>
              <Text style={styles.label}>Submit Anonymously</Text>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                thumbColor={isAnonymous ? PRIMARY : "#ccc"}
              />
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.attachmentRow}>
              <Text style={styles.label}>Attachments</Text>
              <IconButton icon="paperclip" size={22} onPress={pickDocument} />
            </View>

            {attachments.map((a, i) => (
              <View key={i} style={styles.attachmentItem}>
                <Text style={{ flex: 1 }}>{a.name}</Text>
                <IconButton
                  icon="close"
                  size={18}
                  onPress={() => removeAttachment(i)}
                />
              </View>
            ))}

            <Button
              mode="contained"
              loading={loading}
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              Submit
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F9FF" },
  header: {
    backgroundColor: PRIMARY,
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  headerSubtitle: { color: "#CFE6FF", marginTop: 5 },
  container: { padding: 20 },
  card: { borderRadius: 18 },
  label: { fontWeight: "700", marginBottom: 4, color: "#333" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#D0D8E5",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  anonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  attachmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attachmentItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: PRIMARY,
    marginTop: 20,
    borderRadius: 10,
  },
});
