import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { Alert, Platform } from "react-native";

import { auth } from "../services/firestore";



export default function AppleLoginButton() {
  // 📌 إخفاء الزر على Android (Apple لا يعمل هناك)
  if (Platform.OS === "android") return null;

  const handleAppleLogin = async () => {
    try {
      const apple = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // ⚠ Apple أحيانًا لا يرجّع identityToken
      if (!apple.identityToken) {
        Alert.alert("فشل تسجيل الدخول", "Apple لم يرجّع identityToken");
        return;
      }

      const provider = new OAuthProvider("apple.com");

      const credential = provider.credential({
        idToken: apple.identityToken,
      });

      await signInWithCredential(auth, credential);

      console.log("🍎 Apple login success");
      Alert.alert("نجاح", "تم تسجيل الدخول بنجاح");
    }

    catch (err: any) {
      if (err?.code === "ERR_CANCELED") return; // المستخدم أغلق النافذة
      console.log("APPLE ERROR:", err);
      Alert.alert("خطأ في تسجيل Apple", err?.message ?? "Unknown error");
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={6}
      style={{ width: 220, height: 48, marginVertical: 8 }}
      onPress={handleAppleLogin}
    />
  );
}
