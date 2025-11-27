import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getMyProfile } from "../services/userService";

export default function HomeScreen({ navigation }: any) {
  // Card animation
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const animateCard = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // First-time profile completion prompt
  useEffect(() => {
    (async () => {
      try {
        const user = await getMyProfile();
        const address = user.address || {};

        const incomplete =
          !user.primaryContact ||
          !user.email ||
          !address.district ||
          !address.houseNameOrNumber;

        if (incomplete) {
          Alert.alert(
            "Complete your profile",
            "Your profile information helps us serve you better.",
            [
              { text: "Later", style: "cancel" },
              {
                text: "Complete Now",
                onPress: () => navigation.navigate("Profile"),
              },
            ]
          );
        }
      } catch (err) {
        console.log("Profile fetch error", err);
      }
    })();
  }, []);

  const DashboardCard = ({
    title,
    subtitle,
    icon,
    color,
    onPress,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={() => {
        animateCard();
        setTimeout(onPress, 100);
      }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View
              style={[styles.iconCircle, { backgroundColor: color + "20" }]}
            >
              <Icon name={icon} size={34} color={color} />
            </View>

            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </Card.Content>
        </Card>
      </Animated.View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PGS Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          A modern citizen grievance platform
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <DashboardCard
          title="Submit Grievance"
          subtitle="Register a new issue or complaint"
          icon="file-document-edit-outline"
          color="#1E88E5"
          onPress={() => navigation.navigate("SubmitGrievance")}
        />

        <DashboardCard
          title="Track Grievances"
          subtitle="Check live status of your complaints"
          icon="map-search-outline"
          color="#43A047"
          onPress={() => navigation.navigate("TrackGrievances")}
        />

        <DashboardCard
          title="Grievance History"
          subtitle="View all previously submitted grievances"
          icon="history"
          color="#FB8C00"
          onPress={() => navigation.navigate("GrievanceHistory")}
        />

        {/* NEW CARD: PROFILE PAGE */}
        <DashboardCard
          title="My Profile"
          subtitle="View & update your personal details"
          icon="account-circle-outline"
          color="#6A1B9A"
          onPress={() => navigation.navigate("Profile")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#1E88E5",
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#DDEEFF",
    marginTop: 4,
  },

  container: {
    padding: 20,
    paddingTop: 30,
  },

  card: {
    borderRadius: 20,
    marginBottom: 22,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    alignItems: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
