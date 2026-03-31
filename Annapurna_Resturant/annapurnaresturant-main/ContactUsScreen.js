import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ContactUsScreen({ navigation }) {
  const contacts = [
    {
      icon: "call-outline",
      label: "Phone",
      value: "+91 98765 43210",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: "support@annapurna.com",
    },
    {
      icon: "location-outline",
      label: "Location",
      value: "Hyderabad, India",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* CONTACT CARD */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            {contacts.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  index < contacts.length - 1 && styles.borderBottom,
                ]}
              >
                <View style={styles.left}>
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon} size={18} color="#ff5722" />
                  </View>

                  <View>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* SUPPORT NOTE */}
        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={18} color="#ff5722" />
          <Text style={styles.infoText}>
            Our support team is available from 9 AM to 9 PM.
          </Text>
        </View>
      </ScrollView>
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

  /* SECTION */
  section: {
    marginHorizontal: 16,
    marginBottom: 18,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    overflow: "hidden",
  },

  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0ece8",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#888",
  },

  value: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#1a1a2e",
  },

  /* INFO CARD */
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0eb",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    gap: 10,
  },

  infoText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#ff5722",
    flex: 1,
  },
});