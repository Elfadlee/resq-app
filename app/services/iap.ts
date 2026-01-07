import { Platform, Alert } from "react-native";
import Constants from "expo-constants";   // ⭐ تمت الإضافة

let IAP: any = null;
let isConnected = false;
let loadedProducts: any[] = [];

// ⭐ نعرّف هل التطبيق يعمل داخل Expo Go
const isExpoGo = Constants.appOwnership === "expo";

const PRODUCT_IDS = [
  "rizq.basic.quarterly_free",
  "rizq.basic.quarterly",
  "rizq.pro.quarterly",
  "rizq.business.quarterly",
  "rizq.basic.monthly.plan",
  "rizq.pro.monthly",
  "rizq.business.monthly",
];

async function loadIAP() {

  // ⭐ لا نحمل المكتبة على الويب / أندرويد / Expo Go
  if (Platform.OS !== "ios" || isExpoGo) {
    console.log("IAP disabled in Expo Go / non-iOS");
    return;
  }

  if (!IAP) {
    try {
      IAP = await import("expo-in-app-purchases");  // ⭐ ملفف بـ try/catch
    } catch {
      console.log("IAP module not available — skipping");
      IAP = null;
      return;
    }
  }
}

export async function initIAP() {
  await loadIAP();

  // ⭐ إذا لا يوجد IAP → لا نفعل شيء
  if (!IAP || Platform.OS !== "ios" || isExpoGo) return;

  if (isConnected) return;

  try {
    await IAP.connectAsync();
    isConnected = true;
  } catch (e: any) {
    if (e?.message?.includes("Already connected")) {
      console.log("IAP already connected — continue");
      isConnected = true;
    } else {
      console.log("IAP connect error", e);
      return;
    }
  }

  const { responseCode, results } =
    await IAP.getProductsAsync(PRODUCT_IDS);

  if (responseCode === IAP.IAPResponseCode.OK) {
    loadedProducts = results ?? [];
  }
}


// 🛒 الشراء — iOS Build فقط (وليس Expo Go)
export async function buy(productId: string) {

  // ⭐ Expo Go / Web / Android → رسالة فقط بدون كراش
  if (Platform.OS !== "ios" || isExpoGo) {
    console.log("IAP disabled — UI mode only");
    Alert.alert("تنبيه", "الدفع يعمل فقط في نسخة iOS Build / TestFlight");
    return;
  }

  await initIAP();

  const product = loadedProducts.find(p => p.productId === productId);
  if (!product) {
    Alert.alert("خطأ", "المنتج غير متاح حالياً");
    return;
  }

  await IAP.purchaseItemAsync(product.productId);
}
