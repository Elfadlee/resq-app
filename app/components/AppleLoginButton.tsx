

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Alert, Platform, Text } from "react-native";
import { auth, db } from "../services/firestore";

interface AppleLoginButtonProps {
  onSocialLogin?: (draft: any) => void;
  onGoToProfile?: (user: any) => void;
}

export default function AppleLoginButton({ onSocialLogin, onGoToProfile }: AppleLoginButtonProps) {

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

      let fullName =
        apple.fullName?.givenName && apple.fullName?.familyName
          ? `${apple.fullName.givenName} ${apple.fullName.familyName}`
          : "";

      if (fullName) {
        await AsyncStorage.setItem("savedAppleName", fullName);
      } else {
        const stored = await AsyncStorage.getItem("savedAppleName");
        fullName = stored || "";
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: apple.identityToken,
      });

      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;


      const uid = user.uid;

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      
      console.log("UID =", uid);
      console.log("snap.exists =", snap.exists());
      console.log("user data =", snap.data());

      if (snap.exists()) {
  const userData = { id: snap.id, ...snap.data() };


  await AsyncStorage.setItem(
    "currentUser",
    JSON.stringify(userData)
  );


 onGoToProfile?.(userData);
  return;
}



      const draft = {
        name: fullName || "",
        email: apple.email || user.email || "",
        mobile: "",
        jobTitle: "",
        area: "",
        description: "",
        isSocialSignup: true,
      };

      onSocialLogin?.(draft);

      Alert.alert("إكمال التسجيل", "يرجى إكمال بيانات حسابك قبل المتابعة");
    }

    catch (err: any) {
      if (err?.code === "ERR_CANCELED") return;
      console.log("APPLE ERROR:", err);
      Alert.alert("خطأ في تسجيل Apple", err?.message ?? "Unknown error");
    }
  };

  return (
    <>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={6}
        style={{ width: 220, height: 48, marginVertical: 8, alignSelf: "center" }}
        onPress={handleAppleLogin}
      />

      <Text style={{
        textAlign: "center",
        marginVertical: 4,
        color: "#666",
        fontFamily: "Almarai"
      }}>
        تسجيل الدخول باستخدام Apple
      </Text>
    </>
  );
}