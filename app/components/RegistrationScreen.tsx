

// trest it at home 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 Firestore
import { db } from '../services/firestore';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

type RegistrationScreenProps = {
  initialData?: any;
  isSocialSignup?: boolean;
  onNext: (data: any) => void;
  onBackToLogin: () => void;
};

const convertArabicToEnglish = (text: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let converted = text;
  arabicNumbers.forEach((a, i) => {
    converted = converted.replace(new RegExp(a, 'g'), englishNumbers[i]);
  });
  return converted;
};


const isEnglishPassword = (text: string): boolean => {
  return /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]*$/.test(text);
};

const isEnglishNumbers = (text: string): boolean => {
  return /^[0-9]*$/.test(text);
};

export default function RegistrationScreen({
  initialData,
  isSocialSignup,
  onNext,
  onBackToLogin,
}: RegistrationScreenProps) {
  // --- refs for UX improvement
  const nameInputRef = useRef<RNTextInput>(null);
  const mobileInputRef = useRef<RNTextInput>(null);
  const emailInputRef = useRef<RNTextInput>(null);
  const passInputRef = useRef<RNTextInput>(null);
  const confirmPassInputRef = useRef<RNTextInput>(null);
  const descriptionInputRef = useRef<RNTextInput>(null);

  const [mobile, setMobile] = useState(initialData?.mobile?.replace('+964', '') || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [area, setArea] = useState(initialData?.area || '');
  const [jobMenuVisible, setJobMenuVisible] = useState(false);
  const [areaMenuVisible, setAreaMenuVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [jobsFromDb, setJobsFromDb] = useState<string[]>([]);
  const [areasFromDb, setAreasFromDb] = useState<string[]>([]);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);
  const [passwordLangError, setPasswordLangError] = useState<string | null>(null);
  const [mobileLangError, setMobileLangError] = useState<string | null>(null);
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const duplicateCheckTimeout = useRef<NodeJS.Timeout | number | null>(null); // to debounce duplicate checks



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

        const [jobsSnap, areasSnap] = await Promise.all([getDocs(jobsQ), getDocs(areasQ)]);

        const jobs = jobsSnap.docs
          .map((d) => (d.data() as any)?.name)
          .filter(Boolean);

        const areas = areasSnap.docs
          .map((d) => (d.data() as any)?.name)
          .filter(Boolean);

        setJobsFromDb(jobs);
        setAreasFromDb(areas);
      } catch (e) {
        console.log('Lookup load error:', e);


      }
    };

    loadLookups();
  }, []);


  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name || name || '');
    setEmail(initialData.email || '');
    setMobile(initialData.mobile?.replace('+964', '') || '');
    setJobTitle(initialData.jobTitle || '');
    setArea(initialData.area || '');
    setDescription(initialData.description || '');
  }, [initialData]);

  const checkDuplicatesAfterFinish = async (
    checkMobile: boolean,
    checkEmail: boolean
  ) => {
    if (
      (checkMobile && mobile.length !== 10) ||
      (checkEmail && (!email || !email.includes('@')))
    ) {
      return;
    }

    setCheckingDuplicate(true);

    let foundMobile: string | null = null;
    let foundEmail: string | null = null;
    let errorMsg = '';

    if (checkMobile) {
      const mobQuery = query(
        collection(db, 'users'),
        where('mobile', '==', '+964' + convertArabicToEnglish(mobile))
      );
      const mobSnap = await getDocs(mobQuery);
      if (!mobSnap.empty) {
        foundMobile = '+964' + convertArabicToEnglish(mobile);
        errorMsg += 'رقم الجوال مستخدم سابقاً\n';
      }
    }

    if (checkEmail) {
      const emQuery = query(
        collection(db, 'users'),
        where('email', '==', email.trim())
      );
      const emSnap = await getDocs(emQuery);
      if (!emSnap.empty) {
        foundEmail = email.trim();
        errorMsg += 'البريد الإلكتروني مستخدم سابقاً';
      }
    }

    setDuplicateMobile(foundMobile);
    setDuplicateEmail(foundEmail);
    setDuplicateError(errorMsg || null);
    setCheckingDuplicate(false);
  };



  const isNameValid = !!name.trim();
  const isJobValid = !!jobTitle;
  const isAreaValid = !!area;
  const isMobileValid = isEnglishNumbers(mobile) && mobile.length === 10 && !mobileLangError;
  const isEmailValid = !!email.trim() && email.includes('@');
  const isPasswordValid = isEnglishPassword(password) && password.length >= 8 && !passwordLangError;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;
  const isDescriptionValid = wordCount <= 120;

  const handleMobileChange = (text: string) => {
    if (!isEnglishNumbers(text)) {
      setMobileLangError('يرجى إدخال الأرقام بالإنجليزية فقط');
    } else {
      setMobileLangError(null);
    }
    const num = text.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(num);
    if (num.length === 10 && isEnglishNumbers(num)) {
      setTimeout(() => emailInputRef.current?.focus(), 150);
    }
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);

  };
  const handlePasswordChange = (text: string) => {
    if (!isEnglishPassword(text)) {
      setPasswordLangError('يرجى استخدام الحروف والأرقام الإنجليزية فقط');
    } else {
      setPasswordLangError(null);
    }
    setPassword(text);
    if (text.length >= 8 && isEnglishPassword(text)) {
      setTimeout(() => confirmPassInputRef.current?.focus(), 150);
    }
  };
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (password === text && text.length >= 8) {
      setTimeout(() => descriptionInputRef.current?.focus(), 150);
    }
  };


  const handleNext = async () => {
    Keyboard.dismiss();
    if (duplicateError) {
      Alert.alert('خطأ', duplicateError);
      return;
    }
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم');
      return;
    }
    if (!jobTitle) {
      Alert.alert('خطأ', 'يرجى اختيار المهنة');
      return;
    }
    if (!area) {
      Alert.alert('خطأ', 'يرجى اختيار المنطقة');
      return;
    }
    if (!isEnglishNumbers(mobile) || mobileLangError) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الجوال بالأرقام الإنجليزية فقط');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
      return;
    }
    if (!isEnglishPassword(password) || passwordLangError) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة المرور بالحروف والأرقام الإنجليزية فقط');
      return;
    }
    if (!password.trim() || password.length < 8) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة مرور لا تقل عن 8 أحرف');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (wordCount > 120) {
      Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة.  الحد الأقصى 120 كلمة`);
      return;
    }

    const englishPassword = password; 
    const englishMobile = mobile;
    const draftData = {
      name: name.trim(),
      jobTitle,
      area,
      mobile: '+964' + englishMobile,
      email: email.trim(),
      description: description.trim(),
      password: englishPassword,
    };
    try {
      await AsyncStorage.setItem('userRegistrationDraft', JSON.stringify(draftData));
    } catch (err) {
      console.log('Storage error', err);
    } finally {
      onNext({ ...draftData, signupType: 'manual' });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formCard}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
          <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
        </View>

        {checkingDuplicate && (
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <ActivityIndicator color="#FF9800" />
            <Text style={{ color: '#FF9800', fontSize: 15 }}>جاري التحـقق من البيانات ...</Text>
          </View>
        )}
        {duplicateError && (
          <View
            style={{
              backgroundColor: '#fff5f2',
              borderWidth: 1,
              borderColor: '#ffc1a1',
              padding: 8,
              marginVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#e53935', textAlign: 'center', fontSize: 16 }}>
              {duplicateError}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          {/* الاسم الكامل */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>الاسم الكامل</Text>
            <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
              <RNTextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
                style={styles.input}
                textAlign="right"
                placeholder="أدخل الاسم الكامل"
                placeholderTextColor="#999"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                onSubmitEditing={() => mobileInputRef.current?.focus()}
              />
              <MaterialCommunityIcons name="account" size={20} color="#FF9800" style={styles.icon} />
              {isNameValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
          </View>

          {/* المهنة */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>المهنة</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, focusedField === 'job' && styles.inputWrapperFocused]}
              onPress={() => {
                Keyboard.dismiss();
                setJobMenuVisible(true);
                setFocusedField('job');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
                {jobTitle || 'اختر المهنة'}
              </Text>
              <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" style={styles.icon} />
              {isJobValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* المنطقة */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>المنطقة</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, focusedField === 'area' && styles.inputWrapperFocused]}
              onPress={() => {
                Keyboard.dismiss();
                setAreaMenuVisible(true);
                setFocusedField('area');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownText, !area && styles.placeholder]}>
                {area || 'اختر المنطقة'}
              </Text>
              <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" style={styles.icon} />
              {isAreaValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* رقم الجوال */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>رقم الجوال</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'mobile' && styles.inputWrapperFocused,
                mobileLangError && styles.inputWrapperError,
              ]}
            >
              <View style={styles.mobileInputContainer}>
                <RNTextInput
                  ref={mobileInputRef}
                  value={mobile}
                  onChangeText={handleMobileChange}
                  style={styles.mobileInput}
                  textAlign="right"
                  keyboardType="number-pad"
                  placeholder="770 123 4567"
                  placeholderTextColor="#999"
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => {
                    setFocusedField(null);
                    checkDuplicatesAfterFinish(true, false); 
                  }}

                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />
                <Text style={styles.mobilePrefix}>+964</Text>
              </View>
              <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
              {isMobileValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
            <Text style={styles.helperText}>يرجى إدخال 10 ارقام بالانجليزيه فقط</Text>
            {mobileLangError && <Text style={styles.errorText}>{mobileLangError}</Text>}
            {duplicateMobile && (
              <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                {duplicateMobile}
                {'\n'}
                رقم الجوال لديه حساب مستخدم مسبقاً يرجي الدخول الي الحساب الخاص بك
              </Text>
            )}
          </View>

          {/* البريد الإلكتروني */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
              <RNTextInput
                ref={emailInputRef}
                value={email}
                onChangeText={handleEmailChange}
                style={styles.input}
                textAlign="right"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="example@email.com"
                placeholderTextColor="#999"
                onFocus={() => setFocusedField('email')}
                // onBlur={() => setFocusedField(null)}
                onBlur={() => {
                  setFocusedField(null);
                  checkDuplicatesAfterFinish(false, true); 
                }}

                returnKeyType="next"
                onSubmitEditing={() => passInputRef.current?.focus()}
                editable={!isSocialSignup}
              />
              <MaterialCommunityIcons name="email" size={20} color="#FF9800" style={styles.icon} />
              {isEmailValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
            {duplicateEmail && (
              <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                {duplicateEmail}
                {'\n'}
                البريد الإلكتروني لديه حساب مستخدم مسبقاً يرجي الدخول الي الحساب الخاص بك
              </Text>
            )}
          </View>

      
          <View style={styles.inputContainer}>
            <Text style={styles.label}>كلمة المرور الجديدة</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
                passwordLangError && styles.inputWrapperError,
              ]}
            >
              <View style={styles.passwordInputContainer}>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                <RNTextInput
                  ref={passInputRef}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                  style={styles.passwordInput}
                  textAlign="right"
                  keyboardType="default"
                  placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                  placeholderTextColor="#999"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPassInputRef.current?.focus()}
                />
              </View>
              <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
              {isPasswordValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
            <Text style={styles.helperText}>يرجى استخدام الحروف والأرقام الإنجليزية فقط</Text>
            {passwordLangError && <Text style={styles.errorText}>{passwordLangError}</Text>}
          </View>

          {/* تأكيد كلمة المرور */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>تأكيد كلمة المرور</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError,
              ]}
            >
              <View style={styles.passwordInputContainer}>
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                <RNTextInput
                  ref={confirmPassInputRef}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  style={styles.passwordInput}
                  textAlign="right"
                  keyboardType="default"
                  placeholder="أعد إدخال كلمة المرور"
                  placeholderTextColor="#999"
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionInputRef.current?.focus()}
                />
              </View>
              <MaterialCommunityIcons
                name={
                  confirmPassword.length > 0 && password === confirmPassword
                    ? 'check-circle'
                    : 'lock-check'
                }
                size={20}
                color={confirmPassword.length > 0 && password === confirmPassword ? '#4CAF50' : '#FF9800'}
                style={styles.icon}
              />
              {isConfirmPasswordValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.errorText}>كلمة المرور غير متطابقة</Text>
            )}
            {confirmPassword.length > 0 && password === confirmPassword && (
              <Text style={styles.successText}>✓ كلمة المرور متطابقة</Text>
            )}
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>الوصف</Text>
            <View
              style={[
                styles.inputWrapper,
                styles.textAreaWrapper,
                focusedField === 'description' && styles.inputWrapperFocused,
              ]}
            >
              <RNTextInput
                ref={descriptionInputRef}
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                textAlign="right"
                multiline
                numberOfLines={4}
                placeholder="اكتب وصف مختصر عن خدماتك..."
                placeholderTextColor="#999"
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="done"
              />
              <MaterialCommunityIcons
                name="text"
                size={20}
                color="#FF9800"
                style={[styles.icon, styles.textAreaIcon]}
              />
              {isDescriptionValid ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#4caf50"
                  style={{ marginLeft: 2 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color="#ccc"
                  style={{ marginLeft: 2 }}
                />
              )}
            </View>
            <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
              {wordCount} / 120 كلمة {wordCount > 120 && '(تجاوز الحد الأقصى)'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!!duplicateError || !!passwordLangError || !!mobileLangError || checkingDuplicate}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>التالي - اختيار الباقة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={onBackToLogin} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FF9800" />
              <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>


      <Modal
        visible={jobMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setJobMenuVisible(false);
          setFocusedField(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setJobMenuVisible(false);
            setFocusedField(null);
          }}
        >
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>اختر المهنة</Text>

            <FlatList
              data={jobsFromDb}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setJobTitle(item);
                    setJobMenuVisible(false);
                    setFocusedField(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemText}>{item}</Text>
                  {jobTitle === item && <MaterialCommunityIcons name="check" size={20} color="#FF9800" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={areaMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setAreaMenuVisible(false);
          setFocusedField(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setAreaMenuVisible(false);
            setFocusedField(null);
          }}
        >
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>اختر المنطقة</Text>

            <FlatList
              data={areasFromDb}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setArea(item);
                    setAreaMenuVisible(false);
                    setFocusedField(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuItemText}>{item}</Text>
                  {area === item && <MaterialCommunityIcons name="check" size={20} color="#FF9800" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1, paddingBottom: 32 },
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
    fontSize: 16,
    fontFamily: 'Almarai-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  form: { gap: 16 },
  inputContainer: { gap: 8 },
  label: {
    fontSize: 12,
    fontFamily: 'Almarai-Bold',
    color: '#333',
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    minHeight: 56,
  },
  inputWrapperFocused: { borderColor: '#FF9800', borderWidth: 2 },
  inputWrapperError: { borderColor: '#f44336', borderWidth: 2 },
  input: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#1a1a1a',
    paddingVertical: 12,
    textAlign: 'right',
  },
  icon: { marginLeft: 8 },
  mobileInputContainer: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center' },
  mobileInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#1a1a1a',
    paddingVertical: 12,
    textAlign: 'right',
  },
  mobilePrefix: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#666', marginRight: 8 },
  passwordInputContainer: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center' },
  passwordInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#1a1a1a',
    paddingVertical: 12,
    textAlign: 'right',
    letterSpacing: 2,
  },
  eyeIcon: { padding: 8, marginLeft: 4 },
  dropdownText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  placeholder: { color: '#999' },
  helperText: {
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#f44336',
    textAlign: 'right',
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#4CAF50',
    textAlign: 'right',
    marginTop: 4,
  },
  textAreaWrapper: { alignItems: 'flex-start', minHeight: 100 },
  textArea: { minHeight: 80, paddingTop: 12 },
  textAreaIcon: { alignSelf: 'flex-start', marginTop: 12 },
  wordCount: { fontSize: 12, fontFamily: 'Almarai-Regular', textAlign: 'right', marginTop: 4 },
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
  submitButtonText: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#fff' },
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
  backButtonText: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#FF9800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContentBottom: {
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
    fontSize: 12,
    fontFamily: 'Almarai-Regular',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
});


