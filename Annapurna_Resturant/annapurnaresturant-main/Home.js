import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Share,
  Modal,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { CartContext } from "./CartContext";

import Herobg from "./assets/herobg.jpg";
import Chickenb from "./assets/chickenb.jpg";
import Muttong from "./assets/muttong.jpg";

import BiryaniImg from "./assets/biryanicm.png";
import MealsImg from "./assets/mealscm.png";
import StartersImg from "./assets/starter.png";
import DessertsImg from "./assets/desserts.png";
import DrinksImg from "./assets/drinks.png";
import TandooriImg from "./assets/tandoori.png";
import { allFoodItems } from "./Data";

const { width, height } = Dimensions.get("window");
const BANNER_WIDTH = width - 32;

const bannerSlides = [
  { id: "1", image: Herobg,    title: "Welcome to Annapurna", subtitle: "Taste the tradition"  },
  { id: "2", image: Chickenb,  title: "Chicken Dum Biryani",  subtitle: "Our signature dish"   },
  { id: "3", image: Muttong,   title: "Mutton Biryani",       subtitle: "Rich & aromatic"       },
];

const bestSellerIds = [1, 2, 29, 30];
const bestSellers = bestSellerIds.map((id) =>
  allFoodItems.find((item) => item.id === id)
);

const CATEGORIES    = ["All", "Biryani", "Meals", "Starters", "Tandoori", "Desserts", "Drinks"];
const SORT_OPTIONS  = [
  { label: "Relevance",         value: "default"    },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z",       value: "name_asc"   },
];
const PRICE_RANGES  = [
  { label: "All Prices",   min: 0,   max: Infinity },
  { label: "Under ₹100",   min: 0,   max: 99       },
  { label: "₹100 – ₹200",  min: 100, max: 200      },
  { label: "Above ₹200",   min: 201, max: Infinity  },
];

