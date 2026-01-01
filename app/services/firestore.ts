import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDLltv7N_uz7Pu-q7zzy975FBMgmK_MCq0",
  authDomain: "rezq-app.firebaseapp.com",
  projectId: "rezq-app",
  storageBucket: "rezq-app.firebasestorage.app",
  messagingSenderId: "76390699570",
  appId: "1:76390699570:web:6a929a4b7f10d56378622b"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = getAuth(app);
  } catch {
    auth = initializeAuth(app, { 
      persistence: getReactNativePersistence(AsyncStorage) 
    });
  }
}
export { auth };
export const db = getFirestore(app);
export default app;