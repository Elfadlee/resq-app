import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type AlertType = "success" | "error" | "warning" | "info";

type TopAlertProps = {
  visible: boolean;
  type?: AlertType;
  message: string;
  duration?: number;
  onHide?: () => void;
};

const { width } = Dimensions.get("window");

const CONFIG = {
  success: { icon: "check-circle", color: "#4CAF50" },
  error: { icon: "alert-circle", color: "#F44336" },
  warning: { icon: "alert", color: "#FF9800" },
  info: { icon: "information", color: "#2196F3" },
};

export default function TopAlert({
  visible,
  type = "info",
  message,
  duration = 2500,
  onHide,
}: TopAlertProps) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 14,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -120,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const config = CONFIG[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          borderLeftColor: config.color,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={config.icon as any}
        size={22}
        color={config.color}
        style={{ marginLeft: 8 }}
      />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    width: width * 0.92,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    elevation: 6,
    borderLeftWidth: 5,
  },
  text: {
    flex: 1,
    fontFamily: "Almarai-Bold",
    fontSize: 14,
    color: "#333",
    textAlign: "right",
  },
});
