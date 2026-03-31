import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOrderHistory } from "./api";
export default function OrderHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const data = await getOrderHistory();
      setOrders(data);
    } catch (e) {
      console.log("Order history error:", e);
    } finally {
      setLoading(false);
    }
  };
  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return { color: "#43a047", bg: "#e8f5e9", icon: "checkmark-circle" };
      case "cancelled": return { color: "#e53935", bg: "#ffebee", icon: "close-circle" };
      case "placed": return { color: "#1e88e5", bg: "#e3f2fd", icon: "time" };
      default: return { color: "#fb8c00", bg: "#fff3e0", icon: "hourglass" };
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#ff5722" />
        <Text style={{ fontFamily: "PoppinsRegular", color: "#888", marginTop: 12 }}>Loading orders...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {orders.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Ionicons name="receipt-outline" size={60} color="#ddd" />
            <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#aaa", marginTop: 16 }}>
              No orders yet
            </Text>
            <Text style={{ fontFamily: "PoppinsRegular", fontSize: 13, color: "#bbb", marginTop: 8 }}>
              Your order history will appear here
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const isOpen = expanded === order.orderId;
            const sc = getStatusColor(order.status);
            return (
              <View key={order.orderId} style={styles.card}>
                <TouchableOpacity style={styles.cardTop} onPress={() => toggle(order.orderId)} activeOpacity={0.75}>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderId}>{order.orderId}</Text>
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={12} color="#aaa" />
                      <Text style={styles.dateText}>{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</Text>
                    </View>
                    {order.deliveryAddress && (
                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={12} color="#aaa" />
                        <Text style={styles.locationText}>{order.deliveryAddress}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.orderRight}>
                    <View style={[styles.statusChip, { backgroundColor: sc.bg }]}>
                      <Ionicons name={sc.icon} size={13} color={sc.color} />
                      <Text style={[styles.statusText, { color: sc.color }]}>{order.status}</Text>
                    </View>
                    <Text style={styles.totalAmt}>₹{order.total?.toFixed(0)}</Text>
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="#ccc" style={{ marginTop: 8 }} />
                  </View>
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.expandedBody}>
                    <Text style={styles.itemsTitle}>Items Ordered</Text>
                    {order.items?.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <View style={styles.itemDot} />
                        <Text style={styles.itemName}>{item.name} ×{item.quantity}</Text>
                        <Text style={styles.itemPrice}>₹{item.total?.toFixed(0)}</Text>
                      </View>
                    ))}
                    <View style={styles.billBox}>
                      <View style={styles.billRow}>
                        <Text style={styles.billKey}>Subtotal</Text>
                        <Text style={styles.billVal}>₹{order.subtotal?.toFixed(0)}</Text>
                      </View>
                      <View style={styles.billRow}>
                        <Text style={styles.billKey}>Tax</Text>
                        <Text style={styles.billVal}>₹{order.tax?.toFixed(0)}</Text>
                      </View>
                      <View style={styles.billRow}>
                        <Text style={styles.billKey}>Delivery Fee</Text>
                        <Text style={styles.billVal}>{order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`}</Text>
                      </View>
                      <View style={[styles.billRow, styles.billTotal]}>
                        <Text style={styles.billTotalKey}>Total Paid</Text>
                        <Text style={styles.billTotalVal}>₹{order.total?.toFixed(0)}</Text>
                      </View>
                    </View>
                    {order.paymentMethod && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Ionicons name="card-outline" size={14} color="#888" />
                        <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12, color: "#888" }}>
                          Paid via {order.paymentMethod}
                        </Text>
                      </View>
                    )}
                    {order.status !== "Cancelled" && (
                      <TouchableOpacity style={styles.reorderBtn}>
                        <Ionicons name="refresh-outline" size={16} color="#ff5722" />
                        <Text style={styles.reorderText}>Reorder</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 54, paddingHorizontal: 18, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0ece8", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },
  card: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 18, marginBottom: 14, elevation: 2, overflow: "hidden" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  orderMeta: { flex: 1 },
  orderId: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#1a1a2e", marginBottom: 5 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  dateText: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#888" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  locationText: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#888" },
  orderRight: { alignItems: "flex-end" },
  statusChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 6 },
  statusText: { fontFamily: "PoppinsMedium", fontSize: 11 },
  totalAmt: { fontFamily: "PoppinsBold", fontSize: 16, color: "#1a1a2e" },
  expandedBody: { borderTopWidth: 1, borderTopColor: "#f0ece8", paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  itemsTitle: { fontFamily: "PoppinsSemiBold", fontSize: 13, color: "#1a1a2e", marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5, gap: 8 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ff5722" },
  itemName: { flex: 1, fontFamily: "PoppinsRegular", fontSize: 13, color: "#444" },
  itemPrice: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#1a1a2e" },
  billBox: { backgroundColor: "#faf9f7", borderRadius: 12, padding: 12, marginTop: 12, marginBottom: 12 },
  billRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  billKey: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#888" },
  billVal: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#444" },
  billTotal: { borderTopWidth: 1, borderTopColor: "#e0dbd6", marginTop: 6, paddingTop: 8 },
  billTotalKey: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#1a1a2e" },
  billTotalVal: { fontFamily: "PoppinsBold", fontSize: 14, color: "#ff5722" },
  reorderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#ff5722", borderRadius: 12, paddingVertical: 10, gap: 6, backgroundColor: "#fff0eb" },
  reorderText: { fontFamily: "PoppinsSemiBold", fontSize: 13, color: "#ff5722" },
});