import { MaterialCommunityIcons } from '@expo/vector-icons';
import { serverTimestamp, doc, setDoc, increment, addDoc, collection } from "firebase/firestore";
import * as React from 'react';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../services/firestore';
import { auth } from '../services/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buy } from "../services/iap";


// ✳️ خريطة ربط الباقات مع Product IDs الخاصة بمتجر Apple
const PRODUCT_MAP = {
  basic: {
    monthly: "rizq.basic.monthly.plan",
    quarterly: "rizq.basic.quarterly",
  },
  pro: {
    monthly: "rizq.pro.monthly",
    quarterly: "rizq.pro.quarterly",
  },
  business: {
    monthly: "rizq.business.monthly",
    quarterly: "rizq.business.quarterly",
  },
  trial_auto_renew: {
    quarterly: "rizq.basic.quarterly_free"
  }
};


type PackagesScreenProps = {
  registrationData: any;
  onConfirm: (packageData: any) => void;
  onBack: () => void;
};

type SubscriptionPackage = {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  features: string[];
};

const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'trial_auto_renew',
    name: 'Trial 3 Months',
    nameAr: '3 شهور مجاناً',
    icon: 'gift',
    color: '#4CAF50',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    features: [
      '3 شهور مجانا',
      'يتجدد تلقائياً ب25 دولار كل 3 شهور بعد انتهاء التجربة',
      'إلغاء الاشتراك في أي وقت',
      'جميع مميزات باقة احترافي',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    nameAr: 'أساسي',
    icon: 'star-outline',
    color: '#2196F3',
    monthlyPrice: 7,
    quarterlyPrice: 20,
    features: [
      'عرض الملف الشخصي',
      'استقبال 10 طلبات شهرياً',
      'دعم فني أساسي',
      'إشعارات الطلبات',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    nameAr: 'احترافي',
    icon: 'star',
    color: '#FF9800',
    monthlyPrice: 25,
    quarterlyPrice: 70,
    features: [
      'جميع مميزات الباقة الأساسية',
      'استقبال طلبات غير محدودة',
      'ظهور مميز في نتائج البحث',
      'دعم فني ذو أولوية',
      'إحصائيات تفصيلية',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    nameAr: 'أعمال',
    icon: 'crown',
    color: '#9C27B0',
    monthlyPrice: 75,
    quarterlyPrice: 200,
    features: [
      'جميع مميزات الباقة الاحترافية',
      'أولوية قصوى في نتائج البحث',
      'إعلانات مميزة',
      'مدير حساب مخصص',
      'تقارير شهرية',
    ],
  },
];

export default function PackagesScreen({
  registrationData,
  onConfirm,
  onBack,
}: PackagesScreenProps) {

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] =
    useState<'monthly' | 'quarterly'>('monthly');
  const [acceptPolicy, setAcceptPolicy] = useState(false);


  const handleConfirm = async () => {
    Keyboard.dismiss();

    if (!selectedPackage) {
      Alert.alert('خطأ', 'يرجى اختيار باقة الاشتراك');
      return;
    }

    if (!acceptPolicy) {
      Alert.alert('خطأ', 'يرجى الموافقة على سياسة الخصوصية');
      return;
    }

    const pkg = SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage);

    const price =
      selectedPackage === 'trial_auto_renew'
        ? 0
        : selectedDuration === 'monthly'
          ? pkg?.monthlyPrice
          : pkg?.quarterlyPrice;

    const startAt = new Date();
    const endAt = new Date(startAt);

    if (selectedPackage === 'trial_auto_renew') {
      endAt.setMonth(endAt.getMonth() + 3);
    } else {
      selectedDuration === 'monthly'
        ? endAt.setMonth(endAt.getMonth() + 1)
        : endAt.setMonth(endAt.getMonth() + 3);
    }


    // ✳️ هنا التعديل المهم — نحدد Product ID الصحيح قبل الشراء
    if (pkg?.id !== "trial_auto_renew") {
      const productId =
        PRODUCT_MAP[pkg!.id][selectedDuration];

      console.log("🛒 Purchasing:", productId);
      await buy(productId);
    }


    const userData = {
      ...registrationData,
      subscription: {
        package: pkg?.id || "basic",
        packageName: pkg?.nameAr || "أساسي",
        duration: selectedDuration,
        price: price || 7,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        isActive: false,
        status: "pending",
      },
      status: { approved: true, suspended: false },
      metadata: {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      },
    };

    try {
      let userId: string | null = null;

      if (auth.currentUser?.uid) {
        userId = auth.currentUser.uid;
      }

      if (!userId) {
        const docRef = await addDoc(collection(db, "users"), userData);
        userId = docRef.id;
      } else {
        await setDoc(doc(db, "users", userId), userData, { merge: true });
      }

      const cachedUser = {
        id: userId,
        uid: userId,
        ...registrationData,
        subscription: userData.subscription,
        status: userData.status,
        metadata: {
          createdAt: startAt.toISOString(),
          updatedAt: startAt.toISOString(),
          lastLogin: startAt.toISOString(),
        },
      };

      await AsyncStorage.setItem("currentUser", JSON.stringify(cachedUser));
      await AsyncStorage.setItem("userProfile", JSON.stringify(cachedUser));

      await setDoc(
        doc(db, "lookup_professions", registrationData.jobTitle),
        { count: increment(1) },
        { merge: true }
      );

      await setDoc(
        doc(db, "lookup_areas", registrationData.area),
        { count: increment(1) },
        { merge: true }
      );

      await setDoc(
        doc(db, "lookup_packages", userData.subscription.package),
        { count: increment(1) },
        { merge: true }
      );

      onConfirm(cachedUser);

      Alert.alert("👍 تم التسجيل", "تم حفظ بياناتك بنجاح");

    } catch (error) {
      console.log("Firestore error:", error);
      Alert.alert("خطأ", "تعذر حفظ البيانات — حاول مرة أخرى");
    }
  };

  // 🔻 بقية واجهة التصميم كما هي بدون تغيير …
}
