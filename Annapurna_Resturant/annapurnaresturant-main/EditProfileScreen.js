import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// Add at the top of EditProfileScreen.js
import { updateProfile } from "./api";


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/.test(email.trim());
}

function Field({
  label, icon, value, onChangeText, onBlur,
  placeholder, keyboardType = "default", error,
}) {
  const hasError = !!error;
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, hasError && styles.inputRowError]}>
        <Ionicons
          name={icon}
          size={17}
          color={hasError ? "#e53935" : "#ff5722"}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          keyboardType={keyboardType}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {hasError ? (
          <Ionicons name="alert-circle" size={16} color="#e53935" style={{ marginLeft: 6 }} />
        ) : value.trim().length > 0 ? (
          <Ionicons name="checkmark-circle" size={16} color="#43a047" style={{ marginLeft: 6 }} />
        ) : null}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ─────────────────────────────────────────────
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

// ─────────────────────────────────────────────
export default function EditProfileScreen({ navigation, route }) {
  const existing = route?.params?.profile || {};

  const [name, setName] = useState(existing.name || "Annapurna User");
  const [phone, setPhone] = useState(existing.phone || "+91 98765 43210");
  const [email, setEmail] = useState(existing.email || "");
  const [gender, setGender] = useState(existing.gender || "");

  const [dob, setDob] = useState(existing.dob || "");
  const [showPicker, setShowPicker] = useState(false);
  const [dobErr, setDobErr] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);

  const emailErr = emailTouched && email.trim().length > 0 && !isValidEmail(email)
    ? "Enter a valid email (e.g. you@example.com)"
    : "";

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();

      const formatted = `${day}/${month}/${year}`;
      setDob(formatted);

      setDobErr(""); // no error if selected
    }
  };



  // Replace the handleSave function:
  const handleSave = async () => {
    setEmailTouched(true);
    if (!name.trim()) { Alert.alert("Validation", "Name cannot be empty."); return; }
    if (email.trim().length > 0 && !isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address."); return;
    }
    if (!dob) { Alert.alert("Invalid Date", "Please select your date of birth"); return; }

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        dob: dob,
        gender,
        phone: phone.trim(),
      });
    } catch (e) {
      // Still navigate even if backend fails (offline mode)
      console.log("Profile update error:", e);
    }

    navigation.navigate("Profile", {
      updatedProfile: { name: name.trim(), phone: phone.trim(), email: email.trim(), dob, gender },
    });
  };

  if (!dob) {
    Alert.alert("Invalid Date", "Please select your date of birth");
    return;
  }

  navigation.navigate("Profile", {
    updatedProfile: {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      dob: dob,
      gender,
    },
  });


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.trim().charAt(0).toUpperCase() || "A"}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.changePhotoLabel}>Change Photo</Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          <Field
            label="Full Name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <View style={styles.divider} />

          <Field
            label="Phone Number"
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
          />
          <View style={styles.divider} />

          <Field
            label="Email Address"
            icon="mail-outline"
            value={email}
            onChangeText={(t) => { setEmail(t); }}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={emailErr}
          />
          <View style={styles.divider} />

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>

            <TouchableOpacity
              style={[styles.inputRow, dobErr && styles.inputRowError]}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={17}
                color={dobErr ? "#e53935" : "#ff5722"}
                style={{ marginRight: 10 }}
              />

              <Text style={{ flex: 1, color: dob ? "#1a1a2e" : "#bbb" }}>
                {dob || "Select Date of Birth"}
              </Text>

              {dob ? (
                <Ionicons name="checkmark-circle" size={16} color="#43a047" />
              ) : null}
            </TouchableOpacity>

            <Text style={styles.hintText}>Tap to select your DOB</Text>

            {showPicker && (
              <DateTimePicker
                value={
                  dob
                    ? (() => {
                      const [d, m, y] = dob.split("/");
                      return new Date(y, m - 1, d);
                    })()
                    : new Date(2000, 0, 1)
                }
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>

        {/* GENDER */}
        <Text style={styles.sectionLabel}>GENDER</Text>
        <View style={styles.card}>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderChip, gender === g && styles.genderChipActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#f0ece8",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },

  avatarSection: { alignItems: "center", marginBottom: 28, position: "relative" },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "#ff5722",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontFamily: "PoppinsBold", fontSize: 36, color: "#fff" },
  changePhotoBtn: {
    position: "absolute", bottom: 26, right: "36%",
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#1a1a2e",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#faf9f7",
  },
  changePhotoLabel: { marginTop: 8, fontFamily: "PoppinsMedium", fontSize: 12, color: "#ff5722" },

  sectionLabel: {
    fontFamily: "PoppinsSemiBold", fontSize: 11, color: "#aaa",
    letterSpacing: 1, textTransform: "uppercase",
    marginBottom: 8, marginLeft: 20, marginTop: 10,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 18,
    marginHorizontal: 16, marginBottom: 14,
    elevation: 2, paddingHorizontal: 16, paddingVertical: 6,
  },
  divider: { height: 1, backgroundColor: "#f0ece8" },

  fieldWrapper: { paddingVertical: 14 },
  fieldLabel: {
    fontFamily: "PoppinsMedium", fontSize: 11, color: "#aaa",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderBottomWidth: 1.5, borderBottomColor: "transparent", paddingBottom: 4,
  },
  inputRowError: { borderBottomColor: "#e53935" },
  input: { flex: 1, fontFamily: "PoppinsRegular", fontSize: 14, color: "#1a1a2e", paddingVertical: 0 },
  errorText: { fontFamily: "PoppinsRegular", fontSize: 11, color: "#e53935", marginTop: 5 },
  hintText: { fontFamily: "PoppinsRegular", fontSize: 11, color: "#bbb", marginTop: 5 },

  genderRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingVertical: 14 },
  genderChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: "#e0dbd6", backgroundColor: "#faf9f7",
  },
  genderChipActive: { borderColor: "#ff5722", backgroundColor: "#fff0eb" },
  genderChipText: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#888" },
  genderChipTextActive: { color: "#ff5722" },

  saveBtn: {
    marginHorizontal: 16, marginTop: 8,
    backgroundColor: "#ff5722", borderRadius: 18,
    paddingVertical: 16, alignItems: "center", elevation: 4,
  },
  saveBtnText: { fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#fff" },
});
