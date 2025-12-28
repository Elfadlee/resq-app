import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDLLtv7N_uz7Pu-q7zzy975FBMgmK_MCq0",
  authDomain: "rezq-app.firebaseapp.com",
  projectId: "rezq-app",
  storageBucket: "rezq-app.appspot.com",
  messagingSenderId: "76390699570",
  appId: "1:76390699570:web:6a9294ab7f10d56378622b",
};

let app: FirebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

let auth: Auth;
let db: Firestore;

try {
  auth = getAuth(app);
  db = getFirestore(app);

  console.log(
    `🔥 Firebase initialized on ${
      Platform.OS === "web"
        ? "Web"
        : Platform.OS === "ios"
        ? "iOS"
        : "Android"
    }`
  );
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  // لا نعيد التهيئة هنا — فقط نطبع الخطأ
}

export { app, auth, db };
export default app;
