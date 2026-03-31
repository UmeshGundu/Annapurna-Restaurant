import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { allFoodItems } from "./Data";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext";

export default function TandooriScreen({ navigation }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const [searchText, setSearchText] = useState("");

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const baseItems = allFoodItems.filter((item) => item.category === "Tandoori");
  const filteredItems = baseItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const shareItem = async (item) => {
    try {
      await Share.share({
        message: `${item.name} - Rs.${item.price}\nTry this delicious food!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => {
    const cartItem = cart.find((i) => i.id === item.id);
    const wishlisted = isWishlisted(item.id);

    return (
      <View style={styles.foodCard}>
        {/* LEFT */}
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.foodTitle}>{item.name}</Text>
          <Text style={styles.foodPrice}>Rs.{item.price}</Text>
          <Text style={styles.foodDesc}>{item.description}</Text>

          <View style={styles.iconRow}>
            {/* WISHLIST */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => toggleWishlist(item)}>
              <Ionicons
                name={wishlisted ? "heart" : "heart-outline"}
                size={17}
                color="#ff5722"
              />
            </TouchableOpacity>

            {/* SHARE */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => shareItem(item)}>
              <Ionicons name="share-social-outline" size={17} color="#444" />
            </TouchableOpacity>

            {/* ADD / QTY */}
            <View style={styles.actionBox}>
              {!cartItem ? (
                <TouchableOpacity style={styles.addInlineBtn} onPress={() => addToCart(item)}>
                  <Text style={styles.addInlineText}>ADD +</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyInlineBox}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                  <TouchableOpacity onPress={() => addToCart(item)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.imageBox}>
          <Image source={item.image} style={styles.foodImage} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.title}>Tandoori Menu</Text>
        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={20} color="#1a1a2e" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Search tandoori..."
          placeholderTextColor="#bbb"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color="#bbb" />
          </TouchableOpacity>
        )}
      </View>

      {/* COUNT */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filteredItems.length} items</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: totalItems > 0 ? 130 : 30, paddingTop: 4 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🍽</Text>
            <Text style={styles.emptyTitle}>Nothing found</Text>
            <Text style={styles.emptySubtitle}>Try a different search</Text>
          </View>
        }
      />

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
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate("Cart")}>
            <Text style={styles.checkoutText}>Checkout</Text>
            <Ionicons name="arrow-forward" size={14} color="#ff5722" />
          </TouchableOpacity>
        </View>
      )}
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
    marginTop: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
    letterSpacing: 0.2,
  },
  iconCircle: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#f0ece8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
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
  cartText: { color: "#fff", fontSize: 9, fontFamily: "PoppinsBold" },

  // SEARCH
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0ece8",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 30,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontFamily: "PoppinsRegular",
    fontSize: 13.5,
    color: "#1a1a2e",
    paddingVertical: 10,
  },

  // COUNT
  countRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
  },
  countText: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#999",
  },

  // FOOD CARD
  foodCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginVertical: 7,
    borderRadius: 18,
    alignItems: "stretch",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  foodTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: "#1a1a2e",
    letterSpacing: 0.1,
  },
  foodPrice: {
    fontSize: 14.5,
    fontFamily: "PoppinsBold",
    color: "#ff5722",
    marginTop: 3,
  },
  foodDesc: {
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
    flexWrap: "nowrap",
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ede8e4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#faf9f7",
  },
  imageBox: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  foodImage: {
    width: 110,
    height: 115,
    borderRadius: 18,
  },
  actionBox: {
    marginLeft: 6,
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
  qtyBtnText: {
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

  // EMPTY STATE
  emptyBox: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#1a1a2e", marginTop: 12 },
  emptySubtitle: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#999", marginTop: 5 },

  // CART BAR
  cartBar: {
    position: "absolute",
    bottom: 16,
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
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  cartBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartCountBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ff5722",
    justifyContent: "center",
    alignItems: "center",
  },
  cartCountText: { color: "#fff", fontFamily: "PoppinsBold", fontSize: 11 },
  cartBarText: { color: "rgba(255,255,255,0.85)", fontFamily: "PoppinsMedium", fontSize: 13 },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  checkoutText: { color: "#ff5722", fontFamily: "PoppinsSemiBold", fontSize: 13 },
});
