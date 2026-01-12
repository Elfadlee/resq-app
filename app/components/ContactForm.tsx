import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

interface FormData {
  title: string;
  message: string;
  email: string;
  mobile: string;
}

interface FormErrors {
  title: string;
  message: string;
  email: string;
}

const ContactFormCustomUI: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    message: '',
    email: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    message: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Refs for next/previous jumping between fields
  const titleRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone validation (optional)
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[0-9+\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { title: '', message: '', email: '' };

    if (!formData.title.trim()) {
      newErrors.title = 'يرجى إدخال عنوان الرسالة';
      isValid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = 'العنوان قصير جداً (3 ��حرف على الأقل)';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'يرجى إدخال نص الرسالة';
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = 'الرسالة قصيرة جداً (10 أحرف على الأقل)';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Alert.alert('تنبيه', 'يرجى تصحيح البيانات المدخلة.');
    }
    return isValid;
  };

  // Handle form submission
  const handleSendEmail = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const subject = encodeURIComponent(formData.title);
      const body = encodeURIComponent(
        `العنوان: ${formData.title}\n\n` +
        `الرسالة:\n${formData.message}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `معلومات المرسل:\n` +
        `البريد الإلكتروني: ${formData.email}\n` +
        `${formData.mobile ? `رقم الجوال: ${formData.mobile}\n` : ''}` +
        `━━━━━━━━━━━━━━━━━━━━━━`
      );

      const yourEmail = 'your.email@example.com'; // Replace with your email
      const mailtoUrl = `mailto:${yourEmail}?subject=${subject}&body=${body}`;

      const supported = await Linking.canOpenURL(mailtoUrl);

      if (supported) {
        await Linking.openURL(mailtoUrl);

        // Clear form and show alert
        setTimeout(() => {
          setFormData({ title: '', message: '', email: '', mobile: '' });
          setLoading(false);
          Alert.alert(
            'تم الإرسال بنجاح',
            'شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.',
            [{ text: 'حسناً', style: 'default' }]
          );
        }, 500);
      } else {
        setLoading(false);
        Alert.alert('خطأ', 'لا يمكن فتح تطبيق البريد الإلكتروني');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('خطأ', 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  // Handle WhatsApp
  const handleWhatsApp = async (): Promise<void> => {
    const phoneNumber = '966500000000'; // Replace with your number
    const message = encodeURIComponent('السلام عليكم، أرغب في التواصل معكم');
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (error) {
      Alert.alert('خطأ', 'لا يمكن فتح واتساب. يرجى التأكد من تثبيت التطبيق.');
    }
  };

  const updateField = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // تحسين تجربة التنقل والكتابة مع الكيبورد وعدم التأثر بشكل الشاشة
  // دون تغيير التصميم
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={customStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={customStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={{ width: '100%' }}
        alwaysBounceVertical={false}
      >
        {/* Header Section */}
        <View style={customStyles.header}>
          <Text style={customStyles.headerTitle}>تواصل معنا</Text>
          <Text style={customStyles.headerSubtitle}>
            نسعد بتلقي رسالتك والرد عليها في أقرب وقت
          </Text>
        </View>

        {/* Form */}
        <View style={customStyles.formCard}>
          {/* Title Input */}
          <View style={customStyles.inputWrapper}>
            <Text style={customStyles.inputLabel}>
              عنوان الرسالة <Text style={customStyles.required}>*</Text>
            </Text>
            <View
              style={[
                customStyles.inputContainer,
                focusedField === 'title' && customStyles.inputContainerFocused,
                errors.title && customStyles.inputContainerError,
              ]}
            >
              <TextInput
                ref={titleRef}
                style={customStyles.input}
                value={formData.title}
                onChangeText={(text) => updateField('title', text)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                placeholder="مثال: استفسار عن الخدمات"
                placeholderTextColor="#BAD0E7"
                textAlign="right"
                maxLength={100}
                returnKeyType="next"
                onSubmitEditing={() => {
                  setTimeout(() => {
                    emailRef.current?.focus();
                  }, 50);
                }}
              />
            </View>
            {errors.title ? (
              <Text style={customStyles.errorText}>⚠ {errors.title}</Text>
            ) : null}
          </View>

          {/* Email Input */}
          <View style={customStyles.inputWrapper}>
            <Text style={customStyles.inputLabel}>
              البريد الإلكتروني <Text style={customStyles.required}>*</Text>
            </Text>
            <View
              style={[
                customStyles.inputContainer,
                focusedField === 'email' && customStyles.inputContainerFocused,
                errors.email && customStyles.inputContainerError,
              ]}
            >

              <TextInput
                ref={emailRef}
                style={customStyles.input}
                value={formData.email}
                onChangeText={(text) =>
                  updateField('email', text.replace(/\s/g, ''))
                }
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="example@email.com"
                placeholderTextColor="#BAD0E7"
                textAlign="right"
                keyboardType="email-address"   // 👈 هذا المفتاح
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress" // iOS ذكي
                autoComplete="email"           // Android
                returnKeyType="next"
                onSubmitEditing={() => {
                  setTimeout(() => {
                    mobileRef.current?.focus();
                  }, 50);
                }}
              />



            </View>
            {errors.email ? (
              <Text style={customStyles.errorText}>⚠ {errors.email}</Text>
            ) : null}
          </View>

          {/* Mobile Input */}
          <View style={customStyles.inputWrapper}>
            <Text style={customStyles.inputLabel}>
              رقم الجوال <Text style={customStyles.optional}>(اختياري)</Text>
            </Text>
            <View
              style={[
                customStyles.inputContainer,
                focusedField === 'mobile' && customStyles.inputContainerFocused,
              ]}
            >
              <TextInput
                ref={mobileRef}
                style={customStyles.input}
                value={formData.mobile}
                onChangeText={(text) =>
                  updateField(
                    'mobile',
                    text.replace(/[^0-9]/g, '') // يسمح بالأرقام فقط
                  )
                }
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField(null)}
                placeholder="07xxxxxxxx"
                placeholderTextColor="#BAD0E7"
                textAlign="right"
                keyboardType="phone-pad"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  setTimeout(() => {
                    messageRef.current?.focus();
                  }, 50);
                }}
                maxLength={11}
                textContentType="telephoneNumber"
                autoComplete="tel"
                accessibilityLabel="رقم الجوال"
                accessibilityHint="أدخل رقم الجوال بدون مسافات أو رموز"
              />

            </View>
          </View>

          {/* Message Input */}
          <View style={customStyles.inputWrapper}>
            <Text style={customStyles.inputLabel}>
              نص الرسالة <Text style={customStyles.required}>*</Text>
            </Text>
            <View
              style={[
                customStyles.inputContainer,
                customStyles.textAreaContainer,
                focusedField === 'message' && customStyles.inputContainerFocused,
                errors.message && customStyles.inputContainerError,
              ]}
            >
              <TextInput
                ref={messageRef}
                style={[customStyles.input, customStyles.textArea]}
                value={formData.message}
                onChangeText={(text) => updateField('message', text)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="اكتب رسالتك هنا بالتفصيل..."
                placeholderTextColor="#BAD0E7"
                textAlign="right"
                multiline
                numberOfLines={6}
                maxLength={1000}
                returnKeyType="done"
              />
            </View>
            <Text style={customStyles.charCounter}>
              {formData.message.length} / 1000
            </Text>
            {errors.message ? (
              <Text style={customStyles.errorText}>⚠ {errors.message}</Text>
            ) : null}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              customStyles.sendButton,
              loading && customStyles.buttonDisabled,
            ]}
            onPress={handleSendEmail}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={customStyles.sendButtonText}>إرسال الرسالة</Text>
                <Text style={customStyles.sendButtonIcon}>✉</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          {/* <View style={customStyles.dividerContainer}>
            <View style={customStyles.divider} />
            <Text style={customStyles.dividerText}>أو</Text>
            <View style={customStyles.divider} />
          </View> */}

          {/* WhatsApp Button - will add later */}
          {/* <TouchableOpacity
            style={customStyles.whatsappButton}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <Text style={customStyles.whatsappButtonText}>
              تواصل معنا عبر واتساب
            </Text>
            <Text style={customStyles.whatsappIcon}>💬</Text>
          </TouchableOpacity> */}
        </View>

        {/* Footer */}
        <View style={customStyles.footer}>
          <Text style={customStyles.footerText}>
            نحن هنا لخدمتك على مدار الساعة
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 22,
    backgroundColor: '#fff',
    borderRadius: 0,
    alignItems: 'flex-end',
    width: '100%',
  },
  header: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 22,
    width: '100%',
    paddingRight: 6,
    marginTop: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3C5D',
    fontFamily: 'Almarai-Bold',
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Almarai',
    textAlign: 'right',
    lineHeight: 18,
    paddingRight: 2,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(11,60,93,0.12)',
    width: '100%',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputWrapper: {
    marginBottom: 18,
    width: '100%',
    alignSelf: 'flex-end',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B3C5D',
    marginBottom: 7,
    fontFamily: 'Almarai',
    textAlign: 'right',
  },
  required: {
    color: '#FF9800',
    fontSize: 13,
  },
  optional: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: 'transparent',
    width: '100%',
  },
  inputContainerFocused: {
    borderColor: '#FF9800',
    ...Platform.select({
      ios: { shadowColor: '#FF9800', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 2 },
      android: { elevation: 0.5 },
    }),
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'Almarai',
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  textAreaContainer: {
    minHeight: 70,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
    paddingTop: 8,
    fontSize: 14,
  },
  charCounter: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'left',
    marginTop: 2,
    fontFamily: 'Almarai',
  },
  errorText: {
    fontSize: 13,
    color: '#F87171',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'Almarai',
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 9,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Almarai',
    marginLeft: 7,
    marginRight: 2,
  },
  sendButtonIcon: {
    fontSize: 16,
    marginRight: 5,
    marginLeft: 0,
  },
  dividerContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 13,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(11,60,93,0.13)',
    alignSelf: 'center',
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    marginHorizontal: 8,
    fontFamily: 'Almarai',
    alignSelf: 'center',
    marginBottom: 2,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#25D366',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  whatsappButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Almarai',
    marginLeft: 8,
    marginRight: 2,
  },
  whatsappIcon: {
    fontSize: 16,
    marginRight: 6,
    marginLeft: 0,
  },
  footer: {
    alignItems: 'center',
    marginTop: 2,
    paddingBottom: 9,
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    color: '#789BB5',
    fontFamily: 'Almarai',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ContactFormCustomUI;