import { I18nManager, Platform, View } from "react-native";
import { useEffect, useState } from "react";
import { Provider as PaperProvider, ActivityIndicator } from "react-native-paper";
import useAppFonts from "./theme/useAppFonts";
import theme from "./theme/theme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import AppDrawer from "./components/AppDrawer";
import MainScreen from "./screens/MainScreen";





export default function RootLayout() {

  const fontsLoaded = useAppFonts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentScreen, setCurrentScreen] =
    useState<"main" | "contact" | "profile" | "search">("main");

useEffect(() => {
  let InAppPurchases: any;

  if (Platform.OS !== "ios") {
    console.log("IAP disabled on this platform");
    return;
  }

  (async () => {
    try {
      InAppPurchases = await import("expo-in-app-purchases");
      await InAppPurchases.connectAsync();

      InAppPurchases.setPurchaseListener(
        async ({ results }: { results: any[] }) => {
          if (!results) return;

          for (const purchase of results) {
            if (!purchase.transactionReceipt) continue;

            console.log("📜 RECEIPT RECEIVED");

            await InAppPurchases.finishTransactionAsync(
              purchase,
              true
            );
          }
        }
      );

      console.log("✔️ IAP Ready");
    } catch (err) {
      console.log("❌ IAP init failed", err);
    }
  })();

  return () => {
    InAppPurchases?.disconnectAsync?.();
  };
}, []);




  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>

        {/* HEADER */}
        <SafeAreaView style={{ backgroundColor: "#0A3A5B" }}>
          <AppHeader onMenuOpen={() => setDrawerOpen(true)} />
        </SafeAreaView>

        {/* SCREEN CONTENT */}
        <View style={{ flex: 1 }}>
          <MainScreen
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
          />
        </View>

        {/* FOOTER */}
        <SafeAreaView style={{ backgroundColor: "#0B3C5D" }}>
          <AppFooter setCurrentScreen={setCurrentScreen} />
        </SafeAreaView>

        {/* DRAWER */}
        <AppDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={(route) => {
            setDrawerOpen(false);
            setCurrentScreen(route as any);
          }}
        />

      </PaperProvider>
    </SafeAreaProvider>
  );
}
