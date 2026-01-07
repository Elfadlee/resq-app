// import { I18nManager } from "react-native";
// import { PaperProvider } from "react-native-paper";
// import RootLayout from "./_layout";
// import theme from "./theme/theme";

// if (!I18nManager.isRTL) {
//   I18nManager.allowRTL(true);
//   I18nManager.forceRTL(true);
// }


// export default function Index() {
//   return (
//     <PaperProvider theme={theme}>
//       <RootLayout />
//     </PaperProvider>
//   );
// }



import { I18nManager, Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";

import RootLayout from "./_layout";
import theme from "./theme/theme";

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function Index() {

  useEffect(() => {

      console.log("📱 Platform =", Platform.OS);

    // 📌 امنع تشغيل IAP على الويب والأندرويد
    if (Platform.OS !== "ios") {
      console.log("ℹ️ In-App Purchases disabled on this platform");
      return;
    }

    (async () => {

      // ⬅️ استيراد ديناميكي (آمن للويب و Expo Go)
      const InAppPurchases = await import("expo-in-app-purchases");
      const { initIAP } = await import("./services/iap");

      await initIAP(InAppPurchases);

      InAppPurchases.setPurchaseListener(async ({ results }) => {
        if (!results) return;

        for (const purchase of results) {
          if (!purchase.transactionReceipt) continue;

          console.log("🧾 RECEIPT RECEIVED");
          await InAppPurchases.finishTransactionAsync(purchase, true);
        }
      });

    })();

    // 🔻 تنظيف الاتصال عند الخروج
    return () => {
      // ما في مشكلة لو لم يكن موجود على الويب
    };

  }, []);

  return (
    <PaperProvider theme={theme}>
      <RootLayout />
    </PaperProvider>
  );
}



