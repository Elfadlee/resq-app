

import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import storage from '../services/storage-helper';
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";        // ❗️ CHANGED: Added onSnapshot here
import { db, auth } from "../services/firestore";
import { signOut } from "firebase/auth";
import { updateDoc } from "firebase/firestore";




type UserProfile = {
  uid?: string;
  id?: string;
  name: string;
  jobTitle: string;
  area: string;
  mobile: string;
  email: string;
  description: string;
  password: string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  subscription?: {
    isActive?: boolean;
    package?: string;
    duration?: 'monthly' | 'quarterly';
    price?: number;
    startAt?: string;
    endAt?: string;
  };
  ad?: {
    isVisible?: boolean;
    status?: string;
    [key: string]: any;
  };
};

type ProfileBannerProps = {
  navigation: any;
  onRefresh?: () => void;
};
const SUBSCRIPTION_ICONS: Record<string, { icon: string; color: string }> = {
  trial_auto_renew: { icon: "gift", color: "#4CAF50" },
  basic: { icon: "star-outline", color: "#2196F3" },
  pro: { icon: "star", color: "#FF9800" },
  business: { icon: "crown", color: "#9C27B0" },
};


export default function ProfileBanner({ navigation }: ProfileBannerProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const subscriptionIcon =
    profile && SUBSCRIPTION_ICONS[profile.subscriptionPackage]
      ? SUBSCRIPTION_ICONS[profile.subscriptionPackage]
      : { icon: "help-circle-outline", color: "#999" };



  function isAccountActive(p: UserProfile) {
    const v = p.subscription?.isActive;
    return v === true || v === "true" || v === 1;
  }


  useEffect(() => {
    let unsubscribe: any;
    const setupListener = async () => {
      let userId = auth.currentUser?.uid;
      if (!userId) {
        const user = await storage.getObject<any>('currentUser');
        userId = user?.id;
      }
      if (!userId) {
        await storage.clear();
        navigation?.reset?.({
          index: 0,
          routes: [{ name: "Login" }],
        });
        return;
      }
      const userRef = doc(db, 'users', userId);

      unsubscribe = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Flat mapping just like before
          const mapped: UserProfile = {
            ...userData,
            subscriptionPackage: userData.subscription?.package || '',
            subscriptionDuration: userData.subscription?.duration || '',
            subscriptionPrice: userData.subscription?.price || 0,
            subscriptionStart: userData.subscription?.startAt || '',
            subscriptionEnd: userData.subscription?.endAt || '',
          };
          setProfile(mapped);
          storage.setObject('currentUser', mapped); // optional: update cache
        }
        setLoading(false);
      }, (error) => {
        console.error('Error loading profile snapshot:', error);
        setLoading(false);
      });
    };
    setupListener();
    return () => unsubscribe && unsubscribe();
  }, []);



  // ⛔️ Auto-disable subscription when expired
  useEffect(() => {
    if (!profile?.subscriptionEnd) return;

    const now = new Date();
    const end = new Date(profile.subscriptionEnd);

    if (end < now && profile.subscription?.isActive === true) {
      const uid = profile.uid || profile.id || auth.currentUser?.uid;
      if (!uid) return;

      updateDoc(doc(db, "users", uid), {
        "subscription.isActive": false,
        "subscription.status": "expired",
        "ad.isVisible": false,
      });
    }
  }, [profile]);



  // unchanged logic for saving locally
  const saveProfileEverywhere = async (updated: UserProfile) => {
    await storage.setObject('currentUser', updated);
    const allUsers = (await storage.getObject<UserProfile[]>('allUsers')) || [];
    const index = allUsers.findIndex(
      u => u.mobile === updated.mobile
    );
    if (index !== -1) allUsers[index] = updated;
    else allUsers.push(updated);
    await storage.setObject('allUsers', allUsers);
    setProfile(updated);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const handleEditProfile = () => {
    if (!profile) return;
    if (!navigation?.navigate) return Alert.alert('خطأ', 'لا يمكن فتح شاشة ا��تعديل');

    navigation.navigate('EditProfile', {
      profile,
      onSave: async (updated: UserProfile) => {
        await saveProfileEverywhere(updated);
        // ❗️ CHANGED: No need to call loadProfile now, Firestore will update profile automatically
      },
    });
  };

  const handleUpgradeSubscription = () => {
    if (!profile) return;
    navigation?.navigate?.('PackagesScreen', {
      mode: 'upgrade',
      currentProfile: profile,
      registrationData: profile,
      onConfirm: async (pkg: any) => {
        const updated = { ...profile, ...pkg };
        await saveProfileEverywhere(updated);
        Alert.alert('نجاح', 'تم ترقية الباقة بنجاح');
      },
      onBack: () => navigation.goBack(),
    });
  };

  const handleRenewSubscription = () => {
    Alert.alert('تجديد الاشتراك', 'هل تريد تجديد اشتراكك؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تجديد',
        onPress: () => {
          navigation?.navigate?.('PackagesScreen', {
            mode: 'renew',
            currentProfile: profile,
            registrationData: profile,
            onConfirm: async (pkg: any) => {
              if (!profile) return;
              const updated = { ...profile, ...pkg };
              await saveProfileEverywhere(updated);
              Alert.alert('نجاح', 'تم تجديد الاشتراك بنجاح');
            },
            onBack: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  const confirmDeleteAccount = async () => {
    try {
      const uid = profile?.uid || profile?.id || auth.currentUser?.uid || null;
      if (!uid) {
        Alert.alert("خطأ", "لم يتم العثور على معرف المستخدم (UID)");
        return;
      }
      const userRef = doc(db, "users", uid);
      try {
        await deleteDoc(userRef);
      } catch (err) {
        Alert.alert("خطأ", "فشل حذف الحساب من قاعدة البيانات");
        return;
      }
      await storage.removeItem("currentUser");
      await storage.removeItem("allUsers");
      Alert.alert("تم حذف الحساب", "تم حذف حسابك بنجاح", [
        {
          text: "حسناً",
          onPress: () => {
            setProfile?.(null);
            navigation?.reset?.({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]);
    } catch (e) {
      Alert.alert("خطأ", "حدث خطأ غير متوقع أثناء الحذف");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من حذف حسابك؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: confirmDeleteAccount },
      ],
      { cancelable: true },
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log("signOut error", e);
    }
    await storage.clear();
    navigation?.reset?.({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );

  if (!profile)
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={60} color="#E53E3E" />
        <Text style={styles.errorText}>لم يتم العثور على بيانات الملف الشخصي</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            try {
              await signOut(auth);
            } catch { }

            await storage.clear();
            navigation?.reset?.({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Text style={styles.retryButtonText}>الرجوع إلى تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    );


  const daysRemaining = calculateDaysRemaining(profile.subscriptionEnd);
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.jobBadge}>
            <Text style={styles.jobTitle}>{profile.jobTitle}</Text>
            <MaterialCommunityIcons name="briefcase" size={16} color="#FF9800" />
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>{profile.area}</Text>
            <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
          </View>
        </View>


        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            <MaterialCommunityIcons name="account-circle" size={24} color="#FF9800" />
          </View>

          <InfoRow icon="phone" label="رقم الهاتف" value={profile.mobile} />
          <InfoRow icon="email" label="البريد الإلكتروني" value={profile.email} />


          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={styles.label}>كلمة المرور</Text>
              <Text style={styles.value}>
                {showPassword ? profile.password : '••••••••'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#faaf3f"
              />
            </TouchableOpacity>
          </View>

          <InfoRow icon="text" label="الوصف" value={profile.description} />

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>تعديل المعلومات</Text>
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>معلومات الاشتراك</Text>

            <MaterialCommunityIcons
              name={subscriptionIcon.icon as any}
              size={26}
              color={subscriptionIcon.color}
            />
          </View>


          <View style={styles.subscriptionHeader}>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>$</Text>
              <Text style={styles.price}>{profile.subscriptionPrice}</Text>
            </View>

            <View
              style={[
                styles.packageBadge,
                { backgroundColor: subscriptionIcon.color },
              ]}
            >
              <Text style={styles.packageText}>
                {profile.subscriptionPackage}
              </Text>

              <MaterialCommunityIcons
                name={subscriptionIcon.icon as any}
                size={20}
                color="#fff"
              />
            </View>


          </View>

          <View style={styles.subscriptionDetails}>
            <InfoRow
              icon="calendar-clock"
              label="مدة الاشتراك"
              value={profile.subscriptionDuration === 'monthly' ? 'شهري' : 'ربع سنوي'}
            />
            <InfoRow
              icon="calendar-start"
              label="تاريخ البدء"
              value={formatDate(profile.subscriptionStart)}
            />
            <InfoRow
              icon="calendar-end"
              label="تاريخ الانتهاء"
              value={formatDate(profile.subscriptionEnd)}
            />

            {/* Account Status Section */}
            <View style={[
              styles.daysRemainingCard,
              isAccountActive(profile)
                ? { backgroundColor: '#C6F6D5' }
                : { backgroundColor: '#FFD580' }
            ]}>
              <View style={styles.daysRemainingContent}>
                <Text style={styles.daysRemainingLabel}>
                  حالة الحساب
                </Text>
                <Text style={styles.daysRemainingValue}>
                  {profile?.ad?.isVisible === true &&
                    profile?.ad?.status === 'approved'
                    ? 'الاشتراك فعال'
                    : 'تم قبول الدفع، والإعلان قيد المراجعة من قبل الإدارة'}
                </Text>


              </View>
              <MaterialCommunityIcons
                name={isAccountActive(profile) ? "check-circle" : "progress-clock"}
                size={24}
                color={isAccountActive(profile) ? "#48BB78" : "#FFA500"}
              />
            </View>
          </View>

          {/* Subscription Action Buttons */}
          <View style={styles.subscriptionActions}>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgradeSubscription}
            >
              <Text style={styles.upgradeButtonText}>ترقية الباقة</Text>
              <MaterialCommunityIcons name="arrow-up-bold" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.renewButton}
              onPress={handleRenewSubscription}
            >
              <Text style={styles.renewButtonText}>تجديد الاشتراك</Text>
              <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>إعدادات الحساب</Text>
            <MaterialCommunityIcons name="cog" size={24} color="#718096" />
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="chevron-left" size={22} color="#CBD5E0" />
            <Text style={styles.actionButtonText}>تسجيل الخروج</Text>
            <MaterialCommunityIcons name="logout" size={22} color="#FF9800" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <MaterialCommunityIcons name="chevron-left" size={22} color="#CBD5E0" />
            <Text style={[styles.actionButtonText, styles.dangerText]}>
              حذف الحساب نهائياً
            </Text>
            <MaterialCommunityIcons name="delete-forever" size={22} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Info Row Component - RTL - 
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
    <MaterialCommunityIcons name={icon as any} size={20} color="#faaf3f" />
  </View>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 10,
    fontFamily: 'Almarai-Regular',
    color: '#718096',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
    color: '#2D3748',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#faaf3f',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
  },
  header: {
    backgroundColor: '#faaf3f',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  jobBadge: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignItems: 'center',
    gap: 6,
  },
  jobTitle: {
    fontSize: 10,
    color: '#faaf3f',
    fontFamily: 'Almarai-Bold',
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Almarai-Regular',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#2D3561',
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
    gap: 12,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: 'Almarai-Regular',
  },
  value: {
    fontSize: 11,
    color: '#2D3748',
    fontFamily: 'Almarai-Bold',
    textAlign: 'right',
  },
  editButton: {
    flexDirection: 'row-reverse',
    backgroundColor: '#faaf3f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
  },
  subscriptionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  packageBadge: {
    flexDirection: 'row-reverse',
    backgroundColor: '#faaf3f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  packageText: {
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
    color: '#FFF',
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 5,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#2D3561',
  },
  currency: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'Almarai-Bold',
  },
  subscriptionDetails: {
    gap: 4,
  },
  daysRemainingCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#C6F6D5',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    gap: 12,
  },
  daysRemainingWarning: {
    backgroundColor: '#FED7D7',
  },
  daysRemainingContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  daysRemainingLabel: {
    fontSize: 11,
    color: '#718096',
    fontFamily: 'Almarai-Regular',
    textAlign: 'right',
  },
  daysRemainingValue: {
    fontSize: 14,
    color: '#48BB78',
    fontFamily: 'Almarai-Bold',
  },
  daysRemainingValueWarning: {
    color: '#E53E3E',
  },
  subscriptionActions: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 15,
  },
  renewButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#48BB78',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  renewButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
  },
  upgradeButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#faaf3f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 12,
    color: '#2D3748',
    fontFamily: 'Almarai-Bold',
    textAlign: 'right',
  },
  dangerButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  dangerText: {
    color: '#E53E3E',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },

});