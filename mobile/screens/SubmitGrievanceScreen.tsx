import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  Divider,
  Appbar,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { submitGrievance, getCategories } from "../services/grievanceService";

const PRIMARY = "#1E88E5";

export default function SubmitGrievanceScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catsLoading, setCatsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCatsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.log("Error fetching categories", err);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setCatsLoading(false);
    }
  };

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
    if (!title.trim()) {
      Alert.alert("Error", "Please enter title");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter description");
      return false;
    }
    if (!categoryId) {
      Alert.alert("Error", "Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("priority", priority);
      formData.append("location", location);
      formData.append("isAnonymous", String(isAnonymous));

      attachments.forEach((file, index) => {
        formData.append("attachments", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        } as any);
      });

      await submitGrievance(formData);

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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="New Grievance" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                mode="outlined"
                label="Title"
                placeholder="Short and clear title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerBox}>
                {catsLoading ? (
                  <ActivityIndicator size="small" style={{ padding: 14 }} />
                ) : (
                  <Picker
                    selectedValue={categoryId}
                    onValueChange={(v) => setCategoryId(v)}
                    mode="dropdown"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <Picker.Item label="Select category" value="" />
                    {categories.map((c) => (
                      <Picker.Item key={c._id} label={c.name} value={c._id} />
                    ))}
                  </Picker>
                )}
              </View>

              <Text style={styles.label}>Priority</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={priority}
                  onValueChange={(v) => setPriority(v)}
                  mode="dropdown"
                  style={{ backgroundColor: "#fff" }}
                >
                  <Picker.Item label="Low" value="Low" />
                  <Picker.Item label="Medium" value="Medium" />
                  <Picker.Item label="High" value="High" />
                </Picker>
              </View>

              <TextInput
                mode="outlined"
                label="Location (optional)"
                placeholder="Nearby landmark"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Description"
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
                  color={PRIMARY}
                />
              </View>

              <Divider style={{ marginVertical: 12 }} />

              <View style={styles.attachmentRow}>
                <Text style={styles.label}>Attachments</Text>
                <IconButton icon="paperclip" size={22} onPress={pickDocument} />
              </View>

              {attachments.map((a, i) => (
                <View key={i} style={styles.attachmentItem}>
                  <Text style={{ flex: 1 }} numberOfLines={1}>
                    {a.name}
                  </Text>
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
                buttonColor={PRIMARY}
              >
                Submit Grievance
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  container: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 16, backgroundColor: "#fff" },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#444",
    fontSize: 14,
  },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#79747E",
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  anonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  attachmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attachmentItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 6,
  },
});