export default function HomeScreen({ navigation }) {
  const [searchText,       setSearchText]       = useState("");
  const [activeBanner,     setActiveBanner]     = useState(0);
  const [savedItems,       setSavedItems]       = useState([]);
  const [showFilter,       setShowFilter]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort,     setSelectedSort]     = useState("default");
  const [selectedPrice,    setSelectedPrice]    = useState(0);
  const [activeFilters,    setActiveFilters]    = useState(0);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const bannerRef = useRef(null);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { name: "Biryani",  img: BiryaniImg,  screen: "Biryani"  },
    { name: "Meals",    img: MealsImg,    screen: "Meals"    },
    { name: "Starters", img: StartersImg, screen: "Starters" },
    { name: "Tandoori", img: TandooriImg, screen: "Tandoori" },
    { name: "Desserts", img: DessertsImg, screen: "Desserts" },
    { name: "Drinks",   img: DrinksImg,   screen: "Drinks"   },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => {
        const next = (prev + 1) % bannerSlides.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openFilter = () => {
    setShowFilter(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
  };
  const closeFilter = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 280, useNativeDriver: true }).start(() =>
      setShowFilter(false)
    );
  };

  const applyFilters = () => {
    let count = 0;
    if (selectedCategory !== "All")    count++;
    if (selectedSort     !== "default") count++;
    if (selectedPrice    !== 0)        count++;
    setActiveFilters(count);
    closeFilter();
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSort("default");
    setSelectedPrice(0);
    setActiveFilters(0);
  };

  const getFilteredItems = () => {
    let items = allFoodItems.filter((item) =>
      item.name.toLowerCase().includes(searchText.trim().toLowerCase())
    );
    if (selectedCategory !== "All") items = items.filter((i) => i.category === selectedCategory);
    const range = PRICE_RANGES[selectedPrice];
    items = items.filter((i) => i.price >= range.min && i.price <= range.max);
    if (selectedSort === "price_asc")  items = [...items].sort((a, b) => a.price - b.price);
    if (selectedSort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    if (selectedSort === "name_asc")   items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  };

  const filteredItems = getFilteredItems();
  const isVeg = (item) =>
    item.category === "Desserts" || item.category === "Drinks" ||
    item.name.toLowerCase().includes("veg") ||
    item.name.toLowerCase().includes("paneer") ||
    item.name.toLowerCase().includes("gobi") ||
    item.name.toLowerCase().includes("mushroom");

  const toggleSave = (item) => {
    const exists = savedItems.find((i) => i.id === item.id);
    setSavedItems(exists ? savedItems.filter((i) => i.id !== item.id) : [...savedItems, item]);
  };

  const shareItem = async (item) => {
    try {
      await Share.share({ message: `${item.name} - Rs.${item.price}\nTry this delicious food!` });
    } catch (error) { console.log(error); }
  };

  const getCartItem = (item) => cart.find((i) => i.id === item.id);

  const CartControl = ({ item, compact }) => {
    const cartItem = getCartItem(item);
    if (!cartItem) {
      return (
        <TouchableOpacity
          style={compact ? styles.addBtnCompact : styles.addInlineBtn}
          onPress={() => addToCart(item)}
        >
          <Text style={compact ? styles.addBtnCompactText : styles.addInlineText}>ADD +</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={compact ? styles.qtyCompactBox : styles.qtyInlineBox}>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{cartItem.quantity}</Text>
        <TouchableOpacity onPress={() => addToCart(item)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showResultsView = searchText.length > 0 || activeFilters > 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Annapurna Restaurant</Text>
            <Text style={styles.open}>● Open • 10:00 AM – 11:00 PM</Text>
          </View>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart-outline" size={20} color="#1a1a2e" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#aaa" />
            <TextInput
              placeholder="Search food..."
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
          <TouchableOpacity
            style={[styles.filterBtn, activeFilters > 0 && styles.filterBtnActive]}
            onPress={openFilter}
          >
            <MaterialIcons name="tune" size={20} color={activeFilters > 0 ? "#fff" : "#ff5722"} />
            {activeFilters > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilters}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ACTIVE FILTER CHIPS */}
        {activeFilters > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {selectedCategory !== "All" && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{selectedCategory}</Text>
                <TouchableOpacity onPress={() => { setSelectedCategory("All"); setActiveFilters(c => Math.max(0, c - 1)); }}>
                  <Ionicons name="close" size={13} color="#ff5722" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            )}
            {selectedSort !== "default" && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{SORT_OPTIONS.find(s => s.value === selectedSort)?.label}</Text>
                <TouchableOpacity onPress={() => { setSelectedSort("default"); setActiveFilters(c => Math.max(0, c - 1)); }}>
                  <Ionicons name="close" size={13} color="#ff5722" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            )}
            {selectedPrice !== 0 && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{PRICE_RANGES[selectedPrice].label}</Text>
                <TouchableOpacity onPress={() => { setSelectedPrice(0); setActiveFilters(c => Math.max(0, c - 1)); }}>
                  <Ionicons name="close" size={13} color="#ff5722" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.chipClear} onPress={resetFilters}>
              <Text style={styles.chipClearText}>Clear all</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* RESULTS VIEW or HOME VIEW */}
        {showResultsView ? (
          <View style={{ paddingHorizontal: 14 }}>
            <View style={styles.resultHeader}>
              <Text style={styles.sectionTitle}>
                {searchText.length > 0 ? "Search Results" : selectedCategory === "All" ? "All Items" : selectedCategory}
              </Text>
              <Text style={styles.resultCount}>{filteredItems.length} items</Text>
            </View>

            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <View key={item.id} style={styles.foodCard}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <View style={styles.vegBadgeRow}>
                      <View style={[styles.vegDot, { borderColor: isVeg(item) ? "#4caf50" : "#e53935" }]}>
                        <View style={[styles.vegDotInner, { backgroundColor: isVeg(item) ? "#4caf50" : "#e53935" }]} />
                      </View>
                      <Text style={styles.foodCategory}>{item.category}</Text>
                    </View>
                    <Text style={styles.foodTitle}>{item.name}</Text>
                    <Text style={styles.foodPrice}>Rs.{item.price}</Text>
                    <Text style={styles.foodDesc}>{item.description}</Text>
                    <View style={styles.iconRow}>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => toggleSave(item)}>
                        <Ionicons
                          name={savedItems.find((i) => i.id === item.id) ? "heart" : "heart-outline"}
                          size={17} color="#ff5722"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => shareItem(item)}>
                        <Ionicons name="share-social-outline" size={17} color="#444" />
                      </TouchableOpacity>
                      <View style={styles.actionBox}>
                        <CartControl item={item} compact={false} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.imageBox}>
                    <Image source={item.image} style={styles.foodImage} />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>🍽</Text>
                <Text style={styles.emptyTitle}>Nothing found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* BANNER */}
            <View style={styles.bannerWrapper}>
              <FlatList
                ref={bannerRef}
                data={bannerSlides}
                horizontal pagingEnabled scrollEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
                  setActiveBanner(index);
                }}
                getItemLayout={(_, index) => ({ length: BANNER_WIDTH, offset: BANNER_WIDTH * index, index })}
                renderItem={({ item }) => (
                  <View style={styles.bannerSlide}>
                    <Image source={item.image} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay}>
                      <Text style={styles.bannerTitle}>{item.title}</Text>
                      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                )}
              />
              <View style={styles.dotsRow}>
                {bannerSlides.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeBanner && styles.dotActive]} />
                ))}
              </View>
            </View>

            {/* CATEGORIES */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}>
              {categories.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.categoryCard, { marginRight: index !== categories.length - 1 ? 12 : 0 }]} onPress={() => navigation.navigate(item.screen)}>
                  <Image source={item.img} style={styles.categoryImg} />
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* BEST SELLERS */}
            <View style={styles.rowTitle}>
              <Text style={styles.sectionTitle}>Best Sellers</Text>
              <Text style={styles.sectionSub}>Our most loved dishes</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}>
              {bestSellers.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image source={item.image} style={styles.cardImg} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardPrice}>Rs.{item.price}</Text>
                    <CartControl item={item} compact={true} />
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={22} color="#fff" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate("Wishlist")}>
          <Ionicons name="heart-outline" size={22} color="#fff" />
          <Text style={styles.footerLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Text style={styles.footerLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn}onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={22} color="#fff" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* CART BAR */}
      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartBarText}>{totalItems} {totalItems === 1 ? "item" : "items"} added</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate("Cart")}>
            <Text style={styles.checkoutText}>Checkout</Text>
            <Ionicons name="arrow-forward" size={14} color="#ff5722" />
          </TouchableOpacity>
        </View>
      )}

      {/* FILTER BOTTOM SHEET */}
      {showFilter && (
        <Modal transparent animationType="none" onRequestClose={closeFilter}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeFilter} />
          <Animated.View style={[styles.filterSheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.resetText}>Reset all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* CATEGORY */}
              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.optionsWrap}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.optionChip, selectedCategory === cat && styles.optionChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.optionChipText, selectedCategory === cat && styles.optionChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* SORT */}
              <Text style={styles.filterLabel}>Sort By</Text>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt.value} style={styles.radioRow} onPress={() => setSelectedSort(opt.value)}>
                  <View style={[styles.radio, selectedSort === opt.value && styles.radioActive]}>
                    {selectedSort === opt.value && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}

              {/* PRICE RANGE */}
              <Text style={styles.filterLabel}>Price Range</Text>
              {PRICE_RANGES.map((range, idx) => (
                <TouchableOpacity key={idx} style={styles.radioRow} onPress={() => setSelectedPrice(idx)}>
                  <View style={[styles.radio, selectedPrice === idx && styles.radioActive]}>
                    {selectedPrice === idx && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>{range.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f7" },

  // HEADER
  header: { flexDirection: "row", justifyContent: "space-between", marginTop: 54, paddingHorizontal: 18, alignItems: "center" },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  titleBox: { marginLeft: 10, flex: 1 },
  iconCircle: { padding: 8, borderRadius: 22, backgroundColor: "#f0ece8", marginRight: 4, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  cartBadge: { position: "absolute", top: -4, right: -4, backgroundColor: "#ff5722", borderRadius: 10, minWidth: 18, height: 18, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  cartText: { color: "#fff", fontSize: 9, fontFamily: "PoppinsBold" },
  title: { fontSize: 16, fontFamily: "PoppinsSemiBold", color: "#1a1a2e", letterSpacing: 0.2 },
  open: { fontSize: 11, color: "#4caf50", fontFamily: "PoppinsRegular", marginTop: 1 },



  // SEARCH
  searchContainer: { flexDirection: "row", marginHorizontal: 18, marginTop: 18, marginBottom: 4 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f0ece8", borderRadius: 30, paddingHorizontal: 16, paddingVertical: 2 },
  input: { marginLeft: 8, flex: 1, fontFamily: "PoppinsRegular", fontSize: 13.5, color: "#1a1a2e", paddingVertical: 10 },
  filterBtn: { marginLeft: 10, backgroundColor: "#fff0eb", padding: 12, borderRadius: 18, elevation: 2 },
  filterBtnActive: { backgroundColor: "#ff5722" },
  filterBadge: { position: "absolute", top: -4, right: -4, backgroundColor: "#1a1a2e", borderRadius: 9, width: 18, height: 18, justifyContent: "center", alignItems: "center" },
  filterBadgeText: { color: "#fff", fontSize: 9, fontFamily: "PoppinsBold" },

  // CHIPS
  chipRow: { paddingHorizontal: 16, marginBottom: 8, marginTop: 6 },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff0eb", borderWidth: 1, borderColor: "#ff5722", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8 },
  chipText: { fontFamily: "PoppinsMedium", fontSize: 12, color: "#ff5722" },
  chipClear: { backgroundColor: "#eee", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8 },
  chipClearText: { fontFamily: "PoppinsMedium", fontSize: 12, color: "#666" },

  // RESULT HEADER
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 8, marginHorizontal: 4 },
  resultCount: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#999" },

  // BANNER
  bannerWrapper: { marginHorizontal: 16, marginTop: 14, borderRadius: 24, overflow: "hidden", elevation: 6 },
  bannerSlide: { width: BANNER_WIDTH, height: 170, borderRadius: 24, overflow: "hidden" },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.42)", paddingVertical: 14, paddingHorizontal: 18 },
  bannerTitle: { color: "#fff", fontSize: 16, fontFamily: "PoppinsSemiBold", letterSpacing: 0.3 },
  bannerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "PoppinsRegular", marginTop: 2 },
  dotsRow: { flexDirection: "row", justifyContent: "center", marginTop: 10, marginBottom: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#d9d3ce", marginHorizontal: 3 },
  dotActive: { backgroundColor: "#ff5722", width: 20, borderRadius: 4 },

  // CATEGORIES
  catRow: { marginTop: 20, },
  categoryCard: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 22, marginRight: 12, alignItems: "center", width: 82, elevation: 3 },
  categoryImg: { width: 60, height: 52, borderRadius: 16, marginBottom: 7 },
  categoryText: { fontSize: 11.5, fontFamily: "PoppinsMedium", color: "#1a1a2e", textAlign: "center" },

  // SECTION
  rowTitle: { marginHorizontal: 18, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },
  sectionSub: { fontSize: 12, fontFamily: "PoppinsRegular", color: "#999", marginTop: 2 },

  // BEST SELLER CARD
  card: { backgroundColor: "#fff", borderRadius: 22, width: 190, padding: 12, elevation: 4, marginBottom: 4, marginRight: 12 },
  cardImg: { width: "100%", height: 118, borderRadius: 16 },
  cardTitle: { fontSize: 13.5, fontFamily: "PoppinsSemiBold", color: "#1a1a2e", marginTop: 8 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  cardPrice: { fontSize: 14, fontFamily: "PoppinsBold", color: "#ff5722" },
  addBtnCompact: { backgroundColor: "#fff0eb", borderWidth: 1.5, borderColor: "#ff5722", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  addBtnCompactText: { color: "#ff5722", fontFamily: "PoppinsSemiBold", fontSize: 12 },
  qtyCompactBox: { flexDirection: "row", backgroundColor: "#ff5722", borderRadius: 10, alignItems: "center", paddingHorizontal: 4, paddingVertical: 4 },

  // FOOD CARD
  vegBadgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  vegDot: { width: 14, height: 14, borderRadius: 3, borderWidth: 1.5, justifyContent: "center", alignItems: "center", marginRight: 5 },
  vegDotInner: { width: 7, height: 7, borderRadius: 2 },
  foodCategory: { fontFamily: "PoppinsRegular", fontSize: 10.5, color: "#999" },
  foodCard: { flexDirection: "row", padding: 14, backgroundColor: "#fff", marginVertical: 7, borderRadius: 18, alignItems: "stretch", elevation: 3 },
  foodTitle: { fontSize: 15, fontFamily: "PoppinsSemiBold", color: "#1a1a2e" },
  foodPrice: { fontSize: 14.5, fontFamily: "PoppinsBold", color: "#ff5722", marginTop: 3 },
  foodDesc: { fontSize: 12, fontFamily: "PoppinsRegular", color: "#888", marginTop: 5, lineHeight: 17, marginRight: 4, textAlign: "justify", flexShrink: 1 },
  iconRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  iconBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#ede8e4", justifyContent: "center", alignItems: "center", marginRight: 8, backgroundColor: "#faf9f7" },
  imageBox: { width: 120, justifyContent: "center", alignItems: "center" },
  foodImage: { width: 110, height: 115, borderRadius: 18 },
  actionBox: { marginLeft: 6, width: 90, height: 36, justifyContent: "center", alignItems: "center", flexShrink: 1 },
  addInlineBtn: { width: 90, height: 36, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#ff5722", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  addInlineText: { color: "#ff5722", fontFamily: "PoppinsSemiBold", fontSize: 12.5, letterSpacing: 0.5 },
  qtyInlineBox: { width: 90, height: 36, flexDirection: "row", backgroundColor: "#ff5722", borderRadius: 12, justifyContent: "space-around", alignItems: "center" },
  qtyBtnText: { color: "#fff", fontSize: 17, fontFamily: "PoppinsMedium", marginHorizontal: 6 },
  qtyText: { color: "#fff", fontFamily: "PoppinsBold", fontSize: 14 },

  // EMPTY
  emptyBox: { alignItems: "center", marginTop: 50 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontFamily: "PoppinsSemiBold", fontSize: 16, color: "#1a1a2e", marginTop: 12 },
  emptySubtitle: { fontFamily: "PoppinsRegular", fontSize: 13, color: "#999", marginTop: 5 },

  // FOOTER
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 65, backgroundColor: "#1a1a2e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 4, elevation: 16 },
  footerBtn: { alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  footerLabel: { color: "rgba(255,255,255,0.7)", fontFamily: "PoppinsRegular", fontSize: 10, marginTop: 3 },

  // CART BAR
  cartBar: { position: "absolute", bottom: 72, left: 14, right: 14, height: 56, backgroundColor: "#1a1a2e", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, borderRadius: 32, elevation: 10 },
  cartBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartCountBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#ff5722", justifyContent: "center", alignItems: "center" },
  cartCountText: { color: "#fff", fontFamily: "PoppinsBold", fontSize: 11 },
  cartBarText: { color: "rgba(255,255,255,0.85)", fontFamily: "PoppinsMedium", fontSize: 13 },
  checkoutBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 5 },
  checkoutText: { color: "#ff5722", fontFamily: "PoppinsSemiBold", fontSize: 13 },

  // FILTER SHEET
  modalBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)" },
  filterSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingBottom: 36, maxHeight: height * 0.78 },
  sheetHandle: { width: 40, height: 4, backgroundColor: "#e0dbd6", borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 14 },
  sheetTitle: { fontFamily: "PoppinsSemiBold", fontSize: 18, color: "#1a1a2e" },
  resetText: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#ff5722" },
  filterLabel: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: "#1a1a2e", marginTop: 18, marginBottom: 10 },
  optionsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: "#e0dbd6", backgroundColor: "#faf9f7" },
  optionChipActive: { backgroundColor: "#ff5722", borderColor: "#ff5722" },
  optionChipText: { fontFamily: "PoppinsMedium", fontSize: 13, color: "#555" },
  optionChipTextActive: { color: "#fff" },
  radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#f0ece8" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#ccc", justifyContent: "center", alignItems: "center", marginRight: 12 },
  radioActive: { borderColor: "#ff5722" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#ff5722" },
  radioLabel: { fontFamily: "PoppinsRegular", fontSize: 14, color: "#1a1a2e" },
  applyBtn: { backgroundColor: "#ff5722", borderRadius: 18, paddingVertical: 15, alignItems: "center", marginTop: 20 },
  applyBtnText: { color: "#fff", fontFamily: "PoppinsSemiBold", fontSize: 15, letterSpacing: 0.4 },
});
