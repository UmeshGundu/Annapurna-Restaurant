import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "./api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) fetchWishlistFromServer();
    });
  }, []);

  const fetchWishlistFromServer = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (e) {
      console.log("Fetch wishlist error:", e);
    }
  };

  const toggleWishlist = async (item) => {
    const menuItemId = item.menuItemId ?? item.id;

    // Optimistic update first for instant UI response
    const exists = wishlist.find((i) => (i.menuItemId ?? i.id) === menuItemId);
    if (exists) {
      setWishlist((prev) => prev.filter((i) => (i.menuItemId ?? i.id) !== menuItemId));
    } else {
      setWishlist((prev) => [...prev, { ...item, menuItemId }]);
    }

    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        // Call backend — returns fresh updated list
        const updatedList = await api.toggleWishlist(menuItemId);
        // Overwrite with server truth
        setWishlist(updatedList);
      } catch (e) {
        console.log("Wishlist toggle error:", e);
        // Revert optimistic update on failure
        if (exists) {
          setWishlist((prev) => [...prev, { ...item, menuItemId }]);
        } else {
          setWishlist((prev) => prev.filter((i) => (i.menuItemId ?? i.id) !== menuItemId));
        }
      }
    }
  };

  const isWishlisted = (id) =>
    !!wishlist.find((i) => (i.menuItemId ?? i.id) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlistFromServer }}>
      {children}
    </WishlistContext.Provider>
  );
}