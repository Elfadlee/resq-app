

import React, { useState } from 'react';
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
  Animated,
} from 'react-native';
import { StatusBar } from 'react-native';

interface FormData {
  title:  string;
  message: string;
  email: string;
  mobile:  string;
}

interface FormErrors {
  title: string;
  message: string;
  email: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title:  '',
    message: '',
    email: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    message:  '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9+\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors:  FormErrors = { title: '', message: '', email:  '' };

    if (!formData.title.trim()) {
      newErrors.title = 'يرجى إدخال عنوان الرسالة';
      isValid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = 'العنوان قصير جداً (3 أحرف على الأقل)';
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
    } else if (! validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSendEmail = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('تنبيه', 'يرجى التحقق من البيانات المدخلة');
      return;
    }

    setLoading(true);

    try {
      const subject = encodeURIComponent(formData.title);
      const body = encodeURIComponent(
        `العنوان: ${formData. title}\n\n` +
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
        
        // Clear form
        setTimeout(() => {
          setFormData({ title: '', message: '', email:  '', mobile: '' });
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
      Alert.alert('خطأ', 'حدث خطأ أثناء إرسال الرسالة.  يرجى المحاولة مرة أخرى.');
    }
  };

  // Handle WhatsApp
  const handleWhatsApp = async (): Promise<void> => {
    const phoneNumber = '966500000000'; // Replace with your number
    const message = encodeURIComponent(
      'السلام عليكم، أرغب في التواصل معكم'
    );
    
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const webWhatsappUrl = `https://wa.me/${phoneNumber}? text=${message}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (error) {
      Alert.alert('خطأ', 'لا يمكن فتح واتساب.  يرجى التأكد من تثبيت التطبيق.');
    }
  };

  const updateField = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof FormErrors]) {
      setErrors({ ... errors, [field]: '' });
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0B3C5D" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.decorativeLine} />
            <Text style={styles.headerTitle}>تواصل معنا</Text>
            <Text style={styles.headerSubtitle}>
              نسعد بتلقي رسالتك والرد عليها في أقرب وقت
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.formCard}>
            {/* Title Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                عنوان الرسالة <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'title' && styles.inputContainerFocused,
                  errors.title && styles.inputContainerError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => updateField('title', text)}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="مثال: استفسار عن الخدمات"
                  placeholderTextColor="#94A3B8"
                  textAlign="right"
                  maxLength={100}
                />
              </View>
              {errors. title ?  (
                <Text style={styles.errorText}>⚠ {errors.title}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                البريد الإلكتروني <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputContainerFocused,
                  errors.email && styles.inputContainerError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={formData. email}
                  onChangeText={(text) => updateField('email', text)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="example@email.com"
                  placeholderTextColor="#94A3B8"
                  textAlign="right"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>⚠ {errors.email}</Text>
              ) : null}
            </View>

            {/* Mobile Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles. inputLabel}>
                رقم الجوال <Text style={styles.optional}>(اختياري)</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'mobile' && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles. input}
                  value={formData.mobile}
                  onChangeText={(text) => updateField('mobile', text)}
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="05xxxxxxxx"
                  placeholderTextColor="#94A3B8"
                  textAlign="right"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                نص الرسالة <Text style={styles. required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.textAreaContainer,
                  focusedField === 'message' && styles.inputContainerFocused,
                  errors.message && styles.inputContainerError,
                ]}
              >
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.message}
                  onChangeText={(text) => updateField('message', text)}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="اكتب رسالتك هنا بالتفصيل..."
                  placeholderTextColor="#94A3B8"
                  textAlign="right"
                  multiline
                  numberOfLines={6}
                  maxLength={1000}
                />
              </View>
              <Text style={styles.charCounter}>
                {formData. message.length} / 1000
              </Text>
              {errors.message ? (
                <Text style={styles.errorText}>⚠ {errors.message}</Text>
              ) : null}
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.buttonDisabled]}
              onPress={handleSendEmail}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ?  (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>إرسال الرسالة</Text>
                  <Text style={styles. sendButtonIcon}>✉</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.divider} />
            </View>

            {/* WhatsApp Button */}
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <Text style={styles.whatsappButtonText}>
                تواصل معنا عبر واتساب
              </Text>
              <Text style={styles. whatsappIcon}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              نحن هنا لخدمتك على مدار الساعة
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B3C5D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header:  {
    alignItems: 'center',
    marginBottom: 32,
  },
  decorativeLine: {
    width: 60,
    height: 4,
    backgroundColor: '#FF9800',
    borderRadius: 2,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Almarai',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'Almarai',
    textAlign: 'center',
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ... Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity:  0.3,
        shadowRadius: 20,
      },
      android:  {
        elevation: 8,
      },
      web: {
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color:  '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Almarai',
  },
  required: {
    color: '#FF9800',
    fontSize: 16,
  },
  optional: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius:  16,
    borderWidth: 2,
    borderColor: 'transparent',
    transition: 'all 0.3s ease',
  },
  inputContainerFocused: {
    borderColor:  '#FF9800',
    ... Platform.select({
      ios: {
        shadowColor: '#FF9800',
        shadowOffset:  { width: 0, height:  0 },
        shadowOpacity:  0.3,
        shadowRadius: 8,
      },
      android:  {
        elevation: 4,
      },
    }),
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical:  16,
    fontSize: 16,
    color: '#1E293B',
    fontFamily:  'Almarai',
    textAlign: 'right',
  },
  textAreaContainer: {
    minHeight: 140,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  charCounter: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'left',
    marginTop: 6,
    fontFamily: 'Almarai',
  },
  errorText: {
    fontSize: 13,
    color:  '#FCA5A5',
    marginTop: 6,
    textAlign: 'right',
    fontFamily: 'Almarai',
  },
  sendButton: {
    backgroundColor: '#FF9800',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ... Platform.select({
      ios: {
        shadowColor: '#FF9800',
        shadowOffset:  { width: 0, height:  8 },
        shadowOpacity:  0.4,
        shadowRadius: 16,
      },
      android:  {
        elevation: 8,
      },
    }),
  },
  buttonDisabled: {
    opacity:  0.6,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Almarai',
    marginLeft: 8,
  },
  sendButtonIcon: {
    fontSize: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:  28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    fontSize: 14,
    color: '#94A3B8',
    marginHorizontal: 16,
    fontFamily: 'Almarai',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal:  24,
    flexDirection:  'row',
    alignItems: 'center',
    justifyContent: 'center',
    ... Platform.select({
      ios: {
        shadowColor: '#25D366',
        shadowOffset:  { width: 0, height:  8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  whatsappButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Almarai',
    marginLeft:  8,
  },
  whatsappIcon: {
    fontSize: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily:  'Almarai',
  },
});

export default ContactForm;



