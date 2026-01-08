import { Platform, Alert } from "react-native";
import Constants from "expo-constants";  

let IAP: any = null;
let isConnected = false;
let loadedProducts: any[] = [];


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


  if (Platform.OS !== "ios" || isExpoGo) {
    console.log("IAP disabled in Expo Go / non-iOS");
    return;
  }

  if (!IAP) {
    try {
      // IAP = await import("expo-in-app-purchases");  
      IAP = require("expo-in-app-purchases");
    } catch {
      console.log("IAP module not available — skipping");
      IAP = null;
      return;
    }
  }
}

export async function initIAP() {
  await loadIAP();


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



export async function buy(productId: string) {


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
