import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Text } from "react-native";

import Onboarding from "./Onboarding";
import Login from "./Login";
import Success from "./Success";
import Signup from "./Signup";
import Otpscreen from "./Otpscreen";
import Successup from "./Successup";
import Home from "./Home";
import CartScreen from "./Cartscreen";
import BiryaniScreen from "./Biryani";
import MealsScreen from "./Meals";
import StartersScreen from "./Starters";
import DessertsScreen from "./Desserts";
import DrinksScreen from "./Drinks";
import TandooriScreen from "./Tandoori";
import WishlistScreen from "./WishlistScreen";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import ProfileScreen from "./Profile";
import Transaction from "./Transaction";
import OrderSuccess from "./OrderSuccess";
import EditProfileScreen from "./EditProfileScreen";
import SavedAddressesScreen from "./SavedAddressesScreen";
import OrderHistoryScreen from "./OrderHistoryScreen";
import ContactUsScreen from "./ContactUsScreen";
import HelpFAQScreen from "./HelpFAQScreen";
import RateAppScreen from "./RateAppScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
  });

  if (!loaded) return null;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = {
    fontFamily: "PoppinsRegular",
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Otpscreen" component={Otpscreen} />
            <Stack.Screen name="Successup" component={Successup} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Biryani" component={BiryaniScreen} />
            <Stack.Screen name="Meals" component={MealsScreen} />
            <Stack.Screen name="Starters" component={StartersScreen} />
            <Stack.Screen name="Tandoori" component={TandooriScreen} />
            <Stack.Screen name="Desserts" component={DessertsScreen} />
            <Stack.Screen name="Drinks" component={DrinksScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Transaction" component={Transaction} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="RateApp" component={RateAppScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WishlistProvider>
    </CartProvider>
  );
}