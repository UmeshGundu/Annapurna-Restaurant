import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "./CartContext";

export default function CartScreen({ navigation }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Order</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* EMPTY STATE */}
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cart-outline" size={40} color="#ff5722" />
            </View>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubText}>Add items from the menu to get started</Text>
          </View>
        ) : (
          <>
            {/* ITEMS */}
            {cart.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={item.image} style={styles.itemImage} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>

                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Text style={styles.qtyBtn}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
                </View>
              </View>
            ))}

            {/* SUMMARY */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Subtotal</Text>
                <Text style={styles.rowValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Tax (10%)</Text>
                <Text style={styles.rowValue}>₹{tax.toFixed(0)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* FOOTER BUTTON */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button}onPress={() => navigation.navigate("Transaction", { total: total.toFixed(0) })}>
            <Text style={styles.buttonText}>Process Transaction</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7",
    paddingHorizontal: 16,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 54,
    marginBottom: 14,
  },
  iconCircle: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#f0ece8",
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
  },

  // EMPTY
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff0eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
    marginTop: 4,
  },
  emptySubText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    color: "#999",
    marginTop: 6,
  },

  // ITEM CARD
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 3,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 12,
  },
  itemName: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#1a1a2e",
  },
  itemPrice: {
    fontFamily: "PoppinsRegular",
    color: "#999",
    fontSize: 13,
    marginTop: 3,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5722",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyBtn: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: "#fff",
    paddingHorizontal: 4,
  },
  qtyText: {
    marginHorizontal: 8,
    fontFamily: "PoppinsBold",
    color: "#fff",
    fontSize: 14,
  },
  itemTotal: {
    fontFamily: "PoppinsBold",
    color: "#ff5722",
    fontSize: 14,
  },

  // SUMMARY
  summaryBox: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginTop: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    color: "#1a1a2e",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 13.5,
    color: "#888",
  },
  rowValue: {
    fontFamily: "PoppinsMedium",
    fontSize: 13.5,
    color: "#1a1a2e",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0ece8",
    marginVertical: 10,
  },
  totalLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    color: "#1a1a2e",
  },
  totalValue: {
    fontFamily: "PoppinsBold",
    fontSize: 15,
    color: "#ff5722",
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  button: {
    backgroundColor: "#ff5722",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
