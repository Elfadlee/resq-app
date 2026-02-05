
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { serverTimestamp, doc, setDoc, increment, addDoc, collection } from "firebase/firestore";
import * as React from 'react';
import { useState } from 'react';
import {

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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useModal } from '../components/ModalProvider';
import * as Notifications from "expo-notifications";





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
    quarterly: "rizq.basic.quarterly.free",
  },
};


type PackagesScreenProps = {
  registrationData: any;
  onConfirm: (packageData: any) => void;
  onBack: () => void;
  onNavigate: (route: string, section?: "privacy" | "terms" | "subscriptions") => void;
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
      'يتجدد تلقائيًا بعد انتهاء الفترة',
      'يمكن إلغاء الاشتراك في أي وقت',
      'يظهر في نتائج البحث بعد الضغط على زر البحث',
      'لا يظهر في الشاشه الرئيسيه',
      'أولوية الظهور: بعد باقتي أعمال واحترافي',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    nameAr: 'أساسي',
    icon: 'star-outline',
    color: '#2196F3',
    monthlyPrice: 9,
    quarterlyPrice: 25,
    features: [
      'يتجدد تلقائيًا بعد انتهاء الفترة',
      'يمكن إلغاء الاشتراك في أي وقت',
      'يظهر في نتائج البحث بعد الضغط على زر البحث',
      'لا يظهر في الشاشه الرئيسيه',
      'أولوية الظهور: بعد باقتي الاعمال واحترافي',
      'عدد غير محدود من الطلبات ',
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
      'يتجدد تلقائيًا بعد انتهاء الفترة',
      'يمكن إلغاء الاشتراك في أي وقت',
      'يظهر في الصفحة الرئيسية تحت زر البحث',
      'أولوية الظهور: بعد باقة الاعمال',
      'عدد غير محدود من الطلبات ',
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
      'يتجدد تلقائيًا بعد انتهاء الفترة',
      'يمكن إلغاء الاشتراك في أي وقت',
      'يظهر في بنر الإعلانات في الصفحة الرئيسية',
      'الأولوية الاعلي في نتائج البحث',
      'عدد غير محدود من الطلبات ',
    ],
  },
];




