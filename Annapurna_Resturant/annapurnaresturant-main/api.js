import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

// ✅ UPDATE THIS IP to your laptop's local IP address (run `ipconfig` on Windows or `ifconfig` on Mac/Linux)
const LAPTOP_IP = "192.168.0.22"; // <-- Change this to your actual laptop IP

const getBaseUrl = () => {
    if (Platform.OS === "web") {
        return `http://${window.location.hostname}:8080/api`;
    }
    if (Platform.OS === "android") {
        // Android Emulator uses 10.0.2.2, but real device needs laptop IP
        return `http://${LAPTOP_IP}:8080/api`;
    }
    if (Platform.OS === "ios") {
        return `http://${LAPTOP_IP}:8080/api`;
    }
    return `http://${LAPTOP_IP}:8080/api`;
};

export const BASE_URL = getBaseUrl();

const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

const authHeaders = async () => {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
};

// ─── AUTH ────────────────────────────────────────────────────────────────────────
export const login = async (mobile, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
    });
    const json = await res.json();
    if (json.success) {
        await AsyncStorage.setItem('token', json.data.token);
        await AsyncStorage.setItem('userId', String(json.data.userId));
        await AsyncStorage.setItem('userName', json.data.name);
    }
    return json;
};

export const register = async (name, mobile, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, password }),
    });
    const json = await res.json();
    if (json.success) {
        await AsyncStorage.setItem('token', json.data.token);
        await AsyncStorage.setItem('userId', String(json.data.userId));
    }
    return json;
};

export const sendOtp = async (mobile) => {
    const res = await fetch(`${BASE_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
    });
    return res.json();
};

export const verifyOtp = async (mobile, otp) => {
    const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
    });
    return res.json();
};

export const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'userName']);
};

// ─── MENU ────────────────────────────────────────────────────────────────────────
export const getAllMenu = async () => {
    const res = await fetch(`${BASE_URL}/menu`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const getMenuByCategory = async (category) => {
    const res = await fetch(`${BASE_URL}/menu/category/${category}`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const searchMenu = async (query) => {
    const res = await fetch(`${BASE_URL}/menu/search?q=${encodeURIComponent(query)}`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

// ─── CART ────────────────────────────────────────────────────────────────────────
export const getCart = async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const addToCart = async (menuItemId, quantity = 1) => {
    const res = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ menuItemId, quantity }),
    });
    return handleResponse(res);
};

export const removeFromCart = async (menuItemId) => {
    const res = await fetch(`${BASE_URL}/cart/remove/${menuItemId}`, {
        method: 'POST',
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const clearCart = async () => {
    const res = await fetch(`${BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

// ─── WISHLIST ────────────────────────────────────────────────────────────────────
export const getWishlist = async () => {
    const res = await fetch(`${BASE_URL}/wishlist`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const toggleWishlist = async (menuItemId) => {
    const res = await fetch(`${BASE_URL}/wishlist/toggle/${menuItemId}`, {
        method: 'POST',
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────────
export const placeOrder = async (paymentMethod, deliveryAddress, total) => {
    const res = await fetch(`${BASE_URL}/orders/place`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ paymentMethod, deliveryAddress, total }),
    });
    return handleResponse(res);
};

export const getOrderHistory = async () => {
    const res = await fetch(`${BASE_URL}/orders/history`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const getOrderById = async (orderId) => {
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

// ─── PROFILE ─────────────────────────────────────────────────────────────────────
export const getProfile = async () => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const updateProfile = async (data) => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "PUT",
        headers: await authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

// ─── ADDRESSES ───────────────────────────────────────────────────────────────────
export const getAddresses = async () => {
    const res = await fetch(`${BASE_URL}/addresses`, {
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

export const addAddress = async (addressData) => {
    const res = await fetch(`${BASE_URL}/addresses`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(addressData),
    });
    return handleResponse(res);
};

export const updateAddress = async (addressId, addressData) => {
    const res = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        method: 'PUT',
        headers: await authHeaders(),
        body: JSON.stringify(addressData),
    });
    return handleResponse(res);
};

export const deleteAddress = async (id) => {
    const headers = await authHeaders();
    const response = await fetch(`${BASE_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: headers,
    });
    if (!response.ok) {
        throw new Error("Delete failed");
    }
    return true;
};

export const setDefaultAddress = async (addressId) => {
    const res = await fetch(`${BASE_URL}/addresses/${addressId}/set-default`, {
        method: 'POST',
        headers: await authHeaders(),
    });
    return handleResponse(res);
};

// ─── PAYMENT ─────────────────────────────────────────────────────────────────────
export const processPayment = async (paymentData) => {
    const res = await fetch(`${BASE_URL}/payment/process`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
};

// ─── INFO ────────────────────────────────────────────────────────────────────────
export const getFaqs = async () => {
    const res = await fetch(`${BASE_URL}/faq`);
    return handleResponse(res);
};

export const getContactInfo = async () => {
    const res = await fetch(`${BASE_URL}/contact`);
    return handleResponse(res);
};

export const getPrivacyPolicy = async () => {
    const res = await fetch(`${BASE_URL}/privacy`);
    return handleResponse(res);
};

export const submitRating = async (rating, review) => {
    const res = await fetch(`${BASE_URL}/rate`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({ rating, review }),
    });
    return handleResponse(res);
};