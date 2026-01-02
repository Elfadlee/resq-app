import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firestore";

interface AppleLoginButtonProps {
  onSocialLogin?: (draft: any) => void;
}

export default function AppleLoginButton({ onSocialLogin }: AppleLoginButtonProps) {

  if (Platform.OS === "android") return null;

  const handleAppleLogin = async () => {
    try {

      const apple = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!apple.identityToken) {
        Alert.alert("فشل تسجيل الدخول", "Apple لم يرجّع identityToken");
        return;
      }

      // 🟢 استخراج الاسم — Apple يرسله فقط أول تسجيل
      let fullName =
        apple.fullName?.givenName && apple.fullName?.familyName
          ? `${apple.fullName.givenName} ${apple.fullName.familyName}`
          : "";

      // إذا وصل اسم لأول مرة → نخزّنه
      if (fullName) {
        await AsyncStorage.setItem("savedAppleName", fullName);
      } else {
        // إذا ما رجع الاسم لاحقًا → نقرأه من التخزين
        const stored = await AsyncStorage.getItem("savedAppleName");
        fullName = stored || "";
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: apple.identityToken,
      });

      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // 📦 تجهيز بيانات التسجيل للفورم
      const draft = {
        name: fullName || "",
        email: apple.email || user.email || "",
        mobile: "",
        jobTitle: "",
        area: "",
        description: "",
      };

      onSocialLogin?.(draft);

      Alert.alert(
        "إكمال التسجيل",
        "يرجى إكمال بيانات حسابك قبل المتابعة"
      );
    }

    catch (err: any) {
      if (err?.code === "ERR_CANCELED") return;
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
