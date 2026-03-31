import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WishlistContext } from "./WishlistContext";
import { CartContext } from "./CartContext";

export default function WishlistScreen({ navigation }) {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const renderItem = ({ item }) => {
    // Server wishlist items have menuItemId, local items have id
    const itemId = item.menuItemId ?? item.id;
    const cartItem = cart.find((i) => i.id === itemId);

    // Build a cart-compatible item (needs id field for addToCart/removeFromCart)
    const cartCompatibleItem = { ...item, id: itemId };

    return (
      <View style={styles.foodCard}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.foodTitle}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleWishlist(item)}
            >
              <Ionicons name="heart" size={18} color="#ff5722" />
            </TouchableOpacity>

            <View style={styles.actionBox}>
              {!cartItem ? (
                <TouchableOpacity
                  style={styles.addInlineBtn}
                  onPress={() => addToCart(cartCompatibleItem)}
                >
                  <Text style={styles.addInlineText}>ADD +</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyInlineBox}>
                  <TouchableOpacity onPress={() => removeFromCart(itemId)}>
                    <Text style={styles.qtyBtn}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                  <TouchableOpacity onPress={() => addToCart(cartCompatibleItem)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.imageBox}>
          <Image source={item.image} style={styles.image} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconCircle}
        >
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.title}>My Wishlist</Text>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={20} color="#1a1a2e" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartText}>
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={40} color="#ff5722" />
          </View>
          <Text style={styles.emptyText}>No favourites yet</Text>
          <Text style={styles.emptySubText}>
            Tap the heart icon on any item to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          // WITH:
          keyExtractor={(item, index) => (item.menuItemId ?? item.id ?? index).toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: totalItems > 0 ? 140 : 30,
          }}
        />
      )}

      {/* CART BAR */}
      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartBarText}>
              {totalItems} {totalItems === 1 ? "item" : "items"} added
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
            <Ionicons name="arrow-forward" size={14} color="#ff5722" />
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
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#faf9f7",
  },
  title: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
  },
  iconCircle: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#f0ece8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff5722",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "PoppinsBold",
  },

  // EMPTY
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // FOOD CARD
  foodCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    marginVertical: 7,
    borderRadius: 18,
    alignItems: "stretch",
    elevation: 3,
  },
  foodTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
  },
  price: {
    fontSize: 14.5,
    fontFamily: "PoppinsBold",
    color: "#ff5722",
    marginTop: 3,
  },
  desc: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#888",
    marginTop: 5,
    lineHeight: 17,
    marginRight: 4,
    textAlign: "justify",
    flexShrink: 1,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ede8e4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#faf9f7",
  },
  imageBox: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 115,
    borderRadius: 18,
  },
  actionBox: {
    width: 90,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1,
  },
  addInlineBtn: {
    width: 90,
    height: 36,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#ff5722",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addInlineText: {
    color: "#ff5722",
    fontFamily: "PoppinsSemiBold",
    fontSize: 12.5,
    letterSpacing: 0.5,
  },
  qtyInlineBox: {
    width: 90,
    height: 36,
    flexDirection: "row",
    backgroundColor: "#ff5722",
    borderRadius: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  qtyBtn: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "PoppinsMedium",
    marginHorizontal: 6,
  },
  qtyText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },

  // CART BAR
  cartBar: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    height: 56,
    backgroundColor: "#1a1a2e",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 32,
    elevation: 10,
  },
  cartBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cartCountBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ff5722",
    justifyContent: "center",
    alignItems: "center",
  },
  cartCountText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 11,
  },
  cartBarText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "PoppinsMedium",
    fontSize: 13,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  checkoutText: {
    color: "#ff5722",
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
  },
});
