import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RateAppScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Our App</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* CARD */}
      <View style={styles.card}>
        
        {/* ICON */}
        <View style={styles.iconWrapper}>
          <Ionicons name="star" size={28} color="#ff5722" />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Enjoying Annapurna?</Text>

        {/* DESCRIPTION */}
        <Text style={styles.text}>
          If you love using our app, please take a moment to rate us. Your
          feedback helps us improve!
        </Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Rate Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 54,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0ece8",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    elevation: 3,
  },

  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 18,
    color: "#1a1a2e",
    marginBottom: 6,
  },

  text: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: "#ff5722",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    elevation: 2,
  },

  buttonText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#fff",
  },
});