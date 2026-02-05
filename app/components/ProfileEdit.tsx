

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updatePassword } from "firebase/auth";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {

  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { auth, db } from "../services/firestore";
import storage from '../services/storage-helper';
import { useModal } from '../components/ModalProvider';






async function isMobileTaken(mobile: string, myId: string) {
  const q = query(collection(db, "users"), where("mobile", "==", mobile));
  const snap = await getDocs(q);
  return snap.docs.some(doc => doc.id !== myId);
}



export default function ProfileEdit({ navigation, route }: any) {
  const { profile, onSave } = route.params;

  const [name, setName] = useState(profile.name);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [area, setArea] = useState(profile.area);
  const [mobile, setMobile] = useState(profile.mobile.replace('+964', ''));
  const email = profile.email;
  const [description, setDescription] = useState(profile.description);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [jobMenuVisible, setJobMenuVisible] = useState(false);
  const [areaMenuVisible, setAreaMenuVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);



  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const originalMobile = profile.mobile.replace('+964', '');
  const [jobsFromDb, setJobsFromDb] = useState<string[]>([]);
  const [areasFromDb, setAreasFromDb] = useState<string[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const { showModal } = useModal();

  const showError = (msg: string) => {
    showModal({
      title: 'خطأ',
      message: msg,
      primaryText: 'موافق',
    });
  };

  const showSuccess = (title: string, msg: string, onClose?: () => void) => {
    showModal({
      title,
      message: msg,
      primaryText: 'حسناً',
      onPrimary: onClose,
    });
  };


  useEffect(() => {
    const loadLookups = async () => {
      try {
        const jobsQ = query(
          collection(db, 'lookup_professions'),
          where('active', '==', true),
          orderBy('order', 'asc')
        );

        const areasQ = query(
          collection(db, 'lookup_areas'),
          where('active', '==', true),
          orderBy('order', 'asc')
        );

        const [jobsSnap, areasSnap] = await Promise.all([
          getDocs(jobsQ),
          getDocs(areasQ),
        ]);

        setJobsFromDb(
          jobsSnap.docs.map(d => d.data().name).filter(Boolean)
        );
        setAreasFromDb(
          areasSnap.docs.map(d => d.data().name).filter(Boolean)
        );
      } catch (e) {
        showError('فشل تحميل المهن أو المناطق');
      } finally {
        setLoadingLookups(false);
      }
    };

    loadLookups();
  }, []);




  useEffect(() => {
    const checkDup = async () => {
      setCheckingDuplicate(true);
      setDuplicateMobile(null);


      if (mobile && mobile.length === 10 && mobile !== originalMobile) {
        const mobSnap = await getDocs(
          query(collection(db, "users"), where("mobile", "==", '+964' + mobile))
        );
        if (!mobSnap.empty && mobSnap.docs.some(doc => doc.id !== profile.id)) {
          setDuplicateMobile('+964' + mobile);
        }
      }

      setCheckingDuplicate(false);
    };

    checkDup();
  }, [mobile]);

  const handleSave = async () => {
    // 1) validations
    const requiresReview =
      name.trim() !== profile.name ||
      jobTitle !== profile.jobTitle ||
      area !== profile.area ||
      description.trim() !== profile.description;

    if (!name.trim()) return showError("الرجاء إدخال الاسم");
    if (!jobTitle) return showError("الرجاء اختيار المهنة");
    if (!area) return showError("الرجاء اختيار المنطقة");
    if (!mobile.trim() || mobile.trim().length < 10) return showError("الرجاء إدخال رقم هاتف صحيح");
    if (wordCount > 120) return showError(`الوصف يحتوي على ${wordCount} كلمة. الحد الأقصى 120 كلمة`);
    const myId = auth.currentUser?.uid;
    if (!myId) return showError("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");

    const formattedMobile = mobile.trim().startsWith("+964")
      ? mobile.trim()
      : "+964" + mobile.trim();

    setSaving(true);

    try {
      // 2) check duplicate mobile
      const taken = await isMobileTaken(formattedMobile, myId);
      if (taken) {
        showError("رقم الهاتف مستخدم من قبل");
        return;
      }

      // 3) update password (ONLY if user typed new password)
      if (password.trim()) {
        const user = auth.currentUser;
        if (!user) {
          showError("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
          return;
        }

        try {
          await updatePassword(user, password.trim());
        } catch (err) {
          showError(
            "فشل تغيير كلمة المرور. غالباً تحتاج تسوي تسجيل خروج ثم دخول وتعيد المحاولة."
          );
          return;
        }
      }

      // 4) build updated profile (DO NOT store password in firestore)
      const updatedProfile = {
        ...profile,
        id: myId,
        uid: myId,
        name: name.trim(),
        jobTitle,
        area,
        mobile: formattedMobile,
        description: description.trim(),
      };

      // 5) update firestore
      const userRef = doc(db, "users", myId);
      await updateDoc(userRef, {
        name: updatedProfile.name,
        jobTitle: updatedProfile.jobTitle,
        area: updatedProfile.area,
        mobile: updatedProfile.mobile,
        description: updatedProfile.description,

        ...(requiresReview && {
          "subscription.isActive": true,
          "ad.isVisible": false,
          "ad.status": "pending",
        }),

        "metadata.updatedAt": serverTimestamp(),
      });


      // 6) update local cache
      await storage.setObject("userProfile", updatedProfile);
      await storage.setObject("currentUser", updatedProfile);

      // 7) success message
      if (requiresReview) {
        showSuccess(
          "تم إرسال المعلومات",
          "تم إرسال معلوماتك للمراجعة وسيتم تفعيل الحساب خلال ٤٨ ساعة.",
          () => navigation.goBack()
        );
      } else {
        showSuccess(
          "تم الحفظ",
          "تم حفظ التعديلات بنجاح.",
          () => navigation.goBack()
        );
      }


    } catch (e) {
      showError("فشل تحديث المعلومات.");

    } finally {
      setSaving(false);
    }
  };





  return (



    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>تعديل المعلومات</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-right" size={24} color="#FF9800" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>الاسم *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="أدخل الاسم"
                  textAlign="right"
                />
                <MaterialCommunityIcons name="account" size={20} color="#FF9800" />
              </View>
            </View>

            {/* Job Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المهنة *</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => {
                  if (loadingLookups) return;
                  setJobMenuVisible(true);
                }}

              >
                <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
                  {loadingLookups ? 'جاري التحميل...' : jobTitle || 'اختر المهنة'}

                </Text>
                <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" />
              </TouchableOpacity>
            </View>

            {/* Area */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المنطقة *</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => {
                  if (loadingLookups) return;
                  setAreaMenuVisible(true);
                }}

              >
                <Text style={[styles.dropdownText, !area && styles.placeholder]}>
                  {loadingLookups ? 'جاري التحميل...' : area || 'اختر المنطقة'}
                </Text>
                <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" />
              </TouchableOpacity>
            </View>

            {/* Mobile */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>رقم الهاتف *</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.mobileContainer}>
                  <TextInput
                    style={styles.mobileInput}
                    value={mobile}
                    onChangeText={setMobile}
                    placeholder="770 123 4567"
                    keyboardType="phone-pad"
                    textAlign="right"
                    maxLength={10}
                  />
                  <Text style={styles.mobilePrefix}>964+</Text>
                </View>
                <MaterialCommunityIcons name="phone" size={20} color="#FF9800" />
              </View>
              {/* Mobile duplicate warning (placed BELOW inputWrapper) */}
              {duplicateMobile && (
                <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                  {duplicateMobile}{'\n'}رقم الهاتف مستخدم سابقاً، يرجى استخدام رقم آخر أو الدخول بحسابك.
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>البريد الإلكتروني *</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: '#f3f3f3', color: '#999' }
                  ]}
                  value={email}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                  editable={false} // 🔒 ممنوع التعديل
                />
                <MaterialCommunityIcons name="email" size={20} color="#FF9800" />
              </View>

              {/* رسالة ثابتة وواضحة */}
              <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                لا يمكن تغيير البريد الإلكتروني. في حال الحاجة للتعديل يرجى التواصل مع الدعم.
              </Text>
            </View>


            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>كلمة المرور (اختياري)</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordContainer}>
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="اترك فارغاً للإبقاء على القديمة"
                    secureTextEntry={!showPassword}
                    textAlign="right"
                  />
                </View>
                <MaterialCommunityIcons name="lock" size={20} color="#FF9800" />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>الوصف</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="أدخل وصف مختصر"
                  multiline
                  numberOfLines={4}
                  textAlign="right"
                  textAlignVertical="top"
                />
                <MaterialCommunityIcons
                  name="text"
                  size={20}
                  color="#FF9800"
                  style={styles.textAreaIcon}
                />
              </View>
              <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
                {wordCount} / 120 كلمة
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >

              {saving ? (
                <Text style={styles.saveButtonText}>جاري الحفظ...</Text>
              ) : (
                <>
                  <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
                  <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Job Modal */}
      <Modal visible={jobMenuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setJobMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>اختر المهنة</Text>
            <FlatList
              data={jobsFromDb}
              keyExtractor={(item) => item}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setJobTitle(item);
                    setJobMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuItemText}>{item}</Text>
                  {jobTitle === item && (
                    <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Area Modal */}
      <Modal visible={areaMenuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAreaMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>اختر المنطقة</Text>
            <FlatList
              data={areasFromDb}
              keyExtractor={(item) => item}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setArea(item);
                    setAreaMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuItemText}>{item}</Text>
                  {area === item && (
                    <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#2D3561',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
    color: '#2D3748',
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Almarai-Regular',
    color: '#2D3748',
  },
  dropdownText: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Almarai-Regular',
    color: '#2D3748',
    textAlign: 'right',
  },
  placeholder: {
    color: '#999',
  },
  mobileContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  mobileInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Almarai-Regular',
    color: '#2D3748',
  },
  mobilePrefix: {
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
    color: '#666',
    marginRight: 8,
  },
  passwordContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Almarai-Regular',
    color: '#2D3748',
  },
  eyeIcon: {
    padding: 8,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
  textAreaIcon: {
    alignSelf: 'flex-start',
  },
  wordCount: {
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 40,
  },
  cancelButtonText: {
    color: '#718096',
    fontSize: 14,
    fontFamily: 'Almarai-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Almarai-Regular',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
});