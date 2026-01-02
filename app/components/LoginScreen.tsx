import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import {  db } from "../services/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import GoogleLoginButton from './GoogleLoginButton';
import AppleLoginButton from './AppleLoginButton';


async function saveUserProfile(user:any) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const data = {
    uid: user.uid,
    name: user.displayName ?? "مستخدم جديد",
    email: user.email ?? "",
    provider: user.providerData?.[0]?.providerId ?? "apple",
    updatedAt: serverTimestamp(),
  };

  // أول مرة يسجل → إنشاء
  if (!snap.exists()) {
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  }
  // موجود مسبقًا → تحديث بدون مسح البيانات
  else {
    await setDoc(ref, data, { merge: true });
  }
}

type LoginScreenProps = {
    onLogin: (mobile: string, password: string, rememberMe: boolean) => void;
    onGoToRegister: () => void;
};

const convertArabicToEnglish = (text: string): string => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let converted = text;
    arabicNumbers.forEach((arabic, index) => {
        converted = converted.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
    });

    return converted;
};

const formatMobileDisplay = (mobile: string): string => {
    const cleaned = mobile.replace(/\s/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
};

export default function LoginScreen({ onLogin, onGoToRegister, navigation }: LoginScreenProps & { navigation?: any }) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [sendingReset, setSendingReset] = useState(false);

    const handleMobileChange = (text: string) => {
        const convertedText = convertArabicToEnglish(text);
        const digitsOnly = convertedText.replace(/[^0-9]/g, '');
        const limited = digitsOnly.slice(0, 10);
        setMobile(limited);
    };

    const handlePasswordChange = (text: string) => {
        const convertedText = convertArabicToEnglish(text);
        const limited = convertedText.slice(0, 12);
        setPassword(limited);
    };

    const getDisplayMobile = (): string => {
        return formatMobileDisplay(mobile);
    };

    const getDisplayPassword = (): string => {
        if (showPassword) {
            return password;
        }
        return '•'.repeat(password.length);
    };

    const handleLogin = () => {
        Keyboard.dismiss();

        if (!mobile.trim() || mobile.length < 10) {
            Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
            return;
        }

        if (!password.trim() || password.length < 8) {
            Alert.alert('خطأ', 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل');
            return;
        }

        const englishPassword = convertArabicToEnglish(password);
        onLogin('+964' + mobile, englishPassword, rememberMe);
    };

    const handleForgotPassword = async () => {
        Keyboard.dismiss();

        if (!resetEmail.trim() || !resetEmail.includes('@')) {
            Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        setSendingReset(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSendingReset(false);
            setForgotPasswordVisible(false);
            setResetEmail('');
            Alert.alert(
                'تم الإرسال',
                'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
                [{ text: 'حسناً' }]
            );
        } catch (error) {
            setSendingReset(false);
            Alert.alert('خطأ', 'فشل إرسال البريد.  يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <View style={styles.loginContainer}>
            <ScrollView
                contentContainerStyle={styles.loginScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formCard}>

                    {/* === فقط على الموبايل: أزرار Google/Apple بشكل مرتب أعلى الفورم === */}
                    {Platform.OS !== "web" && (
                        <View style={{ marginBottom: 16 }}>
                    {Platform.OS === "ios" && (
                     <AppleLoginButton
                        onSocialLogin={(draft) => {
                            navigation?.navigate("Registration", {
                            initialData: draft,
                            isSocialSignup: true,
                            });
                        }}
                        />

                    )}

                            {/* <GoogleLoginButton
                                onSocialLogin={async (user) => {
                                    await saveUserProfile(user);
                                    Alert.alert("نجاح", "تم تسجيل الدخول عبر Google 🎉");
                                    navigation?.goBack?.();
                                }}
                            /> */}
                        </View>
                    )}

                    <View style={styles.header}>
                        <MaterialCommunityIcons name="login" size={50} color="#FF9800" />
                        <Text style={styles.headerTitle}>تسجيل الدخول</Text>
                        <Text style={styles.loginSubtitle}>
                            أدخل رقم جوالك وكلمة المرور للدخول إلى حسابك
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>رقم الجوال</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    focusedField === 'mobile' && styles.inputWrapperFocused,
                                ]}
                            >
                                <View style={styles.mobileInputContainer}>
                                    <RNTextInput
                                        value={getDisplayMobile()}
                                        onChangeText={handleMobileChange}
                                        style={styles.mobileInput}
                                        textAlign="right"
                                        keyboardType="number-pad"
                                        placeholder="770 123 4567"
                                        placeholderTextColor="#999"
                                        onFocus={() => setFocusedField('mobile')}
                                        onBlur={() => setFocusedField(null)}
                                        returnKeyType="next"
                                    />
                                    <Text style={styles.mobilePrefix}>964+</Text>
                                </View>
                                <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
                            </View>
                            <Text style={styles.helperText}>
                                {mobile.length}/10 • استخدم الأرقام الإنجليزية أو العربية
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>كلمة المرور</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    focusedField === 'password' && styles.inputWrapperFocused,
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
                                        value={showPassword ? password : getDisplayPassword()}
                                        onChangeText={handlePasswordChange}
                                        style={styles.passwordInput}
                                        textAlign="right"
                                        keyboardType="number-pad"
                                        placeholder="أدخل كلمة المرور (12 رقم)"
                                        placeholderTextColor="#999"
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        returnKeyType="done"
                                        onSubmitEditing={handleLogin}
                                        secureTextEntry={false}
                                    />
                                </View>
                                <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
                            </View>
                            <Text style={styles.helperText}>{password.length}/12 • استخدم الأرقام فقط</Text>

                            <TouchableOpacity
                                onPress={() => setForgotPasswordVisible(true)}
                                activeOpacity={0.7}
                                style={styles.forgotPasswordButton}
                            >
                                <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                            </View>
                            <Text style={styles.rememberMeText}>تذكرني</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitButton} onPress={handleLogin} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="login" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>تسجيل الدخول</Text>
                        </TouchableOpacity>

                        <View style={styles.orDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.orText}>أو</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={onGoToRegister}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="account-plus" size={20} color="#FF9800" />
                            <Text style={styles.registerButtonText}>إنشاء حساب جديد</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={forgotPasswordVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setForgotPasswordVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => !sendingReset && setForgotPasswordVisible(false)}
                >
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <View style={styles.modalHeader}>
                            <MaterialCommunityIcons name="lock-reset" size={40} color="#FF9800" />
                            <Text style={styles.modalTitle}>نسيت كلمة المرور</Text>
                            <Text style={styles.modalSubtitle}>
                                أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
                            </Text>
                        </View>

                        <View style={styles.modalForm}>
                            <Text style={styles.label}>البريد الإلكتروني</Text>
                            <View style={styles.inputWrapper}>
                                <RNTextInput
                                    style={styles.modalInput}
                                    value={resetEmail}
                                    onChangeText={setResetEmail}
                                    placeholder="example@email.com"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    textAlign="right"
                                    editable={!sendingReset}
                                />
                                <MaterialCommunityIcons name="email" size={20} color="#FF9800" />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, sendingReset && styles.submitButtonDisabled]}
                                onPress={handleForgotPassword}
                                disabled={sendingReset}
                                activeOpacity={0.8}
                            >
                                {sendingReset ? (
                                    <Text style={styles.submitButtonText}>جاري الإرسال...</Text>
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="email-send" size={20} color="#fff" />
                                        <Text style={styles.submitButtonText}>إرسال الرابط</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setForgotPasswordVisible(false)}
                                disabled={sendingReset}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.modalCancelText}>إلغاء</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

// لاحظ: styles كما هو من كودك الأصلي (لا تحرك مكان الفيلدات الحقيقية)

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loginScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF9800',
        marginTop: 8,
    },
    loginSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    form: {
        marginTop: 8,
    },
    inputContainer: {
        marginBottom: 18,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 6,
        textAlign: 'right',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fafafa',
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    inputWrapperFocused: {
        borderColor: '#FF9800',
        backgroundColor: '#fffbe6',
    },
    mobileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mobileInput: {
        flex: 1,
        fontSize: 18,
        color: '#222',
        paddingVertical: 8,
        paddingHorizontal: 0,
        textAlign: 'right',
        backgroundColor: 'transparent',
    },
    mobilePrefix: {
        fontSize: 16,
        color: '#888',
        marginLeft: 8,
    },
    icon: {
        marginLeft: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
        textAlign: 'right',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    passwordInput: {
        flex: 1,
        fontSize: 18,
        color: '#222',
        paddingVertical: 8,
        paddingHorizontal: 0,
        textAlign: 'right',
        backgroundColor: 'transparent',
    },
    eyeIcon: {
        marginLeft: 8,
        padding: 4,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    forgotPasswordText: {
        color: '#FF9800',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FF9800',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#FF9800',
        borderColor: '#FF9800',
    },
    rememberMeText: {
        fontSize: 15,
        color: '#333',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9800',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#FFD699',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    orText: {
        marginHorizontal: 12,
        color: '#888',
        fontSize: 16,
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF9800',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 8,
    },
    registerButtonText: {
        color: '#FF9800',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF9800',
        marginTop: 8,
    },
    modalSubtitle: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    modalForm: {
        width: '100%',
        marginTop: 8,
    },
    modalInput: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        paddingVertical: 8,
        paddingHorizontal: 0,
        textAlign: 'right',
        backgroundColor: 'transparent',
    },
    modalCancelButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#FF9800',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

