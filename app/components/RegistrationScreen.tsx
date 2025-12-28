import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { useRef, useState } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegistrationScreenProps = {
    initialData?:  any;
    onNext: (data: any) => void;
    onBackToLogin: () => void;
};

const JOBS = [
    'كهربائي',
    'سباك',
    'نجار',
    'دهان',
    'بناء',
    'ميكانيكي',
    'خياط',
    'حداد',
    'نقاش',
    'مبرمج',
];

const AREAS = [
    'بغداد',
    'البصرة',
    'النجف',
    'كربلاء',
    'أربيل',
    'السليمانية',
    'الموصل',
    'ديالى',
    'الأنبار',
    'ذي قار',
];

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

export default function RegistrationScreen({
    initialData,
    onNext,
    onBackToLogin,
}: RegistrationScreenProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [mobile, setMobile] = useState(initialData?.mobile?. replace('+964', '') || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
    const [area, setArea] = useState(initialData?.area || '');
    const [jobMenuVisible, setJobMenuVisible] = useState(false);
    const [areaMenuVisible, setAreaMenuVisible] = useState(false);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const mobileInputRef = useRef<RNTextInput>(null);

    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

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

    const handleConfirmPasswordChange = (text: string) => {
        const convertedText = convertArabicToEnglish(text);
        const limited = convertedText.slice(0, 12);
        setConfirmPassword(limited);
    };

    const getDisplayMobile = (): string => {
        return formatMobileDisplay(mobile);
    };

    const getDisplayPassword = (pwd: string, show: boolean): string => {
        if (show) {
            return pwd;
        }
        return '•'.repeat(pwd.length);
    };

    const handleNext = async () => {
        Keyboard.dismiss();

        if (! name. trim()) {
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
        if (!mobile. trim() || mobile.length < 10) {
            Alert. alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
            return;
        }
        if (! password. trim() || password.length < 8) {
            Alert.alert('خطأ', 'يرجى إدخال كلمة المرور (8 أرقام على الأقل)');
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

        const englishPassword = convertArabicToEnglish(password);
        const englishMobile = convertArabicToEnglish(mobile);
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
                    await AsyncStorage.setItem(
                        'userRegistrationDraft',
                        JSON.stringify(draftData)
                    );
                    } catch (err) {
                    console.log('Storage error', err);
                    } finally {
                    // 👈 سيتم التنفيذ حتى لو التخزين فشل
                    onNext(draftData);
                    }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles. formCard}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
                    <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>الاسم الكامل</Text>
                        <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
                            <RNTextInput
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                textAlign="right"
                                placeholder="أدخل الاسم الكامل"
                                placeholderTextColor="#999"
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                returnKeyType="next"
                            />
                            <MaterialCommunityIcons name="account" size={20} color="#FF9800" style={styles.icon} />
                        </View>
                    </View>

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
                            <Text style={[styles.dropdownText, ! jobTitle && styles.placeholder]}>
                                {jobTitle || 'اختر المهنة'}
                            </Text>
                            <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" style={styles. icon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>المنطقة</Text>
                        <TouchableOpacity
                            style={[styles.inputWrapper, focusedField === 'area' && styles. inputWrapperFocused]}
                            onPress={() => {
                                Keyboard.dismiss();
                                setAreaMenuVisible(true);
                                setFocusedField('area');
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.dropdownText, ! area && styles.placeholder]}>
                                {area || 'اختر المنطقة'}
                            </Text>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>رقم الجوال</Text>
                        <View style={[styles.inputWrapper, focusedField === 'mobile' && styles. inputWrapperFocused]}>
                            <View style={styles.mobileInputContainer}>
                                <RNTextInput
                                    ref={mobileInputRef}
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
                        <Text style={styles.label}>البريد الإلكتروني</Text>
                        <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
                            <RNTextInput
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                textAlign="right"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="example@email.com"
                                placeholderTextColor="#999"
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                returnKeyType="next"
                            />
                            <MaterialCommunityIcons name="email" size={20} color="#FF9800" style={styles.icon} />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles. label}>كلمة المرور الجديدة</Text>
                        <View style={[styles.inputWrapper, focusedField === 'password' && styles. inputWrapperFocused]}>
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
                                    value={showPassword ? password : getDisplayPassword(password, false)}
                                    onChangeText={handlePasswordChange}
                                    style={styles.passwordInput}
                                    textAlign="right"
                                    keyboardType="number-pad"
                                    placeholder="أدخل كلمة المرور (12 رقم)"
                                    placeholderTextColor="#999"
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    returnKeyType="next"
                                    secureTextEntry={false}
                                />
                            </View>
                            <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
                        </View>
                        <Text style={styles.helperText}>
                            {password. length}/12 • استخدم 12 رقم فقط (عربي أو إنجليزي)
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>تأكيد كلمة المرور</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                                confirmPassword. length > 0 && password !== confirmPassword && styles.inputWrapperError,
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
                                    value={
                                        showConfirmPassword
                                            ? confirmPassword
                                            : getDisplayPassword(confirmPassword, false)
                                    }
                                    onChangeText={handleConfirmPasswordChange}
                                    style={styles.passwordInput}
                                    textAlign="right"
                                    keyboardType="number-pad"
                                    placeholder="أعد إدخال كلمة المرور"
                                    placeholderTextColor="#999"
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    returnKeyType="next"
                                    secureTextEntry={false}
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
                        </View>
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                            <Text style={styles. errorText}>كلمة المرور غير متطابقة</Text>
                        )}
                        {confirmPassword.length > 0 && password === confirmPassword && (
                            <Text style={styles. successText}>✓ كلمة المرور متطابقة</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>الوصف</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                styles.textAreaWrapper,
                                focusedField === 'description' && styles. inputWrapperFocused,
                            ]}
                        >
                            <RNTextInput
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
                        </View>
                        <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
                            {wordCount} / 120 كلمة {wordCount > 120 && '(تجاوز الحد الأقصى)'}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleNext} activeOpacity={0.8}>
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
                    style={styles. modalOverlay}
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
                            data={JOBS}
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
                                    {jobTitle === item && (
                                        <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
                                    )}
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
                    <View style={styles. modalContentBottom}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>اختر المنطقة</Text>
                        <FlatList
                            data={AREAS}
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
                                    {area === item && (
                                        <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
                                    )}
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
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow:  1,
        paddingBottom: 32,
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
        fontSize: 18,
        fontFamily: 'Almarai-Bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize:  14,
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
        paddingHorizontal:  12,
        minHeight: 56,
    },
    inputWrapperFocused: {
        borderColor: '#FF9800',
        borderWidth: 2,
    },
    inputWrapperError: {
        borderColor: '#f44336',
        borderWidth:  2,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Almarai-Regular',
        color: '#1a1a1a',
        paddingVertical: 12,
        textAlign: 'right',
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
        fontSize: 14,
        fontFamily: 'Almarai-Regular',
        color:  '#1a1a1a',
        paddingVertical: 12,
        textAlign: 'right',
    },
    mobilePrefix: {
        fontSize:  14,
        fontFamily: 'Almarai-Bold',
        color: '#666',
        marginRight: 8,
    },
    passwordInputContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Almarai-Regular',
        color: '#1a1a1a',
        paddingVertical: 12,
        textAlign: 'right',
        letterSpacing: 2,
    },
    eyeIcon: {
        padding: 8,
        marginLeft: 4,
    },
    dropdownText: {
        flex: 1,
        fontSize:  14,
        fontFamily:  'Almarai-Regular',
        color: '#1a1a1a',
        textAlign: 'right',
    },
    placeholder: {
        color: '#999',
    },
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
        marginTop:  4,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        minHeight: 100,
    },
    textArea: {
        minHeight: 80,
        paddingTop: 12,
    },
    textAreaIcon: {
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    wordCount: {
        fontSize: 12,
        fontFamily: 'Almarai-Regular',
        textAlign: 'right',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor:  '#e0e0e0',
        marginVertical: 8,
    },
    buttonContainer: {
        gap: 12,
        marginTop: 8,
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
        alignItems:  'center',
        justifyContent: 'center',
        gap: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontFamily: 'Almarai-Bold',
        color: '#FF9800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:  'flex-end',
    },
    modalContentBottom: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '70%',
    },
    modalHandle: {
        width:  40,
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
        paddingVertical:  12,
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