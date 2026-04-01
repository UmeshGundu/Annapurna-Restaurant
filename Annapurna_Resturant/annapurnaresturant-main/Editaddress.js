
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ✅ VALIDATION FUNCTIONS
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone); // strict 10-digit Indian number
}

function isValidPincode(pin) {
  return /^\d{6}$/.test(pin); // strict 6-digit
}

const TAG_STYLES = {
  Home: { bg: "#e8f5e9", color: "#43a047" },
  Work: { bg: "#e3f2fd", color: "#1e88e5" },
  Parents: { bg: "#fff3e0", color: "#fb8c00" },
  Other: { bg: "#f3e5f5", color: "#8e24aa" },
  House: { bg: "#e8f5e9", color: "#43a047" },
  Office: { bg: "#e3f2fd", color: "#1e88e5" },
};

const TAG_ICONS = {
  Home: "🏠",
  Work: "💼",
  Parents: "👨‍👩‍👧",
  House: "🏠",
  Office: "💼",
  Other: "📍",
};

const TAG_OPTIONS = ["Home", "Work", "Parents", "House", "Office", "Other"];

const EMPTY_FORM = {
  id: null,
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  tag: "Other",
  instructions: "",
  isDefault: false,
};

// FIELD COMPONENT
function Field({ label, value, onChangeText, error, placeholder, keyboardType, maxLength }) {
  return (
    <View style={styles.fieldWrapper}>

      {label ? (
        <Text style={styles.fieldLabel}>{String(label)}</Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        keyboardType={keyboardType || "default"}
        maxLength={maxLength}
        style={[styles.input, error ? styles.inputError : null]}
      />

      {error ? (
        <Text style={styles.errText}>{String(error)}</Text>
      ) : null}

    </View>
  );
}

// MAIN SCREEN
export default function EditAddress({ navigation, route }) {
  const { address, onSave } = route.params || {};
  const isNew = !address;

  const [form, setForm] = useState(address ? { ...address } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  // ✅ VALIDATION
  const validate = () => {
    const e = {};
    const cleanedPhone = form.phone.replace(/\D/g, "");

    if (!form.name.trim()) e.name = "Required";

    if (!cleanedPhone) {
      e.phone = "Required";
    } else if (!isValidPhone(cleanedPhone)) {
      e.phone = "Enter valid 10-digit mobile number";
    }

    if (!form.line1.trim()) e.line1 = "Required";

    if (!form.city.trim()) e.city = "Required";

    if (!form.pincode) {
      e.pincode = "Required";
    } else if (!isValidPincode(form.pincode)) {
      e.pincode = "Enter valid 6-digit pincode";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // SAVE
  const handleSave = () => {
    if (!validate()) return;

    const cleanedPhone = form.phone.replace(/\D/g, "");

    const saved = {
      id: form.id || null,   // 🔥 important
      name: form.name,
      phone: cleanedPhone,
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      tag: form.tag,
      isDefault: form.isDefault ?? false,
    };

    onSave && onSave(saved);
    navigation.goBack();
  };

  const isValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.line1.trim() &&
    form.city.trim() &&
    form.pincode.trim();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isNew ? "Add New Address" : "Edit Address"}
        </Text>

        <View style={{ width: 36 }} ></View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Receiver */}
          <Text style={styles.sectionTitle}>Receiver Details</Text>
          <View style={styles.card}>
            <Field
              label="FULL NAME"
              value={form.name}
              onChangeText={(v) => set("name", v)}
              error={errors.name}
              placeholder="Enter name"
            />

            <Field
              label="PHONE NUMBER"
              value={form.phone}
              onChangeText={(v) => set("phone", v.replace(/[^0-9]/g, ""))}
              error={errors.phone}
              placeholder="9876543210"
              keyboardType="number-pad"
              maxLength={10} // ✅ restrict to 10 digits
            />
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.card}>
            <Field
              label="ADDRESS LINE"
              value={form.line1}
              onChangeText={(v) => set("line1", v)}
              error={errors.line1}
              placeholder="Flat / Street"
            />

            <Field
              label="CITY"
              value={form.city}
              onChangeText={(v) => set("city", v)}
              error={errors.city}
              placeholder="City"
            />

            <Field
              label="STATE"
              value={form.state}
              onChangeText={(v) => set("state", v)}
              placeholder="State"
            />

            <Field
              label="PINCODE"
              value={form.pincode}
              onChangeText={(v) => set("pincode", v.replace(/[^0-9]/g, ""))}
              error={errors.pincode}
              placeholder="500034"
              keyboardType="number-pad"
              maxLength={6} // ✅ restrict to 6 digits
            />
          </View>

          {/* SAVE */}
          <TouchableOpacity
            style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>
              {isNew ? "Save Address" : "Update Address"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// STYLES (UNCHANGED)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 18,
    marginBottom: 10,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a2e",
  },

  formContent: {
    padding: 16,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginTop: 14,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },

  fieldWrapper: { marginBottom: 12 },

  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#e0dbd5",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
  },

  inputError: { borderColor: "#e53935" },

  errText: { fontSize: 11, color: "#e53935", marginTop: 3 },

  saveBtn: {
    backgroundColor: "#ff5722",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },

  saveBtnDisabled: { opacity: 0.45 },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});