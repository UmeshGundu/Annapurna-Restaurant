import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import logotp from "./assets/logotp.png";
import { sendOtp, verifyOtp, register } from "./api"; export default function OTP({ navigation, route }) {
  const { mobile, username, password } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]); const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1].focus();
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  const handleResend = async () => {
    if (!mobile) { Alert.alert("Error", "Mobile number not found"); return; }
    try {
      await sendOtp(mobile);
      Alert.alert("OTP Sent", "A new OTP has been sent to your mobile number.");
    } catch (e) {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };
  const handleSubmit = async () => {
    if (otp.includes("")) { Alert.alert("Error", "Please enter complete OTP"); return; }
    const otpString = otp.join("");
    setLoading(true);
    try {
      // If no mobile (came from forgot password), just navigate to success
      if (!mobile) {
        navigation.navigate("Success");
        return;
      }
      const response = await verifyOtp(mobile, otpString); if (response.success) {
        // 🔥 REGISTER USER AFTER OTP SUCCESS
        await register(username, mobile, password);
        navigation.navigate("Successup");
      } else {
        Alert.alert("Invalid OTP", response.message || "Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "Could not verify OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={logotp} style={styles.image} />
      </View>
      <View style={styles.otpIconCircle}>
        <Text style={styles.otpEmoji}>🔐</Text>
      </View>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{"\n"}{mobile || "your registered number"}.
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.otpBox, digit !== "" && styles.otpBoxFilled]}
            maxLength={1} keyboardType="numeric" value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <Text style={styles.resend}>
        Didn't receive the code?{" "}
        <Text style={styles.resendAccent} onPress={handleResend}>Resend</Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <>
            <Text style={styles.buttonText}>Verify & Continue</Text>
            <Text style={{ color: "#fff", fontSize: 16, marginLeft: 8 }}>→</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#faf9f7", padding: 24 },
  imageContainer: { alignItems: "center", marginBottom: 4 },
  image: { width: 180, height: 130, resizeMode: "contain" },
  otpIconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#fff0eb", justifyContent: "center", alignItems: "center", marginBottom: 18 },
  otpEmoji: { fontSize: 30 },
  title: { fontSize: 22, fontFamily: "PoppinsBold", color: "#1a1a2e", marginBottom: 8 },
  subtitle: { fontSize: 13.5, fontFamily: "PoppinsRegular", color: "#888", marginBottom: 28, textAlign: "center", lineHeight: 20, paddingHorizontal: 10 },
  otpContainer: { flexDirection: "row", gap: 10, marginBottom: 24 },
  otpBox: { width: 46, height: 54, borderWidth: 1.5, borderColor: "#ede8e4", backgroundColor: "#fff", borderRadius: 14, textAlign: "center", fontSize: 20, fontFamily: "PoppinsBold", color: "#1a1a2e", elevation: 2 },
  otpBoxFilled: { borderColor: "#ff5722", backgroundColor: "#fff0eb" },
  resend: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#888", marginBottom: 28 },
  resendAccent: { fontFamily: "PoppinsSemiBold", color: "#ff5722" },
  button: { backgroundColor: "#ff5722", paddingVertical: 16, paddingHorizontal: 40, borderRadius: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", elevation: 4, width: "100%", minHeight: 54 },
  buttonText: { color: "#fff", fontFamily: "PoppinsSemiBold", fontSize: 15, letterSpacing: 0.4 },
});