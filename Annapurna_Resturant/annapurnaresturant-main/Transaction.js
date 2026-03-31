import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { placeOrder, processPayment } from "./api";
const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "phone-portrait-outline" },
  { id: "card", label: "Credit / Debit Card", icon: "card-outline" },
  { id: "cod", label: "Cash on Delivery", icon: "cash-outline" },
];
export default function Transaction({ navigation, route }) {
  const total = route?.params?.total || 320;
  const { clearCart } = useContext(CartContext);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    // Basic validation
    if (selectedMethod === "upi" && !upiId.trim()) {
      Alert.alert("Validation", "Please enter your UPI ID");
      return;
    }
    if (selectedMethod === "card" && (!cardNumber || !cardName || !expiry || !cvv)) {
      Alert.alert("Validation", "Please fill all card details");
      return;
    }
    setLoading(true);
    try {
      // Step 1: Place the order in the database
      const orderData = await placeOrder(
        selectedMethod.toUpperCase(),
        "Default Address",
        parseFloat(total)
      );
      // Step 2: Process payment (simulated)
      await processPayment({
        paymentMethod: selectedMethod,
        amount: parseFloat(total),
        orderId: orderData.id,
        upiId: selectedMethod === "upi" ? upiId : null,
        cardNumber: selectedMethod === "card" ? cardNumber : null,
      });
      // Step 3: Clear the cart
      await clearCart();
      // Step 4: Navigate to success
      navigation.navigate("OrderSuccess");
    } catch (error) {
      Alert.alert("Payment Failed", error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 38 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹{total}</Text>
          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark" size={13} color="#4caf50" />
            <Text style={styles.secureText}>Secured Payment</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>Select Payment Method</Text>
        <View style={styles.methodsCard}>
          {PAYMENT_METHODS.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodRow, i < PAYMENT_METHODS.length - 1 && styles.methodBorder, selectedMethod === m.id && styles.methodRowActive]}
              onPress={() => setSelectedMethod(m.id)}
            >
              <View style={[styles.methodIconBox, selectedMethod === m.id && styles.methodIconBoxActive]}>
                <Ionicons name={m.icon} size={18} color={selectedMethod === m.id ? "#fff" : "#ff5722"} />
              </View>
              <Text style={[styles.methodLabel, selectedMethod === m.id && styles.methodLabelActive]}>{m.label}</Text>
              <View style={[styles.radio, selectedMethod === m.id && styles.radioActive]}>
                {selectedMethod === m.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {selectedMethod === "upi" && (
          <View style={styles.fieldsCard}>
            <Text style={styles.fieldTitle}>Enter UPI ID</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="at" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput placeholder="yourname@upi" placeholderTextColor="#bbb" style={styles.input}
                value={upiId} onChangeText={setUpiId} autoCapitalize="none" />
            </View>
          </View>
        )}
        {selectedMethod === "card" && (
          <View style={styles.fieldsCard}>
            <Text style={styles.fieldTitle}>Card Details</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput placeholder="Card Number" placeholderTextColor="#bbb" style={styles.input}
                value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" maxLength={19} />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput placeholder="Name on Card" placeholderTextColor="#bbb" style={styles.input}
                value={cardName} onChangeText={setCardName} />
            </View>
            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                <Ionicons name="calendar-outline" size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput placeholder="MM/YY" placeholderTextColor="#bbb" style={styles.input}
                  value={expiry} onChangeText={setExpiry} keyboardType="numeric" maxLength={5} />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput placeholder="CVV" placeholderTextColor="#bbb" style={styles.input}
                  value={cvv} onChangeText={setCvv} keyboardType="numeric" maxLength={3} secureTextEntry />
              </View>
            </View>
          </View>
        )}
        {selectedMethod === "cod" && (
          <View style={styles.codCard}>
            <Ionicons name="information-circle-outline" size={20} color="#ff5722" />
            <Text style={styles.codText}>
              Please keep exact change ready at the time of delivery.
            </Text>
          </View>
        )}
        <Text style={styles.sectionLabel}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{Math.round(total / 1.1)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>₹{Math.round(total - total / 1.1)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, { color: "#4caf50" }]}>FREE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
          {loading ? (
            <Text style={styles.payBtnText}>Processing...</Text>
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.payBtnText}>Pay ₹{total}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 54, paddingHorizontal: 18, marginBottom: 20 },
  headerTitle: { fontSize: 17, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },
  iconCircle: { padding: 8, borderRadius: 22, backgroundColor: "#f0ece8", elevation: 2 },
  amountCard: { backgroundColor: "#1a1a2e", marginHorizontal: 16, borderRadius: 22, padding: 22, alignItems: "center", marginBottom: 24, elevation: 4 },
  amountLabel: { fontFamily: "PoppinsRegular", fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 6 },
  amountValue: { fontFamily: "PoppinsBold", fontSize: 38, color: "#fff", letterSpacing: 1 },
  secureRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 5 },
  secureText: { fontFamily: "PoppinsRegular", fontSize: 11, color: "#4caf50" },
  sectionLabel: { fontFamily: "PoppinsSemiBold", fontSize: 12, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginHorizontal: 20, marginBottom: 10 },
  methodsCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 18, elevation: 2, marginBottom: 16, overflow: "hidden" },
  methodRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  methodBorder: { borderBottomWidth: 1, borderBottomColor: "#f0ece8" },
  methodRowActive: { backgroundColor: "#fff8f6" },
  methodIconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#fff0eb", justifyContent: "center", alignItems: "center" },
  methodIconBoxActive: { backgroundColor: "#ff5722" },
  methodLabel: { flex: 1, fontFamily: "PoppinsMedium", fontSize: 14, color: "#555" },
  methodLabelActive: { color: "#1a1a2e", fontFamily: "PoppinsSemiBold" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#ddd", justifyContent: "center", alignItems: "center" },
  radioActive: { borderColor: "#ff5722" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#ff5722" },
  fieldsCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 18, padding: 16, elevation: 2, marginBottom: 16 },
  fieldTitle: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#1a1a2e", marginBottom: 12 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#faf9f7", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 2, marginBottom: 10, borderWidth: 1, borderColor: "#ede8e4" },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontFamily: "PoppinsRegular", fontSize: 14, color: "#1a1a2e", paddingVertical: 11 },
  rowInputs: { flexDirection: "row" },
  codCard: { flexDirection: "row", backgroundColor: "#fff0eb", marginHorizontal: 16, borderRadius: 14, padding: 14, gap: 10, marginBottom: 16, borderWidth: 1, borderColor: "#ffd5c8", alignItems: "flex-start" },
  codText: { flex: 1, fontFamily: "PoppinsRegular", fontSize: 13, color: "#555", lineHeight: 20 },
  summaryCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 18, padding: 18, elevation: 2, marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontFamily: "PoppinsRegular", fontSize: 13.5, color: "#888" },
  summaryValue: { fontFamily: "PoppinsMedium", fontSize: 13.5, color: "#1a1a2e" },
  divider: { height: 1, backgroundColor: "#f0ece8", marginVertical: 10 },
  totalLabel: { fontFamily: "PoppinsSemiBold", fontSize: 15, color: "#1a1a2e" },
  totalValue: { fontFamily: "PoppinsBold", fontSize: 15, color: "#ff5722" },
  footer: { position: "absolute", bottom: 20, left: 16, right: 16 },
  payBtn: { backgroundColor: "#ff5722", paddingVertical: 17, borderRadius: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", elevation: 5 },
  payBtnText: { color: "#fff", fontFamily: "PoppinsSemiBold", fontSize: 15, letterSpacing: 0.4 },
});