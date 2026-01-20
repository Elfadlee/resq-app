
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  I18nManager,
  View,
  Platform,
} from "react-native";

type AlertType = "success" | "error" | "warning" | "info";

type TopAlertProps = {
  visible: boolean;
  type?: AlertType;
  message: string;
  duration?: number;
  onHide?: () => void;
};

const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT = 64; // نفس ارتفاع AppHeader
const SAFE_TOP = Platform.OS === "ios" ? 44 : 24;

const ALERT_TOP = HEADER_HEIGHT + SAFE_TOP + 8;


const CONFIG = {
  success: { icon: "check-circle-outline", color: "#16bd53", bg: "#E7F7EC" },
  error:   { icon: "alert-circle-outline", color: "#F44336", bg: "#FFF1F1" },
  warning: { icon: "alert-outline",       color: "#b88b00", bg: "#FFF9E6" },
  info:    { icon: "information-outline", color: "#2196F3", bg: "#F1F3FF" },
};

export default function TopAlert({
  visible,
  type = "info",
  message,
  duration = 2500,
  onHide,
}: TopAlertProps) {

  const translateY = useRef(new Animated.Value(-height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: ALERT_TOP,
          duration: 420,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -height,
            duration: 350,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHide?.());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const { icon, color, bg } = CONFIG[type];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          backgroundColor: bg,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={28}
        color={color}
        style={styles.icon}
      />
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    width: width * 0.9,
    minHeight: 54,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    borderRadius: 16,
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  text: {
    flex: 1,
    fontFamily: "Almarai-Bold",
    fontSize: 14,
    color: "#222",
    textAlign: "right",
    paddingVertical: 8,
  },
});
