

import React, { useEffect } from 'react';
import { Button, Alert, Platform } from 'react-native';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../services/firestore";

// Props to callback after social login
interface GoogleLoginButtonProps {
  onSocialLogin: (user: any) => void;
}

export default function GoogleLoginButton({ onSocialLogin }: GoogleLoginButtonProps) {
  const [request, response, promptAsync] = useAuthRequest({
    androidClientId: 'YOUR-ANDROID-CLIENT-ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    const authenticate = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        if (authentication && authentication.accessToken) {
          // Firebase Google Auth
          const credential = GoogleAuthProvider.credential(null, authentication.accessToken);
          const userCredential = await signInWithCredential(auth, credential);
          // استدعاء الكولباك مع بيانات المستخدم للفحص هل جديد أو لا
          onSocialLogin && onSocialLogin(userCredential.user);
        }
      }
    };
    authenticate();
  }, [response, onSocialLogin]);

  // لا يظهر على iOS - فقط أندرويد
  if (Platform.OS !== "android") return null;

  return (
    <Button
      title="تسجيل الدخول بواسطة Google"
      disabled={!request}
      onPress={() => promptAsync()}
      color="#FF9800"
    />
  );
}