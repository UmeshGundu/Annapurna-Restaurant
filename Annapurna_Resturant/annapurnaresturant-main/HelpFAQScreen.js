import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpFAQScreen({ navigation }) {
  const faqs = [
    {
      question: "How to place an order?",
      answer: "Browse items → Add to cart → Checkout → Confirm order.",
    },
    {
      question: "How to track my order?",
      answer: "Go to Profile → Order History → Select order.",
    },
    {
      question: "Payment issues?",
      answer: "Try again or contact support.",
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
          <Text style={styles.headerTitle}>Help & FAQ</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* FAQ LIST */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            {faqs.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.faqItem,
                  index < faqs.length - 1 && styles.borderBottom,
                ]}
              >
                <View style={styles.questionRow}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="help-circle-outline"
                      size={18}
                      color="#ff5722"
                    />
                  </View>
                  <Text style={styles.question}>{item.question}</Text>
                </View>

                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ))}
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

  /* HEADER (same as profile) */
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

  faqItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0ece8",
  },

  questionRow: {
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

  question: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    color: "#1a1a2e",
    flex: 1,
  },

  answer: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#888",
    marginLeft: 44,
  },
});