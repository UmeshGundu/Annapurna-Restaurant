import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "./api";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Check if user is logged in on mount
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        setIsLoggedIn(true);
        fetchCartFromServer();
      }
    });
  }, []);
  const fetchCartFromServer = async () => {
    try {
      const data = await api.getCart();
      // Convert backend format to local format for UI compatibility
      const localCart = data.items.map((item) => ({
        id: item.menuItemId,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
        image: null, // images are local assets, not from server
      }));
      setCart(localCart);
    } catch (e) {
      // If not logged in or error, cart stays local
    }
  };
  const addToCart = async (item) => {
    // Always update local state immediately for smooth UX
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    // Sync with backend if logged in
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await api.addToCart(item.id, 1);
      } catch (e) {
        console.log("Cart sync error:", e);
      }
    }
  };
  const removeFromCart = async (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
    // Sync with backend if logged in
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await api.removeFromCart(id);
      } catch (e) {
        console.log("Cart sync error:", e);
      }
    }
  };
  const clearCart = async () => {
    setCart([]);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await api.clearCart();
      } catch (e) { }
    }
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCartFromServer }}>
      {children}
    </CartContext.Provider>
  );
};