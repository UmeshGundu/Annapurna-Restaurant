import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderSuccess({ navigation }) {
  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animate icon pop
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Fade + slide text in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto redirect after 4 seconds
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { icon: "checkmark-circle", label: "Order Placed",      color: "#4caf50" },
    { icon: "restaurant",       label: "Preparing Food",    color: "#ff9800" },
    { icon: "bicycle",          label: "Out for Delivery",  color: "#2196f3" },
    { icon: "home",             label: "Delivered",         color: "#9e9e9e" },
  ];

  return (
    <View style={styles.container}>

      {/* SUCCESS ICON */}
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <Ionicons name="checkmark" size={50} color="#fff" />
          </View>
        </View>
      </Animated.View>

      {/* TEXT */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center" }}>
        <Text style={styles.title}>Order Placed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully.{"\n"}Sit back and relax!
        </Text>

        {/* ORDER ID */}
        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>#ANN{Math.floor(10000 + Math.random() * 90000)}</Text>
        </View>

        {/* ESTIMATED TIME */}
        <View style={styles.etaCard}>
          <Ionicons name="time-outline" size={22} color="#ff5722" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.etaLabel}>Estimated Delivery</Text>
            <Text style={styles.etaValue}>30 – 45 minutes</Text>
          </View>
        </View>

        {/* DELIVERY STEPS */}
        <View style={styles.stepsRow}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: i === 0 ? step.color : "#f0ece8" }]}>
                <Ionicons
                  name={step.icon}
                  size={16}
                  color={i === 0 ? "#fff" : "#bbb"}
                />
              </View>
              {i < steps.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: i === 0 ? "#4caf50" : "#e0dbd6" }]} />
              )}
              <Text style={[styles.stepLabel, i === 0 && { color: "#4caf50", fontFamily: "PoppinsSemiBold" }]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.redirectText}>Returning to home in a moment...</Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },

  // ICON
  iconWrapper: {
    marginBottom: 28,
  },
  iconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(76,175,80,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  // TEXT
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 26,
    color: "#1a1a2e",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
  },

  // ORDER ID
  orderIdBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    gap: 10,
  },
  orderIdLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#aaa",
  },
  orderIdValue: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
    color: "#ff5722",
  },

  // ETA
  etaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 22,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: "#ff5722",
  },
  etaLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#aaa",
  },
  etaValue: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    color: "#1a1a2e",
    marginTop: 2,
  },

  // STEPS
  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 30,
    width: "100%",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepLine: {
    position: "absolute",
    top: 18,
    left: "50%",
    width: "100%",
    height: 2,
    zIndex: -1,
  },
  stepLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 10,
    color: "#bbb",
    textAlign: "center",
  },

  redirectText: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#ccc",
    letterSpacing: 0.3,
  },
});
