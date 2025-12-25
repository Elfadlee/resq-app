import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import LoginScreen from '../components/LoginScreen';
import RegistrationScreen from '../components/RegistrationScreen';
import PackagesScreen from '../components/PackagesScreen';
import ProfileBanner from '../components/ProfileBanner';

import {
  loginUser,
  getCurrentUser,
  getAllUsers,
  User
} from '../storage/userStorage';

type CurrentScreen = 'login' | 'register' | 'packages' | 'profile';

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] =
    useState<CurrentScreen>('login');
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('profile');
    }
  }, []);

  const handleLogin = (mobile: string, password: string) => {
    const user = loginUser(mobile, password);

    if (user) {
      setCurrentUser(user);
      setCurrentScreen('profile');
    } else {
      Alert.alert('❌ خطأ', 'رقم الجوال أو كلمة المرور غير صحيحة');
    }
  };

  const handleRegistrationNext = (data: any) => {
    setRegistrationData(data);
    setCurrentScreen('packages');
  };

    const handlePackageConfirm = (pkg: any) => {
      console.log("➡️ handlePackageConfirm CALLED", pkg);

      const newUser = { ...registrationData, ...pkg };
      setCurrentUser(newUser);

      Alert.alert('👍 تم الحفظ', 'سيتم تحويلك إلى ملفك الشخصي', [
        {
          text: 'موافق',
          onPress: () => {
            setRegistrationData(null);
            setCurrentScreen('profile');
          }
        }
      ]);
    };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onGoToRegister={() => setCurrentScreen('register')}
          />
        );

      case 'register':
        return (
          <RegistrationScreen
            onNext={handleRegistrationNext}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'packages':
        return (
          <PackagesScreen
            registrationData={registrationData}
            onConfirm={handlePackageConfirm}
            onBack={() => setCurrentScreen('register')}
          />
        );

      case 'profile':
        return (
          <ProfileBanner
            name={currentUser?.name || ''}
            jobTitle={currentUser?.jobTitle || ''}
            area={currentUser?.area || ''}
            mobile={currentUser?.mobile || ''}
            email={currentUser?.email || ''}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <AppHeader onMenuOpen={() => {}} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {renderScreen()}
      </ScrollView>
      <AppFooter />
    </SafeAreaView>
  );
}
