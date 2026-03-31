import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Animated,
  StatusBar,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import Banner from "./assets/home.png";
import Food from "./assets/food.png";
import Foood from "./assets/foood.png";
import Biryani from "./assets/biryani.png";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 0,
    fullImage: true,
    source: Banner,
  },
  {
    id: 1,
    title: "Taste the\nTradition",
    subtitle: "Delicious food, crafted with love and\ndelivered fresh to your home.",
    image: Food,
    tag: "FRESH & HOT",
  },
  {
    id: 2,
    title: "Explore Our\nKitchen",
    subtitle: "From biryanis to desserts — a world of\nauthentic flavours awaits you.",
    image: Biryani,
    tag: "30+ DISHES",
  },
  {
    id: 3,
    title: "Order in\nSeconds",
    subtitle: "Fast service, authentic taste — your\nfavourite meal at your doorstep.",
    image: Foood,
    tag: "QUICK SERVICE",
    isLast: true,
  },
];

export default function Onboarding({ navigation }) {
  const scrollRef = useRef(null);
  const [screen, setScreen] = useState(0);

  const goToLast = () => {
    scrollRef.current?.scrollTo({ x: width * 3, animated: true });
    setScreen(3);
  };

  const goNext = () => {
    const next = Math.min(screen + 1, 3);
    scrollRef.current?.scrollTo({ x: width * next, animated: true });
    setScreen(next);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setScreen(index);
        }}
      >
        {slides.map((slide) => {
          if (slide.fullImage) {
            return (
              <View key={slide.id} style={{ width, height }}>
                <Image source={slide.source} style={styles.fullImage} />
                {/* Gradient overlay for full image slide */}
                <LinearGradient
                  colors={["transparent", "rgba(26,26,46,0.7)"]}
                  style={styles.fullOverlay}
                />
                <View style={styles.fullTextBox}>
                  <Text style={styles.brandName}>Annapurna</Text>
                  <Text style={styles.brandTagline}>Restaurant</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={slide.id} style={{ width, height }}>
              {/* Rich dark background */}
              <LinearGradient
                colors={["#1a1a2e", "#16213e"]}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Skip button */}
              {!slide.isLast && (
                <TouchableOpacity style={styles.skipBtn} onPress={goToLast}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              )}

              {/* Tag pill */}
              <View style={styles.tagPill}>
                <View style={styles.tagDot} />
                <Text style={styles.tagText}>{slide.tag}</Text>
              </View>

              {/* Image */}
              <View style={styles.imageWrapper}>
                <Image source={slide.image} style={styles.slideImage} />
              </View>

              {/* Text content */}
              <View style={styles.textBox}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              </View>

              {/* Bottom row */}
              <View style={styles.bottomRow}>
                {/* Dots */}
                <View style={styles.dotsRow}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[styles.dot, screen === i && styles.dotActive]}
                    />
                  ))}
                </View>

                {/* CTA */}
                {slide.isLast ? (
                  <Pressable
                    style={styles.getStartedBtn}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <LinearGradient
                      colors={["#ff7043", "#ff5722"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.getStartedGradient}
                    >
                      <Text style={styles.getStartedText}>Get Started</Text>
                      <Text style={styles.getStartedArrow}>→</Text>
                    </LinearGradient>
                  </Pressable>
                ) : (
                  <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
                    <LinearGradient
                      colors={["#ff7043", "#ff5722"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.nextBtnGrad}
                    >
                      <Text style={styles.nextArrow}>→</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Dots for full image screen */}
      {screen === 0 && (
        <View style={styles.firstDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, screen === i && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },

  // FULL IMAGE SLIDE
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fullOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  fullTextBox: {
    position: "absolute",
    bottom: height * 0.12,
    left: 28,
  },
  brandName: {
    fontFamily: "PoppinsBold",
    fontSize: 42,
    color: "#fff",
    letterSpacing: 1.5,
  },
  brandTagline: {
    fontFamily: "PoppinsRegular",
    fontSize: 22,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 6,
    marginTop: -6,
  },

  // SKIP
  skipBtn: {
    position: "absolute",
    top: 58,
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  skipText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.3,
  },

  // TAG
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 64,
    left: 28,
    backgroundColor: "rgba(255,87,34,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,87,34,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff5722",
    marginRight: 7,
  },
  tagText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 10,
    color: "#ff7043",
    letterSpacing: 1.5,
  },

  // IMAGE
  imageWrapper: {
    alignItems: "center",
    marginTop: height * 0.22,
  },
  slideImage: {
    width: 280,
    height: 240,
    resizeMode: "contain",
  },

  // TEXT
  textBox: {
    paddingHorizontal: 28,
    marginTop: 40,
  },
  slideTitle: {
    fontFamily: "PoppinsBold",
    fontSize: 36,
    color: "#fff",
    lineHeight: 44,
    letterSpacing: 0.3,
  },
  slideSubtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 14.5,
    color: "rgba(255,255,255,0.55)",
    marginTop: 12,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  // BOTTOM ROW
  bottomRow: {
    position: "absolute",
    bottom: 48,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 6,
  },
  dotActive: {
    backgroundColor: "#ff5722",
    width: 22,
    borderRadius: 4,
  },

  // NEXT BUTTON
  nextBtn: {
    borderRadius: 22,
    overflow: "hidden",
  },
  nextBtnGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  nextArrow: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
  },

  // GET STARTED BUTTON
  getStartedBtn: {
    borderRadius: 28,
    overflow: "hidden",
  },
  getStartedGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
  },
  getStartedText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.4,
  },
  getStartedArrow: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },

  // FIRST SCREEN DOTS
  firstDots: {
    position: "absolute",
    bottom: 44,
    alignSelf: "center",
    flexDirection: "row",
  },
});