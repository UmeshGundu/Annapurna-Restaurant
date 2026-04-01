import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./api";

const TAG_COLORS = {
  Home: { bg: "#e8f5e9", icon: "#43a047" },
  Work: { bg: "#e3f2fd", icon: "#1e88e5" },
  Parents: { bg: "#fff3e0", icon: "#fb8c00" },
  Other: { bg: "#f3e5f5", icon: "#8e24aa" },
  House: { bg: "#e8f5e9", icon: "#43a047" },
  Office: { bg: "#e3f2fd", icon: "#1e88e5" },
};

const TAG_ICONS = {
  Home: "home",
  Work: "briefcase",
  Parents: "people",
  House: "home",
  Office: "briefcase",
  Other: "location",
};

export default function SavedAddressesScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload addresses every time this screen comes into focus
  // (covers the case when EditAddress screen calls onSave and pops back)
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (e) {
      console.log("Fetch addresses error:", e);
      Alert.alert("Error", "Could not load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Called by EditAddress screen via route params callback
  useEffect(() => {
    if (route?.params?.savedAddress) {
      handleSaveFromEditor(route.params.savedAddress);
      // Clear params so it doesn't re-trigger
      navigation.setParams({ savedAddress: undefined });
    }
  }, [route?.params?.savedAddress]);

  const handleSaveFromEditor = async (formData) => {
    try {
      if (formData.id && formData.id !== null) {
        await updateAddress(formData.id, formData);
      } else {
        await addAddress(formData);
      }
      fetchAddresses();
    } catch (e) {
      Alert.alert("Error", e.message || "Could not save address.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updated = await setDefaultAddress(id);
      setAddresses(updated);
    } catch (e) {
      Alert.alert("Error", e.message || "Could not set default address.");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting ID:", id);

      await deleteAddress(Number(id));   // 🔥 ensure number
      await fetchAddresses();            // 🔥 refresh list

      Alert.alert("Success", "Address deleted successfully");
    } catch (e) {
      console.log("Delete error:", e);
      Alert.alert("Error", e.message || "Could not delete address.");
    }
  };

  const openAddNew = () => {
    navigation.navigate("EditAddress", {
      address: null,
      onSave: handleSaveFromEditor,
    });
  };

  const openEdit = (addr) => {
    navigation.navigate("EditAddress", {
      address: {
        id: addr.id,
        tag: addr.tag || "Other",
        tagIcon: addr.tagIcon || "📍",
        name: addr.name || "",
        phone: addr.phone || "",
        line1: addr.line1 || "",
        line2: addr.line2 || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        isDefault: addr.isDefault || false,
      },
      onSave: handleSaveFromEditor,
    });
  };

  const colors = (tag) => TAG_COLORS[tag] || TAG_COLORS["Other"];
  const iconName = (tag) => TAG_ICONS[tag] || "location";

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#ff5722" />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={52} color="#ddd" />
            <Text style={styles.emptyTitle}>No addresses saved</Text>
            <Text style={styles.emptySubtitle}>Add a delivery address to get started</Text>
          </View>
        ) : (
          addresses.map((addr) => {
            const c = colors(addr.tag);
            return (
              <View
                key={addr.id}
                style={[styles.card, addr.isDefault && styles.cardDefault]}
              >
                {/* TAG ROW */}
                <View style={styles.cardTop}>
                  <View style={[styles.tagChip, { backgroundColor: c.bg }]}>
                    <Ionicons name={iconName(addr.tag)} size={13} color={c.icon} />
                    <Text style={[styles.tagText, { color: c.icon }]}>
                      {addr.tag || "Other"}
                    </Text>
                  </View>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="checkmark-circle" size={12} color="#ff5722" />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>

                {/* ADDRESS BODY */}
                <Text style={styles.addrName}>{addr.name || ""}</Text>
                {addr.line1 ? (
                  <Text style={styles.addrLine}>{`${addr.line1},`}</Text>
                ) : null}
                {addr.line2 ? (
                  <Text style={styles.addrLine}>{`${addr.line2},`}</Text>
                ) : null}
                <Text style={styles.addrLine}>
                  {`${addr.city || ""}, ${addr.state || ""} – ${addr.pincode || ""}`}
                </Text>
                {addr.phone ? (
                  <View style={styles.phoneRow}>
                    <Ionicons name="call-outline" size={13} color="#888" />
                    <Text style={styles.phoneText}>{addr.phone || ""}</Text>
                  </View>
                ) : null}

                {/* ACTIONS */}
                <View style={styles.actionRow}>
                  {!addr.isDefault && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleSetDefault(addr.id)}
                    >
                      <Ionicons name="radio-button-on-outline" size={15} color="#ff5722" />
                      <Text style={styles.actionText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => openEdit(addr)}
                  >
                    <Ionicons name="create-outline" size={15} color="#1a1a2e" />
                    <Text style={[styles.actionText, { color: "#1a1a2e" }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      console.log("Delete clicked:", addr.id);
                      handleDelete(addr.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#e53935" />
                    <Text style={[styles.actionText, { color: "#e53935" }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ADD NEW ADDRESS BUTTON */}
      <View style={styles.addBtnWrapper}>
        <TouchableOpacity style={styles.addBtn} onPress={openAddNew}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },

  loadingText: {
    fontFamily: "PoppinsRegular",
    color: "#888",
    marginTop: 12,
    fontSize: 13,
  },

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

  emptyBox: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    color: "#aaa",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
  },

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

  addrName: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#1a1a2e",
    marginBottom: 3,
  },
  addrLine: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
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