export default function PackagesScreen({
  registrationData,
  onConfirm,
  onBack,
  onNavigate,
}: PackagesScreenProps) {

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] =
    useState<'monthly' | 'quarterly'>('monthly');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const hasPreviousSubscription =
    !!registrationData?.subscription?.package &&
    registrationData.subscription.package !== 'trial_auto_renew';
  const visiblePackages = SUBSCRIPTION_PACKAGES.filter(pkg => {
    if (pkg.id === 'trial_auto_renew' && hasPreviousSubscription) return false;
    return true;
  });
  const { showModal } = useModal();



  const showError = (msg: string) => {
    showModal({
      title: "خطأ",
      message: msg,
      primaryText: "موافق",
    });
  };

  const showInfo = (title: string, msg: string) => {
    showModal({
      title,
      message: msg,
      primaryText: "موافق",
    });
  };


  const handleConfirm = async () => {
    Keyboard.dismiss();

    let expoPushToken: string | null = null;

    try {
      expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (e) {
      console.log("⚠️ Could not get push token", e);
    }



    if (!selectedPackage) {
      showError('يرجى اختيار باقة الاشتراك');
      return;
    }

    if (!acceptPolicy) {
      showError('يرجى الموافقة على سياسة الخصوصية');
      return;
    }

    if (selectedPackage === 'trial_auto_renew' && hasPreviousSubscription) {
      showInfo('غير متاح', 'لا يمكن تفعيل الباقة التجريبية أكثر من مرة');
      return;
    }



    const pkg = SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg) {
      showError('الباقة غير موجودة، حاول مرة أخرى');
      return;
    }

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

    if (pkg?.id !== "trial_auto_renew") {
      const productMapEntry = PRODUCT_MAP[pkg!.id as keyof typeof PRODUCT_MAP];
      const productId =
        selectedDuration in productMapEntry
          ? productMapEntry[selectedDuration as keyof typeof productMapEntry]
          : undefined;

      if (!productId) {
        showError('نوع الاشتراك غير متوفر لهذه الباقة');
        return;
      }

      console.log("🛒 Purchasing:", productId);
      await buy(productId);
    }



    let authUser = auth.currentUser;


    if (
      !authUser &&
      registrationData?.signupType === "manual" &&
      registrationData?.email &&
      registrationData?.password
    ) {
      const cred = await createUserWithEmailAndPassword(
        auth,
        registrationData.email.trim(),
        registrationData.password
      );
      authUser = cred.user;
    }


    const userData = {
      ...registrationData,

      expoPushToken: expoPushToken || null,

      subscription: {
        package: pkg?.id || "basic",
        packageName: pkg?.nameAr || "أساسي",
        duration: selectedDuration,
        price: price || 0,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        isActive: true,
        status: "active",
      },
      ad: {
        status: "pending",
        isVisible: false,
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

      if (authUser?.uid) {
        userId = authUser.uid;
      }



      if (!userId) {
        showError("لا يوجد مستخدم مصادق عليه");
        return;
      }
      await setDoc(doc(db, "users", userId), userData, { merge: true });


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



      onConfirm(cachedUser);

      showInfo("تم التسجيل ✅", "تم حفظ بياناتك بنجاح");

    } catch (error) {
      console.log("Firestore error:", error);
      showError("تعذر حفظ البيانات — حاول مرة أخرى");
    }
  };

  return (
    <ScrollView
      // key={selectedPackage ?? 'packages'}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >


      <View style={styles.formCard}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="crown" size={40} color="#FF9800" />
          <Text style={styles.headerTitle}>اختيار باقة الاشتراك</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.subscriptionSection}>
            <View style={styles.subscriptionHeader}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={24}
                color="#FF9800"
              />
              <Text style={styles.subscriptionSectionTitle}>
                اختر باقة الاشتراك
              </Text>
            </View>

            <View style={styles.durationToggle}>
              <TouchableOpacity
                style={[
                  styles.durationButton,
                  selectedDuration === 'monthly' &&
                  styles.durationButtonActive,
                ]}
                onPress={() => setSelectedDuration('monthly')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    selectedDuration === 'monthly' &&
                    styles.durationButtonTextActive,
                  ]}
                >
                  شهري
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.durationButton,
                  selectedDuration === 'quarterly' &&
                  styles.durationButtonActive,
                ]}
                onPress={() => setSelectedDuration('quarterly')}
                activeOpacity={0.8}
              >
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>وفر 15%</Text>
                </View>
                <Text
                  style={[
                    styles.durationButtonText,
                    selectedDuration === 'quarterly' &&
                    styles.durationButtonTextActive,
                  ]}
                >
                  ربع سنوي
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.packagesContainer}>
              {visiblePackages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;

                const displayedPrice =
                  pkg.id === 'trial_auto_renew'
                    ? "مجانا"
                    : selectedDuration === 'monthly'
                      ? `$${pkg.monthlyPrice}`
                      : `$${pkg.quarterlyPrice}`;

                const displayedPeriod =
                  pkg.id === 'trial_auto_renew'
                    ? '3 شهور'
                    : selectedDuration === 'monthly'
                      ? 'شهر'
                      : '3 أشهر';

                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      isSelected && styles.packageCardSelected,
                      { borderColor: isSelected ? pkg.color : '#e0e0e0' },
                    ]}
                    onPress={() => setSelectedPackage(pkg.id)}
                    activeOpacity={0.8}
                  >
                    {pkg.id === 'pro' && (
                      <View
                        style={[
                          styles.popularBadge,
                          { backgroundColor: pkg.color },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="fire"
                          size={14}
                          color="#fff"
                        />
                        <Text style={styles.popularBadgeText}>
                          الأكثر شعبية
                        </Text>
                      </View>
                    )}

                    <View style={styles.packageContent}>
                      <View style={styles.packageLeft}>
                        <View
                          style={[
                            styles.packageIcon,
                            { backgroundColor: pkg.color + '20' },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={pkg.icon as any}
                            size={32}
                            color={pkg.color}
                          />
                        </View>

                        <View style={styles.packageInfo}>
                          <Text style={styles.packageName}>
                            {pkg.nameAr}
                          </Text>
                          <Text style={styles.packageNameEn}>
                            {pkg.name}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.packageRight}>
                        <Text
                          style={[
                            styles.packagePriceAmount,
                            { color: pkg.color },
                          ]}
                        >
                          {displayedPrice}
                        </Text>
                        <Text style={styles.packagePricePeriod}>
                          {displayedPeriod}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.packageFeatures}>
                      {pkg.features.map((feature, index) => (
                        <View key={index} style={styles.packageFeature}>
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={16}
                            color={pkg.color}
                          />
                          <Text style={styles.packageFeatureText}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.selectionIndicator,
                          { backgroundColor: pkg.color },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="check"
                          size={20}
                          color="#fff"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptPolicy(!acceptPolicy)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                acceptPolicy && styles.checkboxChecked,
              ]}
            >
              {acceptPolicy && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="#fff"
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.policyText}>
                أوافق على{" "}
                <Text
                  style={styles.policyLink}
                  onPress={() => showInfo("سياسة الخصوصية", "يمكنك الاطلاع على سياسة الخصوصية والاشتراكات من القائمة الجانبية")}

                >
                  سياسة الخصوصية والشروط
                </Text>
              </Text>

              <Text style={styles.policyText}>
                وأوافق على نشر رقم هاتفي للتواصل عبر واتساب
              </Text>
            </View>
          </TouchableOpacity>


          <View style={styles.divider} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#fff"
              />
              <Text style={styles.submitButtonText}>
                تأكيد التسجيل
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#FF9800"
              />
              <Text style={styles.backButtonText}>
                العودة للبيانات الشخصية
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: {
    paddingBottom: 32,
    alignItems: 'stretch',
  },

  formCard: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  header: { alignItems: 'center', marginBottom: 24, gap: 12 },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  form: { gap: 16 },
  subscriptionSection: { marginTop: 8, gap: 16 },
  subscriptionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subscriptionSectionTitle: {
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
    color: '#1a1a1a',
  },
  durationToggle: {
    flexDirection: 'row-reverse',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  durationButtonActive: { backgroundColor: '#FF9800' },
  durationButtonText: {
    fontSize: 13,
    fontFamily: 'Almarai-Bold',
    color: '#666',
  },
  durationButtonTextActive: { color: '#fff' },
  saveBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 9,
    fontFamily: 'Almarai-Bold',
    color: '#fff',
  },
  packagesContainer: { gap: 12 },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    position: 'relative',
  },
  packageCardSelected: { borderWidth: 3 },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 10,
    fontFamily: 'Almarai-Bold',
    color: '#fff',
  },
  packageContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  packageIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageInfo: { gap: 4 },
  packageName: {
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  packageNameEn: {
    fontSize: 13,
    fontFamily: 'Almarai-Regular',
    color: '#666',
    textAlign: 'right',
  },
  packageRight: { alignItems: 'flex-end' },
  packagePriceAmount: { fontSize: 28, fontFamily: 'Almarai-Bold', marginTop: 22, },
  packagePricePeriod: {
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#666',
    marginTop: 2,
  },
  packageFeatures: { gap: 8 },
  packageFeature: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 8,
  },
  packageFeatureText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Almarai-Regular',
    color: '#333',
    textAlign: 'right',
    lineHeight: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: '#FF9800' },
  policyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Almarai-Regular',
    color: '#555',
    textAlign: 'right',
  },
  policyLink: {
    color: '#FF9800',
    fontFamily: 'Almarai-Bold',
    textDecorationLine: 'underline',
  },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8 },
  buttonContainer: { gap: 12, marginTop: 8 },
  submitButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#FF9800',
  },
});