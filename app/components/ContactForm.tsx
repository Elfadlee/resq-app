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
  const [sent, setSent] = useState(false);

  const titleRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateField = (field: keyof FormData, value: string) => {
    let error = '';

    if (field === 'title' && value.trim().length < 3) {
      error = 'يرجى إدخال عنوان الرسالة';
    }

    if (field === 'message' && value.trim().length < 10) {
      error = 'يرجى إدخال نص الرسالة';
    }

    if (field === 'email' && !validateEmail(value)) {
      error = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormReady =
    formData.title.trim().length >= 3 &&
    formData.message.trim().length >= 10 &&
    validateEmail(formData.email);

  const handleSendEmail = async () => {
    if (!isFormReady) return;

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

      const yourEmail = 'your.email@example.com';
      const mailtoUrl = `mailto:${yourEmail}?subject=${subject}&body=${body}`;

      const supported = await Linking.canOpenURL(mailtoUrl);

      if (supported) {
        await Linking.openURL(mailtoUrl);
        setFormData({ title: '', message: '', email: '', mobile: '' });
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    } catch (e) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إرسال الرسالة.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true} // ✅ مهم
      >
        {/* ✅ HEADER (التعديل الوحيد) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>تواصل معنا</Text>
          <Text style={styles.headerSubtitle}>
            نسعد بتلقي رسالتك والرد عليها في أقرب وقت
          </Text>
        </View>

        {sent && (
          <Text style={styles.successText}>✔ تم إرسال رسالتك بنجاح</Text>
        )}

        <View style={styles.formCard}>
          {/* Title */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>عنوان الرسالة *</Text>
            <View style={[styles.inputContainer, focusedField === 'title' && styles.focused]}>
              <TextInput
                ref={titleRef}
                style={styles.input}
                value={formData.title}
                onChangeText={t => updateField('title', t)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => {
                  setFocusedField(null);
                  validateField('title', formData.title);
                }}
                placeholder="مثال: استفسار عن الخدمات"
                textAlign="right"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            {!!errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>البريد الإلكتروني *</Text>
            <View style={[styles.inputContainer, focusedField === 'email' && styles.focused]}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={formData.email}
                onChangeText={t => updateField('email', t.replace(/\s/g, ''))}
                onFocus={() => setFocusedField('email')}
                onBlur={() => {
                  setFocusedField(null);
                  validateField('email', formData.email);
                }}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
                returnKeyType="next"
                onSubmitEditing={() => mobileRef.current?.focus()}
              />
            </View>
            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Mobile */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>رقم الجوال (اختياري)</Text>
            <View style={[styles.inputContainer, focusedField === 'mobile' && styles.focused]}>
              <TextInput
                ref={mobileRef}
                style={styles.input}
                value={formData.mobile}
                onChangeText={t => updateField('mobile', t.replace(/[^0-9]/g, ''))}
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField(null)}
                placeholder="07xxxxxxxx"
                keyboardType="phone-pad"
                textAlign="right"
                returnKeyType="next"
                onSubmitEditing={() => messageRef.current?.focus()}
              />
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>نص الرسالة *</Text>
            <View style={[styles.inputContainer, focusedField === 'message' && styles.focused]}>
              <TextInput
                ref={messageRef}
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={t => updateField('message', t)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => {
                  setFocusedField(null);
                  validateField('message', formData.message);
                }}
                placeholder="اكتب رسالتك هنا بالتفصيل..."
                multiline
                numberOfLines={6}
                textAlign="right"
              />
            </View>
            {!!errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.sendButton, (!isFormReady || loading) && styles.disabled]}
            onPress={handleSendEmail}
            disabled={!isFormReady || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>إرسال الرسالة</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>نحن هنا لخدمتك على مدار الساعة</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
scrollContent: {
  padding: 20,
  paddingBottom: 60,
},


  /* ✅ التعديل الوحيد */
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Almarai-Bold',
    color: '#0B3C5D',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 10,
  
    
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
   
  },

  successText: { color: '#22C55E', marginBottom: 12, textAlign: 'right' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#0B3C5D', textAlign: 'right', marginBottom: 14, },
  inputContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  focused: { borderColor: '#FF9800' },
  input: { padding: 12, fontSize: 14, textAlign: 'right', fontFamily: 'Almarai' },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  errorText: { color: '#EF4444', fontSize: 11, marginTop: 4, textAlign: 'right' },
  sendButton: { backgroundColor: '#25D366', padding: 14, borderRadius: 12, alignItems: 'center' },
  sendButtonText: { color: '#fff', fontSize: 14, fontFamily: 'Almarai-Bold' },
  disabled: { opacity: 0.5 },
  footer: { alignItems: 'center', marginTop: 2, paddingBottom: 9 },
  footerText: { fontSize: 12, color: '#789BB5', fontFamily: 'Almarai', textAlign: 'center' },
});

export default ContactFormCustomUI;
