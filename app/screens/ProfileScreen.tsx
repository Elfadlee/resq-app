import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, ActivityIndicator } from 'react-native';
import LoginScreen from '../components/LoginScreen';
import RegistrationScreen from '../components/RegistrationScreen';
import PackagesScreen from '../components/PackagesScreen';
import ProfileBanner from '../components/ProfileBanner';
import ProfileEdit from '../components/ProfileEdit';
import storage from '../services/storage-helper';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firestore";

import ContactScreen from './ContactScreen';
import AppDrawer from '../components/AppDrawer';

const USERS_KEY = "allUsers";
const CURRENT_USER_KEY = "currentUser";

const getCurrentUser = async (): Promise<User | null> => {
  return await storage.getObject<User>(CURRENT_USER_KEY);
};

type CurrentScreen =
  | 'login' | 'register' | 'packages'
  | 'profile' | 'editProfile'
  | 'upgradePackage' | 'contact';

type User = {
  id?: string;
  name: string;
  mobile: string;
  password: string;
  jobTitle: string;
  area: string;
  description?: string;
  subscription?: any;
};

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('login');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [registrationData, setRegistrationData] = useState<any>(null);
  const [registrationParams, setRegistrationParams] = useState<any>(null);

  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);

    const storedUser = await getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setCurrentScreen("profile");
      setLoading(false);
      return;
    }


    const uid = auth.currentUser?.uid;
    if (uid) {
      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        const userData = { id: snap.id, ...(snap.data() as any) };


        await storage.setObject(CURRENT_USER_KEY, userData);

        setCurrentUser(userData);
        setCurrentScreen("profile");
        setLoading(false);
        return;
      }
    }


    setCurrentScreen("login");
    setLoading(false);
  };


  const handleLogin = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      setCurrentUser({ id: userDoc.id, ...(userDoc.data() as User) });
      setCurrentScreen("profile");
    } else {
      setRegistrationData({ email });
      setCurrentScreen("register");
    }
  };

  const handleRegistrationNext = (data: any) => {
    setRegistrationData(data);
    setCurrentScreen('packages');
  };

  const handlePackageConfirm = async (pkg: any) => {
    const newUser = { ...registrationData, ...pkg };
    setCurrentUser(newUser);
    setRegistrationData(null);
    setCurrentScreen('profile');
  };

  // ---------------- NAVIGATION SIMULATOR ----------------
  const navigation = {
    navigate: (screenName: string, params?: any) => {
      console.log("Navigate to:", screenName, params);

      if (screenName === "EditProfile") {
        setCurrentScreen("editProfile");
      }

      else if (screenName === "PackagesScreen") {
        setCurrentScreen("upgradePackage");
      }

      else if (screenName === "Registration") {

        if (params?.initialData) {
          setRegistrationParams(params.initialData);
        } else {
          setRegistrationParams(null);
        }

        setIsSocialSignup(!!params?.isSocialSignup);
        setCurrentScreen("register");
      }
    },

    goBack: () => {
      setCurrentScreen("profile");
      loadUser();
    },

    reset: () => {
      setCurrentScreen("login");
      setCurrentUser(null);
    }
  };
  // ------------------------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF9800" />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            navigation={navigation}
            onLogin={handleLogin}


            onGoToRegister={(params?: any) => {

              if (params?.initialData) {
                setRegistrationParams(params.initialData);
              } else {
                setRegistrationParams(null);
              }

              setIsSocialSignup(!!params?.isSocialSignup);
              setCurrentScreen("register");
            }}


            goToProfile={(user) => {
              setCurrentUser(user);
              setCurrentScreen("profile");
            }}

          />

        );

      case 'register':
        return (
          <RegistrationScreen
            initialData={registrationParams}
            isSocialSignup={isSocialSignup}
            onNext={handleRegistrationNext}
            onBackToLogin={() => setCurrentScreen("login")}
          />
        );

      case 'packages':
        return (
          <PackagesScreen
            registrationData={registrationData}
            onConfirm={handlePackageConfirm}
            onBack={() => setCurrentScreen("register")}
          />
        );

      case 'profile':
        return currentUser && (
          <ProfileBanner navigation={navigation} onRefresh={loadUser} />
        );

      case 'editProfile':
        return currentUser && (
          <ProfileEdit
            navigation={navigation}
            route={{ params: { profile: currentUser } }}
          />
        );

      case 'upgradePackage':
        return (
          <PackagesScreen
            registrationData={currentUser}
            onConfirm={() => setCurrentScreen("profile")}
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case 'contact':
        return <ContactScreen />;

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {/* HEADER نفس MainScreen */}


      {/* المحتوى مع سكرول فقط */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f5f5f5' }}>
        {renderScreen()}
      </ScrollView>

      {/* FOOTER نفس MainScreen */}


      {/* Drawer دائماً خارج */}
      <AppDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(route) => {
          setCurrentScreen(route === "contact" ? "contact" : (route as any));
          setDrawerOpen(false);
        }}
      />
    </React.Fragment>
  );
}