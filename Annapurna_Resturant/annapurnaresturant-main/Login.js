import React, { useState } from "react";
import {
  View, Text, Image, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logotp from "./assets/logotp.png";
import { login } from "./api";
export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Error", "Please enter all details");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      Alert.alert("Error", "Enter valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await login(mobile, password);
      if (response.success) {
        navigation.navigate("Success");
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server. Check your network.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image source={logotp} style={styles.image} />
            </View>
            <View style={styles.tabs}>
              <View style={styles.activeTabWrap}>
                <Text style={styles.activeTab}>Login</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.inactiveTab}>Sign up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="#bbb"
                style={styles.input}
                value={mobile}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^0-9]/g, "");
                  if (filtered.length <= 10) setMobile(filtered);
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#bbb"
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ paddingRight: 4 }}>
                <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={18} color="#aaa" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Otpscreen")} style={{ alignSelf: "flex-end" }}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Login</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.signupLink}>
              Don't have an account?{" "}
              <Text style={styles.signupLinkAccent} onPress={() => navigation.navigate("Signup")}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7", padding: 24 },
  content: { flex: 1, paddingTop: 30 },
  imageContainer: { alignItems: "center", marginBottom: 8 },
  image: { width: 220, height: 160, resizeMode: "contain" },
  tabs: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 32, marginBottom: 28 },
  activeTabWrap: { borderBottomWidth: 2, borderColor: "#ff5722", paddingBottom: 4 },
  activeTab: { fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#ff5722" },
  inactiveTab: { fontFamily: "PoppinsMedium", fontSize: 16, color: "#bbb", paddingBottom: 4 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4,
    marginBottom: 14, borderWidth: 1, borderColor: "#ede8e4", elevation: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: "PoppinsRegular", fontSize: 14, color: "#1a1a2e", paddingVertical: 13 },
  forgot: { fontFamily: "PoppinsMedium", color: "#ff5722", fontSize: 12.5, marginBottom: 22, marginTop: 2 },
  loginBtn: {
    backgroundColor: "#ff5722", paddingVertical: 16, borderRadius: 18,
    alignItems: "center", flexDirection: "row", justifyContent: "center",
    elevation: 4, marginBottom: 20, minHeight: 54,
  },
  loginText: { color: "#fff", fontFamily: "PoppinsSemiBold", fontSize: 15, letterSpacing: 0.4 },
  signupLink: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#888", textAlign: "center", marginTop: 4 },
  signupLinkAccent: { fontFamily: "PoppinsSemiBold", color: "#ff5722" },
});