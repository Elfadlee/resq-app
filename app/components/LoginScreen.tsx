import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type LoginScreenProps = {
    onLogin:  (mobile: string, password: string, rememberMe: boolean) => void;
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

export default function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

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
        return '•'. repeat(password.length);
    };

    const handleLogin = () => {
        Keyboard.dismiss();

        if (!mobile. trim() || mobile.length < 10) {
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

    return (
        <View style={styles.loginContainer}>
            <ScrollView
                contentContainerStyle={styles.loginScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles. formCard}>
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
                                    styles. inputWrapper,
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
                                            name={showPassword ?  'eye-off' : 'eye'}
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
                            style={styles. registerButton}
                            onPress={onGoToRegister}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="account-plus" size={20} color="#FF9800" />
                            <Text style={styles.registerButtonText}>إنشاء حساب جديد</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet. create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loginScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    formCard: {
        margin: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 24,
        ... Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity:  0.1,
                shadowRadius: 12,
            },
            android:  {
                elevation: 4,
            },
        }),
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Almarai-Bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    loginSubtitle: {
        fontSize: 14,
        fontFamily: 'Almarai-Regular',
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    form: {
        gap:  16,
    },
    inputContainer: {
        gap:  8,
    },
    label: {
        fontSize: 14,
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
    inputWrapperFocused: {
        borderColor: '#FF9800',
        borderWidth: 2,
    },
    icon: {
        marginLeft: 8,
    },
    mobileInputContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    mobileInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Almarai-Regular',
        color:  '#1a1a1a',
        paddingVertical: 12,
        textAlign: 'right',
    },
    mobilePrefix: {
        fontSize: 16,
        fontFamily: 'Almarai-Bold',
        color: '#666',
        marginRight: 8,
    },
    passwordInputContainer: {
        flex:  1,
        flexDirection:  'row-reverse',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Almarai-Regular',
        color:  '#1a1a1a',
        paddingVertical: 12,
        textAlign: 'right',
        letterSpacing: 2,
    },
    eyeIcon: {
        padding: 8,
        marginLeft: 4,
    },
    helperText: {
        fontSize: 12,
        fontFamily: 'Almarai-Regular',
        color: '#666',
        textAlign: 'right',
        marginTop: 4,
    },
    checkboxContainer: {
        flexDirection:  'row-reverse',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    checkbox:  {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#FF9800',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent:  'center',
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#FF9800',
    },
    rememberMeText: {
        flex: 1,
        fontSize:  14,
        fontFamily:  'Almarai-Regular',
        color: '#333',
        textAlign: 'right',
    },
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
        fontSize: 16,
        fontFamily: 'Almarai-Bold',
        color: '#fff',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    orText: {
        fontSize: 14,
        fontFamily: 'Almarai-Regular',
        color: '#999',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF9800',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row-reverse',
        alignItems:  'center',
        justifyContent: 'center',
        gap: 8,
    },
    registerButtonText: {
        fontSize: 16,
        fontFamily: 'Almarai-Bold',
        color: '#FF9800',
    },
});