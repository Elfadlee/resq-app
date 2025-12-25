import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, View, ActivityIndicator } from 'react-native';

import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import LoginScreen from '../components/LoginScreen';
import RegistrationScreen from '../components/RegistrationScreen';
import PackagesScreen from '../components/PackagesScreen';
import ProfileBanner from '../components/ProfileBanner';
import ProfileEdit from '../components/ProfileEdit'; // ✅ استيراد ProfileEdit

import {
  registerUser,
  loginUser,
  getCurrentUser,
  User
} from '../storage/userStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CurrentScreen = 'login' | 'register' | 'packages' | 'profile' | 'editProfile' | 'upgradePackage';

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('login');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('profile');
    }
    setLoading(false);
  };

  const handleLogin = async (mobile: string, password: string) => {
    const user = await loginUser(mobile, password);

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

  const handlePackageConfirm = async (pkg: any) => {
    const newUser = { ...registrationData, ... pkg };
    const user = await registerUser(newUser);
    setCurrentUser(user);
    setRegistrationData(null);
    setCurrentScreen('profile');
  };

  // Navigation object محاكي
  const navigation = {
    navigate: (screenName: string, params?: any) => {
      console.log('Navigate to:', screenName, params);
      
      if (screenName === 'EditProfile') {
        setCurrentScreen('editProfile');
      } else if (screenName === 'PackagesScreen') {
        setCurrentScreen('upgradePackage');
      }
    },
    goBack: () => {
      console.log('Go back');
      setCurrentScreen('profile');
      loadUser(); // تحديث البيانات عند العودة
    },
    reset: (config:  any) => {
      console. log('Reset navigation', config);
      setCurrentScreen('login');
      setCurrentUser(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#FF9800" />
      </SafeAreaView>
    );
  }

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
        return currentUser ? (
          <ProfileBanner 
            navigation={navigation} 
            onRefresh={loadUser} 
          />
        ) : null;

      case 'editProfile':  
        return currentUser ? (
          <ProfileEdit
            navigation={navigation}  // ✅ تمرير navigation
            route={{                 // ✅ إنشاء route object كامل
              params: {
                profile: currentUser,
                onSave: async () => {
                  await loadUser(); // إعادة تحميل البيانات
                }
              }
            }}
          />
        ) : null;

      case 'upgradePackage': 
        return currentUser ? (
          <PackagesScreen
            registrationData={currentUser}
            onConfirm={async (newPackageData:  any) => {
              try {
                const updatedProfile = {
                  ...currentUser,
                  ... newPackageData,
                };
                await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                
                // تحديث allUsers أيضاً
                const allUsersData = await AsyncStorage.getItem('allUsers');
                if (allUsersData) {
                  const allUsers = JSON. parse(allUsersData);
                  const userIndex = allUsers.findIndex(
                    (u: any) => u.mobile === currentUser.mobile || u.id === currentUser.id
                  );
                  if (userIndex !== -1) {
                    allUsers[userIndex] = updatedProfile;
                    await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));
                  }
                }

                Alert.alert('نجاح', 'تم تحديث الباقة بنجاح');
                setCurrentUser(updatedProfile);
                setCurrentScreen('profile');
                await loadUser();
              } catch (error) {
                console.error('Error updating package:', error);
                Alert.alert('خطأ', 'فشل تحديث الباقة');
              }
            }}
            onBack={() => {
              setCurrentScreen('profile');
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex:  1, backgroundColor: '#f5f5f5' }}>
      <AppHeader onMenuOpen={() => {}} />

      <ScrollView 
        contentContainerStyle={{ paddingBottom:  24, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {renderScreen()}
      </ScrollView>

      <AppFooter />
    </SafeAreaView>
  );
}