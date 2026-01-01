import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import { useAuthRequest } from 'expo-auth-session/providers/google';

interface GoogleLoginButtonProps {
  onLogin: (accessToken: string) => void;
}

export default function GoogleLoginButton({ onLogin }: GoogleLoginButtonProps) {
  const [request, response, promptAsync] = useAuthRequest({
    androidClientId: 'YOUR-ANDROID-CLIENT-ID.apps.googleusercontent.com',
    // iosClientId: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com', // لو تحتاج مستقبلاً
    // webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com', // لو تحتاج
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication && authentication.accessToken) {
        onLogin(authentication.accessToken); // اربطه بفنكشن تسجيلك بالفابيربيز الخ
        // يمكنك تجربة التنبيه:
        // Alert.alert('نجاح Google', JSON.stringify(authentication));
      }
    }
  }, [response, onLogin]);

  return (
    <Button
      title="تسجيل الدخول بواسطة Google"
      disabled={!request}
      onPress={() => promptAsync()}
      color="#FF9800"
    />
  );
}