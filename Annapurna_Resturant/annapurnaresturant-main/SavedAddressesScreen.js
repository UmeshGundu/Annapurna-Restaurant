import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const INITIAL_ADDRESSES = [
  {
    id: "1",
    tag: "Home",
    tagIcon: "home",
    name: "Annapurna User",
    line1: "Flat 4B, Sunshine Apartments",
    line2: "Road No. 5, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "2",
    tag: "Work",
    tagIcon: "briefcase",
    name: "Annapurna User",
    line1: "3rd Floor, Cyber Towers, Block B",
    line2: "HITEC City, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    phone: "+91 98765 43210",
    isDefault: false,
  },
  {
    id: "3",
    tag: "Parents",
    tagIcon: "people",
    name: "Ravi Kumar",
    line1: "H.No 12-4-56, Ashok Nagar",
    line2: "Near Water Tank, Old City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500024",
    phone: "+91 91234 56789",
    isDefault: false,
  },
  {
    id: "4",
    tag: "Other",
    tagIcon: "location",
    name: "Suresh Reddy",
    line1: "Plot 77, Sri Nagar Colony",
    line2: "Ameerpet",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500016",
    phone: "+91 99887 66554",
    isDefault: false,
  },
];

const TAG_COLORS = {
  Home:    { bg: "#e8f5e9", icon: "#43a047" },
  Work:    { bg: "#e3f2fd", icon: "#1e88e5" },
  Parents: { bg: "#fff3e0", icon: "#fb8c00" },
  Other:   { bg: "#f3e5f5", icon: "#8e24aa" },
};

export default function SavedAddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  const setDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const deleteAddress = (id) => {
    Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  const colors = (tag) => TAG_COLORS[tag] || TAG_COLORS["Other"];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {addresses.map((addr) => {
          const c = colors(addr.tag);
          return (
            <View key={addr.id} style={[styles.card, addr.isDefault && styles.cardDefault]}>
              {/* TAG ROW */}
              <View style={styles.cardTop}>
                <View style={[styles.tagChip, { backgroundColor: c.bg }]}>
                  <Ionicons name={addr.tagIcon} size={13} color={c.icon} />
                  <Text style={[styles.tagText, { color: c.icon }]}>{addr.tag}</Text>
                </View>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#ff5722" />
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>

              {/* ADDRESS BODY */}
              <Text style={styles.addrName}>{addr.name}</Text>
              <Text style={styles.addrLine}>{addr.line1},</Text>
              <Text style={styles.addrLine}>{addr.line2},</Text>
              <Text style={styles.addrLine}>
                {addr.city}, {addr.state} – {addr.pincode}
              </Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={13} color="#888" />
                <Text style={styles.phoneText}>{addr.phone}</Text>
              </View>

              {/* ACTIONS */}
              <View style={styles.actionRow}>
                {!addr.isDefault && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setDefault(addr.id)}>
                    <Ionicons name="radio-button-on-outline" size={15} color="#ff5722" />
                    <Text style={styles.actionText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="create-outline" size={15} color="#1a1a2e" />
                  <Text style={[styles.actionText, { color: "#1a1a2e" }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => deleteAddress(addr.id)}>
                  <Ionicons name="trash-outline" size={15} color="#e53935" />
                  <Text style={[styles.actionText, { color: "#e53935" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ADD NEW ADDRESS BUTTON */}
      <View style={styles.addBtnWrapper}>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0ece8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cardDefault: {
    borderColor: "#ff5722",
    backgroundColor: "#fffaf8",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: { fontFamily: "PoppinsMedium", fontSize: 12 },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff0eb",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  defaultText: { fontFamily: "PoppinsMedium", fontSize: 11, color: "#ff5722" },

  addrName: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#1a1a2e", marginBottom: 3 },
  addrLine: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#555", lineHeight: 20 },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  phoneText: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#888" },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0ece8",
    gap: 16,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#ff5722" },

  addBtnWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#faf9f7",
    borderTopWidth: 1,
    borderTopColor: "#f0ece8",
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#ff5722",
    borderRadius: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    elevation: 4,
  },
  addBtnText: { fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#fff" },
});
