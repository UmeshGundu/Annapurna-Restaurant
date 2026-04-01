import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "./api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // wishlist stores array of menuItemIds (numbers)
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) fetchWishlistFromServer();
    });
  }, []);

  // Fetch wishlist from backend and store only the menuItemIds locally
  const fetchWishlistFromServer = async () => {
    try {
      const data = await api.getWishlist();
      // data is array of WishlistItemDTO: { id, menuItemId, name, price, ... }
      const ids = data.map((item) => item.menuItemId);
      setWishlist(ids);
    } catch (e) {
      console.log("Fetch wishlist error:", e);
    }
  };

  // toggleWishlist accepts either a full item object OR just an id (number)
  const toggleWishlist = async (itemOrId) => {
    const itemId =
      typeof itemOrId === "object"
        ? itemOrId.menuItemId ?? itemOrId.id
        : itemOrId;

    if (!itemId) {
      console.log("toggleWishlist: invalid id", itemOrId);
      return;
    }

    // Optimistic UI update
    setWishlist((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    // Sync with backend if logged in
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const updatedList = await api.toggleWishlist(itemId);
        // Backend returns updated list of WishlistItemDTO after toggle
        if (Array.isArray(updatedList)) {
          const ids = updatedList.map((item) => item.menuItemId);
          setWishlist(ids);
        }
      } catch (e) {
        console.log("Wishlist sync error:", e);
        // Revert optimistic update on error
        setWishlist((prev) => {
          if (prev.includes(itemId)) {
            return prev.filter((id) => id !== itemId);
          } else {
            return [...prev, itemId];
          }
        });
      }
    }
  };

  const isWishlisted = (id) => {
    return wishlist.includes(id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlistFromServer }}
    >
      {children}
    </WishlistContext.Provider>
  );
}