import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Successup({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={44} color="#fff" />
      </View>
      <Text style={styles.title}>Signup Successful</Text>
      <Text style={styles.subtitle}>
        Welcome to Annapurna Restaurant. Let's get started!
      </Text>
      {/* <Text style={styles.redirectText}>Redirecting to home...</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ff5722",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  redirectText: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#bbb",
    letterSpacing: 0.3,
  },
});
