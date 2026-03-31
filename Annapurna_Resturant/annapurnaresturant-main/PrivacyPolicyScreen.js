import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicyScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* INTRO CARD */}
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="shield-checkmark-outline" size={26} color="#ff5722" />
          </View>

          <Text style={styles.title}>Your Privacy Matters</Text>

          <Text style={styles.text}>
            We respect your privacy. Your personal data is securely stored and
            never shared with third parties.
          </Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            
            <View style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color="#ff5722" />
                </View>
                <Text style={styles.heading}>Data Protection</Text>
              </View>
              <Text style={styles.description}>
                Your personal information is encrypted and protected with high security standards.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Ionicons name="analytics-outline" size={18} color="#ff5722" />
                </View>
                <Text style={styles.heading}>Minimal Data Collection</Text>
              </View>
              <Text style={styles.description}>
                We only collect essential data required for order processing and improving your experience.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Ionicons name="people-outline" size={18} color="#ff5722" />
                </View>
                <Text style={styles.heading}>No Third-Party Sharing</Text>
              </View>
              <Text style={styles.description}>
                Your data is never sold or shared with external parties.
              </Text>
            </View>

          </View>
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

  /* INTRO CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    elevation: 3,
    marginBottom: 18,
  },

  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
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
  },

  /* SECTION */
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    overflow: "hidden",
  },

  item: {
    padding: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#f0ece8",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    color: "#1a1a2e",
  },

  description: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#888",
    marginLeft: 44,
  },
});