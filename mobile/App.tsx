/**
 * @file App.tsx
 * @description Main entry point for the React Native Mobile App.
 * Configures Navigation (Stack Navigator) and Theme Provider (PaperProvider).
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import SubmitGrievanceScreen from "./screens/SubmitGrievanceScreen";
import TrackGrievancesScreen from "./screens/TrackGrievancesScreen";
import GrievanceHistoryScreen from "./screens/GrievanceHistoryScreen";
import GrievanceDetailsScreen from "./screens/GrievanceDetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

/**
 * Main App Component
 * Defines the navigation stack for the application.
 * Initial Route: Welcome
 */
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="SubmitGrievance"
            component={SubmitGrievanceScreen}
          />
          <Stack.Screen
            name="TrackGrievances"
            component={TrackGrievancesScreen}
          />
          <Stack.Screen
            name="GrievanceHistory"
            component={GrievanceHistoryScreen}
          />
          <Stack.Screen
            name="GrievanceDetails"
            component={GrievanceDetailsScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
