import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation, route }) {
  const [profile, setProfile] = useState({
    name: "Annapurna User",
    phone: "+91 98765 43210",
    email: "",
    dob: "",
    gender: "",
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Pick up changes saved from EditProfileScreen
  useEffect(() => {
    if (route?.params?.updatedProfile) {
      setProfile((prev) => ({ ...prev, ...route.params.updatedProfile }));
    }
  }, [route?.params?.updatedProfile]);

  const menuItems = [
    {
      section: "Account",
      items: [
        {
          icon: "person-outline",
          label: "Edit Profile",
          onPress: () =>
            navigation.navigate("EditProfile", { profile }),
        },
        {
          icon: "location-outline",
          label: "Saved Addresses",
          onPress: () => navigation.navigate("SavedAddresses"),
        },
        {
          icon: "heart-outline",
          label: "My Wishlist",
          onPress: () => navigation.navigate("Wishlist"),
        },
        {
          icon: "receipt-outline",
          label: "Order History",
          onPress: () => navigation.navigate("OrderHistory"),
        },
      ],
    },
    {
      section: "Preferences",
      items: [
        { icon: "notifications-outline", label: "Notifications", toggle: true },
        {
          icon: "language-outline",
          label: "Language",
          value: "English",
          onPress: () => {},
        },
      ],
    },
    {
      section: "Support",
      items: [
        { icon: "help-circle-outline",   label: "Help & FAQ",      onPress: () => {} },
        { icon: "chatbubble-outline",     label: "Contact Us",      onPress: () => {} },
        { icon: "star-outline",           label: "Rate the App",    onPress: () => {} },
        { icon: "document-text-outline",  label: "Privacy Policy",  onPress: () => {} },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="cart-outline" size={20} color="#1a1a2e" />
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => navigation.navigate("EditProfile", { profile })}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profilePhone}>{profile.phone}</Text>
            {profile.email ? (
              <Text style={styles.profileEmail}>{profile.email}</Text>
            ) : null}
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={11} color="#ff5722" />
              <Text style={styles.memberText}>Regular Member</Text>
            </View>
          </View>
        </View>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₹840</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* MENU SECTIONS */}
        {menuItems.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.section}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[
                    styles.menuRow,
                    ii < section.items.length - 1 && styles.menuRowBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={item.toggle ? 1 : 0.6}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIconBox}>
                      <Ionicons name={item.icon} size={18} color="#ff5722" />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>

                  <View style={styles.menuRight}>
                    {item.toggle ? (
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: "#e0dbd6", true: "#ffcabc" }}
                        thumbColor={notificationsEnabled ? "#ff5722" : "#bbb"}
                      />
                    ) : item.value ? (
                      <Text style={styles.menuValue}>{item.value}</Text>
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-out-outline" size={20} color="#ff5722" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Annapurna Restaurant</Text>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.6)" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("Wishlist")}
        >
          <Ionicons name="heart-outline" size={22} color="rgba(255,255,255,0.6)" />
          <Text style={styles.footerLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={22} color="rgba(255,255,255,0.6)" />
          <Text style={styles.footerLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn}>
          <Ionicons name="person" size={22} color="#ff5722" />
          <Text style={[styles.footerLabel, { color: "#ff5722" }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },
  iconCircle: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#f0ece8",
    elevation: 2,
  },

  // PROFILE CARD
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 18,
    elevation: 3,
    marginBottom: 14,
  },
  avatarWrapper: { position: "relative", marginRight: 16 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ff5722",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontFamily: "PoppinsBold", fontSize: 28, color: "#fff" },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#1a1a2e" },
  profilePhone: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  profileEmail: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#aaa",
    marginTop: 1,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#fff0eb",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  memberText: { fontFamily: "PoppinsMedium", fontSize: 11, color: "#ff5722" },

  // STATS
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    marginHorizontal: 16,
    borderRadius: 22,
    paddingVertical: 18,
    marginBottom: 22,
    elevation: 4,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: { fontFamily: "PoppinsBold", fontSize: 20, color: "#fff" },
  statLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 4,
  },

  // MENU SECTIONS
  section: { marginHorizontal: 16, marginBottom: 18 },
  sectionLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 12,
    color: "#aaa",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 2,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f0ece8" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { fontFamily: "PoppinsMedium", fontSize: 14, color: "#1a1a2e" },
  menuRight: { flexDirection: "row", alignItems: "center" },
  menuValue: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    color: "#aaa",
    marginRight: 6,
  },

  // LOGOUT
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#ff5722",
    backgroundColor: "#fff0eb",
    gap: 8,
    marginBottom: 16,
  },
  logoutText: { fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#ff5722" },

  version: {
    fontFamily: "PoppinsRegular",
    fontSize: 11,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#1a1a2e",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 4,
    elevation: 16,
  },
  footerBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  footerLabel: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "PoppinsRegular",
    fontSize: 10,
    marginTop: 3,
  },
});
