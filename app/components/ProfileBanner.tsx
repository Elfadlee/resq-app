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
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfile = {
  name: string;
  jobTitle: string;
  area:  string;
  mobile: string;
  email: string;
  description: string;
  password: string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
  subscriptionStart: string;
  subscriptionEnd: string;
};

type ProfileBannerProps = {
  navigation: any;
  onRefresh?:  () => void;
};

export default function ProfileBanner({ navigation, onRefresh }: ProfileBannerProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userProfile');
      if (userData) {
        setProfile(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('خطأ', 'فشل تحميل بيانات الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEditProfile = () => {
    if (! profile) return;
    
    // التأكد من وجود navigation
    if (!navigation || !navigation.navigate) {
      Alert.alert('خطأ', 'لا يمكن فتح شاشة التعديل');
      console.log('Navigation not available');
      return;
    }

    navigation. navigate('EditProfile', { 
      profile,
      onSave: loadProfile
    });
  };

  const handleUpgradeSubscription = () => {
    if (!profile) return;
    
    // التأكد من وجود navigation
    if (!navigation || ! navigation.navigate) {
      Alert.alert('خطأ', 'لا يمكن فتح شاشة الباقات');
      console.log('Navigation not available');
      return;
    }

    navigation.navigate('PackagesScreen', {
      mode: 'upgrade',
      currentProfile: profile,
      registrationData: profile,
      onConfirm: async (newPackageData:  any) => {
        try {
          const updatedProfile = {
            ...profile,
            ... newPackageData,
          };
          await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          Alert.alert('نجاح', 'تم ترقية الباقة بنجاح');
          loadProfile();
        } catch (error) {
          Alert.alert('خطأ', 'فشل تحديث الباقة');
        }
      },
      onBack: () => navigation.goBack(),
    });
  };

  const handleRenewSubscription = () => {
    Alert.alert(
      'تجديد الاشتراك',
      'هل تريد تجديد اشتراكك الحالي؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تجديد',
          onPress: () => {
            if (!profile) return;
            
            if (! navigation || !navigation.navigate) {
              Alert.alert('خطأ', 'لا يمكن فتح شاشة الباقات');
              return;
            }

            navigation. navigate('PackagesScreen', {
              mode: 'renew',
              currentProfile: profile,
              registrationData: profile,
              onConfirm: async (newPackageData: any) => {
                try {
                  const updatedProfile = {
                    ...profile,
                    ... newPackageData,
                  };
                  await AsyncStorage. setItem('userProfile', JSON. stringify(updatedProfile));
                  Alert.alert('نجاح', 'تم تجديد الاشتراك بنجاح');
                  loadProfile();
                } catch (error) {
                  Alert.alert('خطأ', 'فشل تحديث الاشتراك');
                }
              },
              onBack:  () => navigation.goBack(),
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      await AsyncStorage.multiRemove(['userProfile', 'userToken', 'allUsers', 'currentUser']);
      
      Alert.alert('تم الحذف', 'تم حذف حسابك بنجاح', [
        {
          text: 'حسناً',
          onPress: () => {
            if (navigation?. reset) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('خطأ', 'فشل حذف الحساب.  يرجى المحاولة مرة أخرى.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل تريد تسجيل الخروج من حسابك؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            if (navigation?.reset) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>جاري التحميل... </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles. errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={60} color="#E53E3E" />
        <Text style={styles.errorText}>لم يتم العثور على بيانات الملف الشخصي</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysRemaining = calculateDaysRemaining(profile.subscriptionEnd);
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - بدون دائرة */}
        <View style={styles. header}>
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

        {/* Personal Information Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles. sectionTitle}>المعلومات الشخصية</Text>
            <MaterialCommunityIcons name="account-circle" size={24} color="#FF9800" />
          </View>

          <InfoRow icon="phone" label="رقم الهاتف" value={profile.mobile} />
          <InfoRow icon="email" label="البريد الإلكتروني" value={profile.email} />
          <InfoRow icon="lock" label="كلمة المرور" value={profile.password} />
          <InfoRow icon="text" label="الوصف" value={profile.description} />

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>تعديل المعلومات</Text>
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View style={styles. sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles. sectionTitle}>معلومات الاشتراك</Text>
            <MaterialCommunityIcons name="crown" size={24} color="#FF9800" />
          </View>

          <View style={styles.subscriptionHeader}>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>دينار</Text>
              <Text style={styles.price}>{profile.subscriptionPrice}</Text>
            </View>
            <View style={styles.packageBadge}>
              <Text style={styles.packageText}>{profile.subscriptionPackage}</Text>
              <MaterialCommunityIcons name="star" size={20} color="#fff" />
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

            {/* Days Remaining Alert */}
            <View
              style={[
                styles. daysRemainingCard,
                isExpiringSoon && styles. daysRemainingWarning,
              ]}
            >
              <View style={styles.daysRemainingContent}>
                <Text style={styles.daysRemainingLabel}>الأيام المتبقية</Text>
                <Text
                  style={[
                    styles.daysRemainingValue,
                    isExpiringSoon && styles.daysRemainingValueWarning,
                  ]}
                >
                  {daysRemaining > 0 ? `${daysRemaining} يوم` : 'منتهي'}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={isExpiringSoon ? 'alert' : 'check-circle'}
                size={24}
                color={isExpiringSoon ? '#E53E3E' : '#48BB78'}
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
            <Text style={[styles.actionButtonText, styles. dangerText]}>
              حذف الحساب نهائياً
            </Text>
            <MaterialCommunityIcons name="delete-forever" size={22} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>نسخة التطبيق 1.0.0</Text>
          <Text style={styles.footerText}>© 2025 جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Info Row Component - RTL
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
    <MaterialCommunityIcons name={icon as any} size={20} color="#FF9800" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex:  1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex:  1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
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
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#2D3748',
    textAlign:  'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical:  12,
    borderRadius:  12,
  },
  retryButtonText:  {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
  },
  header:  {
    backgroundColor: '#FF9800',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  name:  {
    fontSize: 32,
    fontFamily: 'Almarai-Bold',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  jobBadge: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical:  8,
    borderRadius:  20,
    marginBottom: 8,
    alignItems: 'center',
    gap: 6,
  },
  jobTitle: {
    fontSize: 16,
    color: '#FF9800',
    fontFamily:  'Almarai-Bold',
  },
  locationContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  location:  {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Almarai-Regular',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    ... Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity:  0.1,
        shadowRadius: 8,
      },
      android:  {
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth:  2,
    borderBottomColor:  '#E2E8F0',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Almarai-Bold',
    color: '#2D3561',
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor:  '#F7FAFC',
    gap:  12,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  label:  {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: 'Almarai-Regular',
  },
  value:  {
    fontSize: 16,
    color: '#2D3748',
    fontFamily: 'Almarai-Bold',
    textAlign: 'right',
  },
  editButton: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
  },
  subscriptionHeader:  {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor:  '#E2E8F0',
  },
  packageBadge: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical:  8,
    borderRadius:  12,
    alignItems:  'center',
    gap:  6,
  },
  packageText: {
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#FFF',
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 5,
  },
  price: {
    fontSize: 32,
    fontFamily: 'Almarai-Bold',
    color: '#2D3561',
  },
  currency: {
    fontSize: 16,
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
    fontSize: 13,
    color: '#718096',
    fontFamily: 'Almarai-Regular',
    textAlign: 'right',
  },
  daysRemainingValue: {
    fontSize: 24,
    color: '#48BB78',
    fontFamily:  'Almarai-Bold',
  },
  daysRemainingValueWarning:  {
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
    fontSize: 15,
    fontFamily: 'Almarai-Bold',
  },
  upgradeButton:  {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Almarai-Bold',
  },
  actionButton: {
    flexDirection:  'row-reverse',
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
    fontSize:  16,
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
  footerText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontFamily: 'Almarai-Regular',
  },
});