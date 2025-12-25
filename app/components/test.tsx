// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as React from 'react';
// import { useRef, useState } from 'react';
// import {
//     Alert,
//     FlatList,
//     Keyboard,
//     Modal,
//     Platform,
//     TextInput as RNTextInput,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { registerUser } from '../storage/userStorage';




// type RegistrationFormProps = {
//     initialData? :  {
//         name? :  string;
//         jobTitle?:   string;
//         area?:  string;
//         mobile?: string;
//         email?: string;
//         description?: string;
//     };
//     isEditMode?: boolean;
//     onSubmit? :   (data: FormData) => void;
//     onDeleteAccount?:  () => void;
//     onLogin?: (mobile: string, password: string, rememberMe: boolean) => void; // ✅ Add this
// };

// type FormData = {
//     name:  string;
//     jobTitle: string;
//     area: string;
//     mobile: string;
//     email: string;
//     description: string;
//     password: string;
//     subscriptionPackage: string;
//     subscriptionDuration: 'monthly' | 'quarterly';
//     subscriptionPrice: number;
// };

// type SubscriptionPackage = {
//     id: string;
//     name: string;
//     nameAr: string;
//     icon: string;
//     color: string;
//     monthlyPrice: number;
//     quarterlyPrice: number;
//     features: string[];
// };

// const JOBS = [
//     'كهربائي',
//     'سباك',
//     'نجار',
//     'دهان',
//     'بناء',
//     'ميكانيكي',
//     'خياط',
//     'حداد',
//     'نقاش',
//     'مبرمج',
// ];

// const AREAS = [
//     'بغداد',
//     'البصرة',
//     'النجف',
//     'كربلاء',
//     'أربيل',
//     'السليمانية',
//     'الموصل',
//     'ديالى',
//     'الأنبار',
//     'ذي قار',
// ];

// const SUBSCRIPTION_PACKAGES:  SubscriptionPackage[] = [
//     {
//         id: 'basic',
//         name: 'Basic',
//         nameAr: 'أساسي',
//         icon: 'star-outline',
//         color: '#2196F3',
//         monthlyPrice: 7,
//         quarterlyPrice: 20,
//         features: [
//             'عرض الملف الشخصي',
//             'استقبال 10 طلبات شهرياً',
//             'دعم فني أساسي',
//             'إشعارات الطلبات',
//         ],
//     },
//     {
//         id: 'pro',
//         name: 'Pro',
//         nameAr: 'احترافي',
//         icon:  'star',
//         color: '#FF9800',
//         monthlyPrice: 25,
//         quarterlyPrice: 70,
//         features: [
//             'جميع مميزات الباقة الأساسية',
//             'استقبال طلبات غير محدودة',
//             'ظهور مميز في نتائج البحث',
//             'دعم فني ذو أولوية',
//             'إحصائيات تفصيلية',
//         ],
//     },
//     {
//         id: 'business',
//         name: 'Business',
//         nameAr: 'أعمال',
//         icon:  'crown',
//         color: '#9C27B0',
//         monthlyPrice: 75,
//         quarterlyPrice: 200,
//         features: [
//             'جميع مميزات الباقة الاحترافية',
//             'أولوية قصوى في نتائج البحث',
//             'إعلانات مميزة',
//             'مدير حساب مخصص',
//             'تقارير شهرية',
//         ],
//     },
// ];

// const convertArabicToEnglish = (text: string): string => {
//     const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
//     const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let converted = text;
//     arabicNumbers.forEach((arabic, index) => {
//         converted = converted.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
//     });

//     return converted;
// };

// const formatMobileDisplay = (mobile: string): string => {
//     const cleaned = mobile. replace(/\s/g, '');
//     if (cleaned.length <= 3) return cleaned;
//     if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
//     return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
// };


// // logic for LoginScreen component
// function LoginScreen({
//     onLogin,
//     onGoToRegister,
// }:  {
//     onLogin: (mobile: string, password: string, rememberMe: boolean) => void;
//     onGoToRegister:  () => void;
// }) {
//     const [mobile, setMobile] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);
//     const [focusedField, setFocusedField] = useState<string | null>(null);

//     const handleMobileChange = (text: string) => {
//         const convertedText = convertArabicToEnglish(text);
//         const digitsOnly = convertedText.replace(/[^0-9]/g, '');
//         const limited = digitsOnly.slice(0, 10);
//         setMobile(limited);
//     };

//     const handlePasswordChange = (text: string) => {
//     const convertedText = convertArabicToEnglish(text);
//     // 🟢 احذف السطر التالي: 
//     // const digitsOnly = convertedText.replace(/[^0-9]/g, '');
    
//     // 🟢 استبدله بهذا (يسمح بأرقام وحروف):
//     const limited = convertedText.slice(0, 12);
//     setPassword(limited);
// };

//     const getDisplayMobile = (): string => {
//         return formatMobileDisplay(mobile);
//     };

//     const getDisplayPassword = (): string => {
//         if (showPassword) {
//             return password;
//         }
//         return '•'. repeat(password.length);
//     };

// const handleLogin = () => {
//     Keyboard.dismiss();

//     if (! mobile.trim() || mobile.length < 10) {
//         Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
//         return;
//     }

//    if (! password. trim() || password.length < 8) { // غير من 12 إلى 8
//             Alert.alert('خطأ', 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل');
//             return;
//         }

//     const englishPassword = convertArabicToEnglish(password);
//     onLogin('+964' + mobile, englishPassword, rememberMe); // ✅ This calls the handler from ProfileScreen
// };

//     return (
//         <View style={styles.loginContainer}>
//             <ScrollView
//                 contentContainerStyle={styles.loginScrollContent}
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <View style={styles.formCard}>
//                     <View style={styles.header}>
//                         <MaterialCommunityIcons name="login" size={50} color="#FF9800" />
//                         <Text style={styles.headerTitle}>تسجيل الدخول</Text>
//                         <Text style={styles.loginSubtitle}>
//                             أدخل رقم جوالك وكلمة المرور للدخول إلى حسابك
//                         </Text>
//                     </View>

//                     <View style={styles.form}>
//                         <View style={styles.inputContainer}>
//                             <Text style={styles.label}>رقم الجوال</Text>
//                             <View
//                                 style={[
//                                     styles.inputWrapper,
//                                     focusedField === 'mobile' && styles.inputWrapperFocused,
//                                 ]}
//                             >
//                                 <View style={styles.mobileInputContainer}>
//                                     <RNTextInput
//                                         value={getDisplayMobile()}
//                                         onChangeText={handleMobileChange}
//                                         style={styles.mobileInput}
//                                         textAlign="right"
//                                         keyboardType="number-pad"
//                                         placeholder="770 123 4567"
//                                         placeholderTextColor="#999"
//                                         onFocus={() => setFocusedField('mobile')}
//                                         onBlur={() => setFocusedField(null)}
//                                         returnKeyType="next"
//                                     />
//                                     <Text style={styles.mobilePrefix}>964+</Text>
//                                 </View>
//                                 <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
//                             </View>
//                             <Text style={styles.helperText}>
//                                 {mobile.length}/10 • استخدم الأرقام الإنجليزية أو العربية
//                             </Text>
//                         </View>

//                         <View style={styles.inputContainer}>
//                             <Text style={styles.label}>كلمة المرور</Text>
//                             <View
//                                 style={[
//                                     styles. inputWrapper,
//                                     focusedField === 'password' && styles.inputWrapperFocused,
//                                 ]}
//                             >
//                                 <View style={styles.passwordInputContainer}>
//                                     <TouchableOpacity
//                                         onPress={() => setShowPassword(!showPassword)}
//                                         style={styles.eyeIcon}
//                                         activeOpacity={0.7}
//                                     >
//                                         <MaterialCommunityIcons
//                                             name={showPassword ? 'eye-off' : 'eye'}
//                                             size={20}
//                                             color="#666"
//                                         />
//                                     </TouchableOpacity>
//                                     <RNTextInput
//                                         value={showPassword ? password : getDisplayPassword()}
//                                         onChangeText={handlePasswordChange}
//                                         style={styles.passwordInput}
//                                         textAlign="right"
//                                         keyboardType="number-pad"
//                                         placeholder="أدخل كلمة المرور (12 رقم)"
//                                         placeholderTextColor="#999"
//                                         onFocus={() => setFocusedField('password')}
//                                         onBlur={() => setFocusedField(null)}
//                                         returnKeyType="done"
//                                         onSubmitEditing={handleLogin}
//                                         secureTextEntry={false}
//                                     />
//                                 </View>
//                                 <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
//                             </View>
//                             <Text style={styles.helperText}>{password.length}/12 • استخدم الأرقام فقط</Text>
//                         </View>

//                         <TouchableOpacity
//                             style={styles.checkboxContainer}
//                             onPress={() => setRememberMe(!rememberMe)}
//                             activeOpacity={0.7}
//                         >
//                             <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
//                                 {rememberMe && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
//                             </View>
//                             <Text style={styles.rememberMeText}>تذكرني</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.submitButton} onPress={handleLogin} activeOpacity={0.8}>
//                             <MaterialCommunityIcons name="login" size={20} color="#fff" />
//                             <Text style={styles.submitButtonText}>تسجيل الدخول</Text>
//                         </TouchableOpacity>

//                         <View style={styles.orDivider}>
//                             <View style={styles.dividerLine} />
//                             <Text style={styles.orText}>أو</Text>
//                             <View style={styles.dividerLine} />
//                         </View>

//                         <TouchableOpacity
//                             style={styles.registerButton}
//                             onPress={onGoToRegister}
//                             activeOpacity={0.8}
//                         >
//                             <MaterialCommunityIcons name="account-plus" size={20} color="#FF9800" />
//                             <Text style={styles.registerButtonText}>إنشاء حساب جديد</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// }

// //end of LoginScreen component


// // start Main RegistrationForm component

// export default function RegistrationForm({
//     initialData,
//     isEditMode = false,
//     onSubmit,
//     onDeleteAccount,
//     onLogin, // ✅ Add this line
// }:   RegistrationFormProps) {
//     const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

//     const [name, setName] = useState(initialData?.name || '');
//     const [mobile, setMobile] = useState(initialData?.mobile?. replace('+964', '') || '');
//     const [email, setEmail] = useState(initialData?. email || '');
//     const [description, setDescription] = useState(initialData?.description || '');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [acceptPolicy, setAcceptPolicy] = useState(false);

//     const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
//     const [area, setArea] = useState(initialData?. area || '');
//     const [jobMenuVisible, setJobMenuVisible] = useState(false);
//     const [areaMenuVisible, setAreaMenuVisible] = useState(false);

//     const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
//     const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly'>('monthly');

//     const [focusedField, setFocusedField] = useState<string | null>(null);

//     const mobileInputRef = useRef<RNTextInput>(null);

//     const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

//     const handleMobileChange = (text: string) => {
//         const convertedText = convertArabicToEnglish(text);
//         const digitsOnly = convertedText.replace(/[^0-9]/g, '');
//         const limited = digitsOnly.slice(0, 10);
//         setMobile(limited);
//     };

//  const handlePasswordChange = (text: string) => {
//     const convertedText = convertArabicToEnglish(text);
//     // 🟢 احذف السطر التالي: 
//     // const digitsOnly = convertedText.replace(/[^0-9]/g, '');
    
//     // 🟢 استبدله بهذا (يسمح بأرقام وحروف):
//     const limited = convertedText.slice(0, 12);
//     setPassword(limited);
// };

//  const handleConfirmPasswordChange = (text: string) => {
//     const convertedText = convertArabicToEnglish(text);
//     // 🟢 احذف:  const digitsOnly = convertedText.replace(/[^0-9]/g, '');
//     const limited = convertedText.slice(0, 12);
//     setConfirmPassword(limited);
// };

//     const getDisplayMobile = (): string => {
//         return formatMobileDisplay(mobile);
//     };

//     const getDisplayPassword = (pwd: string, show: boolean): string => {
//         if (show) {
//             return pwd;
//         }
//         return '•'.repeat(pwd.length);
//     };

// const handleLogin = (mobileNumber:  string, password: string, rememberMe: boolean) => {
//     // ✅ Check if onLogin prop is provided from ProfileScreen
//     if (onLogin) {
//         onLogin(mobileNumber, password, rememberMe);
//         return;
//     }
    
//     // Fallback alert if onLogin is not provided
//     Alert.alert(
//         'تسجيل الدخول',
//         `جاري التحقق من البيانات.. .\nرقم الجوال:  ${mobileNumber}\nكلمة المرور: ${password}\nتذكرني:  ${
//             rememberMe ? 'نعم' : 'لا'
//         }`,
//         [
//             {
//                 text: 'موافق',
//                 onPress: () => {
//                     Alert.alert('تنبيه', 'الحساب غير موجود أو كلمة المرور خاطئة. يرجى المحاولة مرة أخرى.');
//                 },
//             },
//         ]
//     );
// };

// // start of handleSubmit function

// const handleSubmit = () => {
//     Keyboard.dismiss();

//     if (!name. trim()) {
//         Alert.alert('خطأ', 'يرجى إدخال الاسم');
//         return;
//     }
//     if (!jobTitle) {
//         Alert.alert('خطأ', 'يرجى اختيار المهنة');
//         return;
//     }
//     if (!area) {
//         Alert.alert('خطأ', 'يرجى اختيار المنطقة');
//         return;
//     }
//     if (!mobile. trim() || mobile.length < 10) {
//         Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
//         return;
//     }
//     if (!password.trim() || password.length < 8) {
//         Alert.alert('خطأ', 'يرجى إدخال كلمة المرور (8 أرقام على الأقل)');
//         return;
//     }
//     if (password !== confirmPassword) {
//         Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
//         return;
//     }
//     if (!email.trim() || !email.includes('@')) {
//         Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
//         return;
//     }
//     if (wordCount > 120) {
//         Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة.  الحد الأقصى 120 كلمة`);
//         return;
//     }
//     if (! selectedPackage) {
//         Alert.alert('خطأ', 'يرجى اختيار باقة الاشتراك');
//         return;
//     }
//     if (!acceptPolicy) {
//         Alert.alert('خطأ', 'يرجى الموافقة على سياسة الخصوصية');
//         return;
//     }

//     const englishPassword = convertArabicToEnglish(password);
//     const englishMobile = convertArabicToEnglish(mobile);
//     const pkg = SUBSCRIPTION_PACKAGES.find((p) => p.id === selectedPackage);
//     const price = selectedDuration === 'monthly' ? pkg?. monthlyPrice : pkg?.quarterlyPrice;

//     Alert.alert(
//         'تأكيد التسجيل',
//         `الاسم: ${name. trim()}\nالمهنة: ${jobTitle}\nالبريد الإلكتروني: ${email. trim()}\nالباقة: ${pkg?.nameAr}\nالمدة: ${
//             selectedDuration === 'monthly' ? 'شهري' : 'ربع سنوي'
//         }\nالسعر: $${price}`,
//         [
//             { text: 'إلغاء', style: 'cancel' },
//             {
//                 text: 'تأكيد',
//                 onPress: () => {
//                     // 🟢 استدعاء registerUser من storage
//                     const newUser = registerUser({
//                         name:  name.trim(),
//                         jobTitle,
//                         area,
//                         mobile: '+964' + englishMobile,
//                         email: email.trim(),
//                         description: description.trim(),
//                         password: englishPassword,
//                         subscriptionPackage: pkg?.nameAr || '',
//                         subscriptionDuration:  selectedDuration,
//                         subscriptionPrice: price || 0,
//                     });

//                     // 🟢 رسالة نجاح
//                     Alert. alert(
//                         '✅ تم التسجيل بنجاح',
//                         `مرحباً ${newUser.name}!\nتم إنشاء حسابك بنجاح.\n\n${
//                             newUser.subscriptionPackage === 'أعمال'
//                                 ? '🎉 تم إضافتك إلى البنر الإعلاني!'
//                                 : ''
//                         }`,
//                         [
//                             {
//                                 text: 'موافق',
//                                 onPress: () => {
//                                     // 🟢 العودة للشاشة الرئيسية أو Login
//                                     setCurrentScreen('login');
                                    
//                                     // إعادة تعيين الحقول
//                                     setName('');
//                                     setJobTitle('');
//                                     setArea('');
//                                     setMobile('');
//                                     setEmail('');
//                                     setDescription('');
//                                     setPassword('');
//                                     setConfirmPassword('');
//                                     setSelectedPackage(null);
//                                     setAcceptPolicy(false);
//                                 },
//                             },
//                         ]
//                     );

//                     // 🟢 استدعاء onSubmit إذا كان موجود (اختياري)
//                     if (onSubmit) {
//                         const formData = {
//                             name:  name.trim(),
//                             jobTitle,
//                             area,
//                             mobile: '+964' + englishMobile,
//                             email: email.trim(),
//                             description: description.trim(),
//                             password: englishPassword,
//                             subscriptionPackage:  pkg?.nameAr || '',
//                             subscriptionDuration: selectedDuration,
//                             subscriptionPrice: price || 0,
//                         };
//                         onSubmit(formData);
//                     }
//                 },
//             },
//         ]
//     );
// };

//     /// Render logic to switch between LoginScreen and RegistrationForm

//     if (currentScreen === 'login') {
//         return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setCurrentScreen('register')} />;
//     }

//     return (
//         <ScrollView
//             style={styles.container}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//         >
//             <View style={styles.formCard}>
//                 <View style={styles.header}>
//                     <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
//                     <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
//                 </View>

//                 <View style={styles.form}>
//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>الاسم الكامل</Text>
//                         <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
//                             <RNTextInput
//                                 value={name}
//                                 onChangeText={setName}
//                                 style={styles.input}
//                                 textAlign="right"
//                                 placeholder="أدخل الاسم الكامل"
//                                 placeholderTextColor="#999"
//                                 onFocus={() => setFocusedField('name')}
//                                 onBlur={() => setFocusedField(null)}
//                                 returnKeyType="next"
//                             />
//                             <MaterialCommunityIcons name="account" size={20} color="#FF9800" style={styles.icon} />
//                         </View>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles. label}>المهنة</Text>
//                         <TouchableOpacity
//                             style={[styles.inputWrapper, focusedField === 'job' && styles.inputWrapperFocused]}
//                             onPress={() => {
//                                 Keyboard.dismiss();
//                                 setJobMenuVisible(true);
//                                 setFocusedField('job');
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={[styles.dropdownText, ! jobTitle && styles.placeholder]}>
//                                 {jobTitle || 'اختر المهنة'}
//                             </Text>
//                             <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" style={styles. icon} />
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>المنطقة</Text>
//                         <TouchableOpacity
//                             style={[styles.inputWrapper, focusedField === 'area' && styles. inputWrapperFocused]}
//                             onPress={() => {
//                                 Keyboard.dismiss();
//                                 setAreaMenuVisible(true);
//                                 setFocusedField('area');
//                             }}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={[styles.dropdownText, ! area && styles.placeholder]}>
//                                 {area || 'اختر المنطقة'}
//                             </Text>
//                             <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" style={styles.icon} />
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>رقم الجوال</Text>
//                         <View style={[styles.inputWrapper, focusedField === 'mobile' && styles. inputWrapperFocused]}>
//                             <View style={styles.mobileInputContainer}>
//                                 <RNTextInput
//                                     ref={mobileInputRef}
//                                     value={getDisplayMobile()}
//                                     onChangeText={handleMobileChange}
//                                     style={styles.mobileInput}
//                                     textAlign="right"
//                                     keyboardType="number-pad"
//                                     placeholder="770 123 4567"
//                                     placeholderTextColor="#999"
//                                     onFocus={() => setFocusedField('mobile')}
//                                     onBlur={() => setFocusedField(null)}
//                                     returnKeyType="next"
//                                 />
//                                 <Text style={styles.mobilePrefix}>964+</Text>
//                             </View>
//                             <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
//                         </View>
//                         <Text style={styles.helperText}>
//                             {mobile.length}/10 • استخدم الأرقام الإنجليزية أو العربية
//                         </Text>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>البريد الإلكتروني</Text>
//                         <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
//                             <RNTextInput
//                                 value={email}
//                                 onChangeText={setEmail}
//                                 style={styles.input}
//                                 textAlign="right"
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 placeholder="example@email.com"
//                                 placeholderTextColor="#999"
//                                 onFocus={() => setFocusedField('email')}
//                                 onBlur={() => setFocusedField(null)}
//                                 returnKeyType="next"
//                             />
//                             <MaterialCommunityIcons name="email" size={20} color="#FF9800" style={styles.icon} />
//                         </View>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles. label}>كلمة المرور الجديدة</Text>
//                         <View style={[styles.inputWrapper, focusedField === 'password' && styles. inputWrapperFocused]}>
//                             <View style={styles.passwordInputContainer}>
//                                 <TouchableOpacity
//                                     onPress={() => setShowPassword(!showPassword)}
//                                     style={styles.eyeIcon}
//                                     activeOpacity={0.7}
//                                 >
//                                     <MaterialCommunityIcons
//                                         name={showPassword ?  'eye-off' : 'eye'}
//                                         size={20}
//                                         color="#666"
//                                     />
//                                 </TouchableOpacity>
//                                 <RNTextInput
//                                     value={showPassword ? password : getDisplayPassword(password, false)}
//                                     onChangeText={handlePasswordChange}
//                                     style={styles.passwordInput}
//                                     textAlign="right"
//                                     keyboardType="number-pad"
//                                     placeholder="أدخل كلمة المرور (12 رقم)"
//                                     placeholderTextColor="#999"
//                                     onFocus={() => setFocusedField('password')}
//                                     onBlur={() => setFocusedField(null)}
//                                     returnKeyType="next"
//                                     secureTextEntry={false}
//                                 />
//                             </View>
//                             <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
//                         </View>
//                         <Text style={styles.helperText}>
//                             {password.length}/12 • استخدم 12 رقم فقط (عربي أو إنجليزي)
//                         </Text>
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>تأكيد كلمة المرور</Text>
//                         <View
//                             style={[
//                                 styles.inputWrapper,
//                                 focusedField === 'confirmPassword' && styles.inputWrapperFocused,
//                                 confirmPassword. length > 0 && password !== confirmPassword && styles.inputWrapperError,
//                             ]}
//                         >
//                             <View style={styles.passwordInputContainer}>
//                                 <TouchableOpacity
//                                     onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     style={styles.eyeIcon}
//                                     activeOpacity={0.7}
//                                 >
//                                     <MaterialCommunityIcons
//                                         name={showConfirmPassword ?  'eye-off' : 'eye'}
//                                         size={20}
//                                         color="#666"
//                                     />
//                                 </TouchableOpacity>
//                                 <RNTextInput
//                                     value={
//                                         showConfirmPassword
//                                             ? confirmPassword
//                                             : getDisplayPassword(confirmPassword, false)
//                                     }
//                                     onChangeText={handleConfirmPasswordChange}
//                                     style={styles.passwordInput}
//                                     textAlign="right"
//                                     keyboardType="number-pad"
//                                     placeholder="أعد إدخال كلمة المرور"
//                                     placeholderTextColor="#999"
//                                     onFocus={() => setFocusedField('confirmPassword')}
//                                     onBlur={() => setFocusedField(null)}
//                                     returnKeyType="next"
//                                     secureTextEntry={false}
//                                 />
//                             </View>
//                             <MaterialCommunityIcons
//                                 name={
//                                     confirmPassword.length > 0 && password === confirmPassword
//                                         ? 'check-circle'
//                                         : 'lock-check'
//                                 }
//                                 size={20}
//                                 color={confirmPassword.length > 0 && password === confirmPassword ? '#4CAF50' : '#FF9800'}
//                                 style={styles.icon}
//                             />
//                         </View>
//                         {confirmPassword.length > 0 && password !== confirmPassword && (
//                             <Text style={styles. errorText}>كلمة المرور غير متطابقة</Text>
//                         )}
//                         {confirmPassword.length > 0 && password === confirmPassword && (
//                             <Text style={styles. successText}>✓ كلمة المرور متطابقة</Text>
//                         )}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>الوصف</Text>
//                         <View
//                             style={[
//                                 styles.inputWrapper,
//                                 styles.textAreaWrapper,
//                                 focusedField === 'description' && styles. inputWrapperFocused,
//                             ]}
//                         >
//                             <RNTextInput
//                                 value={description}
//                                 onChangeText={setDescription}
//                                 style={[styles.input, styles.textArea]}
//                                 textAlign="right"
//                                 multiline
//                                 numberOfLines={4}
//                                 placeholder="اكتب وصف مختصر عن خدماتك..."
//                                 placeholderTextColor="#999"
//                                 onFocus={() => setFocusedField('description')}
//                                 onBlur={() => setFocusedField(null)}
//                                 returnKeyType="done"
//                             />
//                             <MaterialCommunityIcons
//                                 name="text"
//                                 size={20}
//                                 color="#FF9800"
//                                 style={[styles.icon, styles.textAreaIcon]}
//                             />
//                         </View>
//                         <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
//                             {wordCount} / 120 كلمة {wordCount > 120 && '(تجاوز الحد الأقصى)'}
//                         </Text>
//                     </View>

//                     <View style={styles.subscriptionSection}>
//                         <View style={styles.subscriptionHeader}>
//                             <MaterialCommunityIcons name="crown-outline" size={24} color="#FF9800" />
//                             <Text style={styles.subscriptionSectionTitle}>اختر باقة الاشتراك</Text>
//                         </View>

//                         <View style={styles. durationToggle}>
//                             <TouchableOpacity
//                                 style={[
//                                     styles. durationButton,
//                                     selectedDuration === 'monthly' && styles. durationButtonActive,
//                                 ]}
//                                 onPress={() => setSelectedDuration('monthly')}
//                                 activeOpacity={0.8}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.durationButtonText,
//                                         selectedDuration === 'monthly' && styles. durationButtonTextActive,
//                                     ]}
//                                 >
//                                     شهري
//                                 </Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[
//                                     styles.durationButton,
//                                     selectedDuration === 'quarterly' && styles.durationButtonActive,
//                                 ]}
//                                 onPress={() => setSelectedDuration('quarterly')}
//                                 activeOpacity={0.8}
//                             >
//                                 <View style={styles.saveBadge}>
//                                     <Text style={styles.saveBadgeText}>وفر 15%</Text>
//                                 </View>
//                                 <Text
//                                     style={[
//                                         styles. durationButtonText,
//                                         selectedDuration === 'quarterly' && styles.durationButtonTextActive,
//                                     ]}
//                                 >
//                                     ربع سنوي
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.packagesContainer}>
//                             {SUBSCRIPTION_PACKAGES.map((pkg) => {
//                                 const isSelected = selectedPackage === pkg.id;
//                                 const price = selectedDuration === 'monthly' ? pkg.monthlyPrice :  pkg.quarterlyPrice;

//                                 return (
//                                     <TouchableOpacity
//                                         key={pkg.id}
//                                         style={[
//                                             styles.packageCard,
//                                             isSelected && styles.packageCardSelected,
//                                             { borderColor: isSelected ? pkg.color : '#e0e0e0' },
//                                         ]}
//                                         onPress={() => setSelectedPackage(pkg.id)}
//                                         activeOpacity={0.8}
//                                     >
//                                         {pkg.id === 'pro' && (
//                                             <View style={[styles.popularBadge, { backgroundColor: pkg. color }]}>
//                                                 <MaterialCommunityIcons name="fire" size={14} color="#fff" />
//                                                 <Text style={styles.popularBadgeText}>الأكثر شعبية</Text>
//                                             </View>
//                                         )}

//                                         <View style={styles.packageContent}>
//                                             <View style={styles.packageLeft}>
//                                                 <View
//                                                     style={[
//                                                         styles.packageIcon,
//                                                         { backgroundColor: pkg.color + '20' },
//                                                     ]}
//                                                 >
//                                                     <MaterialCommunityIcons
//                                                         name={pkg.icon as any}
//                                                         size={32}
//                                                         color={pkg.color}
//                                                     />
//                                                 </View>
//                                                 <View style={styles.packageInfo}>
//                                                     <Text style={styles.packageName}>{pkg.nameAr}</Text>
//                                                     <Text style={styles.packageNameEn}>{pkg.name}</Text>
//                                                 </View>
//                                             </View>

//                                             <View style={styles.packageRight}>
//                                                 <Text style={[styles.packagePriceAmount, { color: pkg.color }]}>
//                                                     ${price}
//                                                 </Text>
//                                                 <Text style={styles.packagePricePeriod}>
//                                                     {selectedDuration === 'monthly' ? 'شهر' : '3 أشهر'}
//                                                 </Text>
//                                             </View>
//                                         </View>

//                                         <View style={styles.packageFeatures}>
//                                             {pkg.features.map((feature, index) => (
//                                                 <View key={index} style={styles.packageFeature}>
//                                                     <MaterialCommunityIcons
//                                                         name="check-circle"
//                                                         size={16}
//                                                         color={pkg.color}
//                                                     />
//                                                     <Text style={styles.packageFeatureText}>{feature}</Text>
//                                                 </View>
//                                             ))}
//                                         </View>

//                                         {isSelected && (
//                                             <View style={[styles.selectionIndicator, { backgroundColor: pkg.color }]}>
//                                                 <MaterialCommunityIcons name="check" size={20} color="#fff" />
//                                             </View>
//                                         )}
//                                     </TouchableOpacity>
//                                 );
//                             })}
//                         </View>
//                     </View>

//                     <TouchableOpacity
//                         style={styles.checkboxContainer}
//                         onPress={() => setAcceptPolicy(!acceptPolicy)}
//                         activeOpacity={0.7}
//                     >
//                         <View style={[styles.checkbox, acceptPolicy && styles.checkboxChecked]}>
//                             {acceptPolicy && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
//                         </View>
//                         <Text style={styles.policyText}>
//                             أوافق على <Text style={styles.policyLink}>سياسة الخصوصية والشروط</Text>
//                         </Text>
//                     </TouchableOpacity>

//                     <View style={styles.divider} />

//                     <View style={styles.buttonContainer}>
//                         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
//                             <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
//                             <Text style={styles.submitButtonText}>تأكيد التسجيل</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.backButton}
//                             onPress={() => setCurrentScreen('login')}
//                             activeOpacity={0.8}
//                         >
//                             <MaterialCommunityIcons name="arrow-right" size={20} color="#FF9800" />
//                             <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>

//             <Modal
//                 visible={jobMenuVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => {
//                     setJobMenuVisible(false);
//                     setFocusedField(null);
//                 }}
//             >
//                 <TouchableOpacity
//                     style={styles. modalOverlay}
//                     activeOpacity={1}
//                     onPress={() => {
//                         setJobMenuVisible(false);
//                         setFocusedField(null);
//                     }}
//                 >
//                     <View style={styles.modalContentBottom}>
//                         <View style={styles.modalHandle} />
//                         <Text style={styles.modalTitle}>اختر المهنة</Text>
//                         <FlatList
//                             data={JOBS}
//                             keyExtractor={(item) => item}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity
//                                     style={styles.menuItem}
//                                     onPress={() => {
//                                         setJobTitle(item);
//                                         setJobMenuVisible(false);
//                                         setFocusedField(null);
//                                     }}
//                                     activeOpacity={0.7}
//                                 >
//                                     <Text style={styles.menuItemText}>{item}</Text>
//                                     {jobTitle === item && (
//                                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                                     )}
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </View>
//                 </TouchableOpacity>
//             </Modal>

//             <Modal
//                 visible={areaMenuVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => {
//                     setAreaMenuVisible(false);
//                     setFocusedField(null);
//                 }}
//             >
//                 <TouchableOpacity
//                     style={styles. modalOverlay}
//                     activeOpacity={1}
//                     onPress={() => {
//                         setAreaMenuVisible(false);
//                         setFocusedField(null);
//                     }}
//                 >
//                     <View style={styles.modalContentBottom}>
//                         <View style={styles. modalHandle} />
//                         <Text style={styles.modalTitle}>اختر المنطقة</Text>
//                         <FlatList
//                             data={AREAS}
//                             keyExtractor={(item) => item}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity
//                                     style={styles.menuItem}
//                                     onPress={() => {
//                                         setArea(item);
//                                         setAreaMenuVisible(false);
//                                         setFocusedField(null);
//                                     }}
//                                     activeOpacity={0.7}
//                                 >
//                                     <Text style={styles.menuItemText}>{item}</Text>
//                                     {area === item && (
//                                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                                     )}
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </View>
//                 </TouchableOpacity>
//             </Modal>
//         </ScrollView>
//     );
// }

// // end of RegistrationForm component

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     scrollContent: {
//         flexGrow:  1,
//         paddingBottom: 32,
//     },
//     loginContainer: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     loginScrollContent: {
//         flexGrow:  1,
//         justifyContent: 'center',
//         padding: 16,
//     },
//     formCard: {
//         margin: 16,
//         borderRadius: 20,
//         backgroundColor: '#fff',
//         padding: 24,
//         ... Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity:  0.1,
//                 shadowRadius: 12,
//             },
//             android:  {
//                 elevation: 4,
//             },
//         }),
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 24,
//         gap: 12,
//     },
//     headerTitle: {
//         fontSize: 22,
//         fontFamily: 'Almarai-Bold',
//         color: '#1a1a1a',
//         textAlign: 'center',
//     },
//     loginSubtitle: {
//         fontSize:  14,
//         fontFamily: 'Almarai-Regular',
//         color: '#666',
//         textAlign: 'center',
//         marginTop: 8,
//     },
//     form: {
//         gap: 16,
//     },
//     inputContainer: {
//         gap: 8,
//     },
//     label:  {
//         fontSize: 14,
//         fontFamily: 'Almarai-Bold',
//         color: '#333',
//         textAlign: 'right',
//     },
//     inputWrapper: {
//         flexDirection:  'row-reverse',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//         borderRadius: 12,
//         backgroundColor: '#fff',
//         paddingHorizontal: 12,
//         minHeight: 56,
//     },
//     inputWrapperFocused: {
//         borderColor: '#FF9800',
//         borderWidth: 2,
//     },
//     inputWrapperError: {
//         borderColor: '#f44336',
//         borderWidth: 2,
//     },
//     input: {
//         flex: 1,
//         fontSize: 16,
//         fontFamily: 'Almarai-Regular',
//         color: '#1a1a1a',
//         paddingVertical: 12,
//         textAlign: 'right',
//     },
//     icon: {
//         marginLeft: 8,
//     },
//     mobileInputContainer: {
//         flex: 1,
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//     },
//     mobileInput: {
//         flex: 1,
//         fontSize: 16,
//         fontFamily: 'Almarai-Regular',
//         color: '#1a1a1a',
//         paddingVertical: 12,
//         textAlign: 'right',
//     },
//     mobilePrefix: {
//         fontSize: 16,
//         fontFamily: 'Almarai-Bold',
//         color: '#666',
//         marginRight: 8,
//     },
//     passwordInputContainer: {
//         flex: 1,
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//     },
//     passwordInput: {
//         flex:  1,
//         fontSize: 16,
//         fontFamily: 'Almarai-Regular',
//         color: '#1a1a1a',
//         paddingVertical: 12,
//         textAlign: 'right',
//         letterSpacing: 2,
//     },
//     eyeIcon: {
//         padding: 8,
//         marginLeft: 4,
//     },
//     dropdownText: {
//         flex: 1,
//         fontSize:  16,
//         fontFamily:  'Almarai-Regular',
//         color: '#1a1a1a',
//         textAlign: 'right',
//     },
//     placeholder: {
//         color: '#999',
//     },
//     helperText: {
//         fontSize:  12,
//         fontFamily: 'Almarai-Regular',
//         color: '#666',
//         textAlign: 'right',
//         marginTop: 4,
//     },
//     errorText: {
//         fontSize: 12,
//         fontFamily: 'Almarai-Regular',
//         color: '#f44336',
//         textAlign:  'right',
//         marginTop: 4,
//     },
//     successText: {
//         fontSize: 12,
//         fontFamily: 'Almarai-Regular',
//         color: '#4CAF50',
//         textAlign:  'right',
//         marginTop: 4,
//     },
//     textAreaWrapper: {
//         alignItems: 'flex-start',
//         minHeight: 100,
//     },
//     textArea: {
//         minHeight: 80,
//         paddingTop: 12,
//     },
//     textAreaIcon: {
//         alignSelf: 'flex-start',
//         marginTop: 12,
//     },
//     wordCount: {
//         fontSize: 12,
//         fontFamily: 'Almarai-Regular',
//         textAlign: 'right',
//         marginTop: 4,
//     },
//     subscriptionSection: {
//         marginTop: 8,
//         gap: 16,
//     },
//     subscriptionHeader: {
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         gap: 8,
//         marginBottom: 8,
//     },
//     subscriptionSectionTitle: {
//         fontSize: 18,
//         fontFamily: 'Almarai-Bold',
//         color: '#1a1a1a',
//     },
//     durationToggle: {
//         flexDirection:  'row-reverse',
//         backgroundColor: '#f0f0f0',
//         borderRadius: 12,
//         padding: 4,
//         gap: 4,
//     },
//     durationButton: {
//         flex: 1,
//         paddingVertical: 10,
//         paddingHorizontal: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'relative',
//     },
//     durationButtonActive: {
//         backgroundColor: '#FF9800',
//     },
//     durationButtonText: {
//         fontSize: 13,
//         fontFamily: 'Almarai-Bold',
//         color: '#666',
//     },
//     durationButtonTextActive: {
//         color: '#fff',
//     },
//     saveBadge: {
//         position: 'absolute',
//         top: -6,
//         right: -6,
//         backgroundColor: '#4CAF50',
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 6,
//     },
//     saveBadgeText: {
//         fontSize: 9,
//         fontFamily: 'Almarai-Bold',
//         color: '#fff',
//     },
//     packagesContainer: {
//         gap:  12,
//     },
//     packageCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         borderWidth: 2,
//         position: 'relative',
//     },
//     packageCardSelected: {
//         borderWidth: 3,
//     },
//     popularBadge: {
//         position: 'absolute',
//         top: 12,
//         left: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//         zIndex: 1,
//     },
//     popularBadgeText: {
//         fontSize: 10,
//         fontFamily: 'Almarai-Bold',
//         color: '#fff',
//     },
//     packageContent: {
//         flexDirection: 'row-reverse',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     packageLeft: {
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         gap: 12,
//         flex: 1,
//     },
//     packageIcon: {
//         width: 56,
//         height: 56,
//         borderRadius: 28,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     packageInfo:  {
//         gap: 4,
//     },
//     packageName: {
//         fontSize: 18,
//         fontFamily: 'Almarai-Bold',
//         color: '#1a1a1a',
//         textAlign: 'right',
//     },
//     packageNameEn:  {
//         fontSize: 13,
//         fontFamily: 'Almarai-Regular',
//         color: '#666',
//         textAlign: 'right',
//     },
//     packageRight: {
//         alignItems: 'flex-end',
//     },
//     packagePriceAmount: {
//         fontSize:  28,
//         fontFamily: 'Almarai-Bold',
//     },
//     packagePricePeriod: {
//         fontSize: 12,
//         fontFamily: 'Almarai-Regular',
//         color: '#666',
//         marginTop: 2,
//     },
//     packageFeatures: {
//         gap: 8,
//     },
//     packageFeature: {
//         flexDirection: 'row-reverse',
//         alignItems: 'flex-start',
//         gap: 8,
//     },
//     packageFeatureText: {
//         flex: 1,
//         fontSize:  13,
//         fontFamily:  'Almarai-Regular',
//         color: '#333',
//         textAlign: 'right',
//         lineHeight: 20,
//     },
//     selectionIndicator: {
//         position: 'absolute',
//         bottom: 12,
//         right: 12,
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     checkboxContainer: {
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         gap: 12,
//         marginTop: 8,
//     },
//     checkbox:  {
//         width: 24,
//         height: 24,
//         borderWidth: 2,
//         borderColor: '#FF9800',
//         borderRadius:  6,
//         alignItems: 'center',
//         justifyContent:  'center',
//         backgroundColor: '#fff',
//     },
//     checkboxChecked: {
//         backgroundColor: '#FF9800',
//     },
//     policyText: {
//         flex: 1,
//         fontSize:  14,
//         fontFamily: 'Almarai-Regular',
//         color: '#555',
//         textAlign: 'right',
//     },
//     rememberMeText: {
//         flex: 1,
//         fontSize:  14,
//         fontFamily:  'Almarai-Regular',
//         color: '#333',
//         textAlign: 'right',
//     },
//     policyLink: {
//         color:  '#FF9800',
//         fontFamily: 'Almarai-Bold',
//         textDecorationLine: 'underline',
//     },
//     divider: {
//         height: 1,
//         backgroundColor:  '#e0e0e0',
//         marginVertical: 8,
//     },
//     orDivider: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 16,
//         gap: 12,
//     },
//     dividerLine: {
//         flex: 1,
//         height: 1,
//         backgroundColor: '#e0e0e0',
//     },
//     orText: {
//         fontSize: 14,
//         fontFamily: 'Almarai-Regular',
//         color: '#999',
//     },
//     buttonContainer: {
//         gap: 12,
//         marginTop: 8,
//     },
//     submitButton: {
//         backgroundColor: '#FF9800',
//         borderRadius: 12,
//         paddingVertical: 14,
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//     },
//     submitButtonText: {
//         fontSize: 16,
//         fontFamily: 'Almarai-Bold',
//         color: '#fff',
//     },
//     registerButton: {
//         backgroundColor: '#fff',
//         borderWidth: 2,
//         borderColor: '#FF9800',
//         borderRadius: 12,
//         paddingVertical: 14,
//         flexDirection: 'row-reverse',
//         alignItems:  'center',
//         justifyContent: 'center',
//         gap: 8,
//     },
//     registerButtonText: {
//         fontSize: 16,
//         fontFamily: 'Almarai-Bold',
//         color:  '#FF9800',
//     },
//     backButton: {
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#FF9800',
//         borderRadius:  12,
//         paddingVertical:  14,
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//     },
//     backButtonText: {
//         fontSize: 14,
//         fontFamily: 'Almarai-Bold',
//         color: '#FF9800',
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContentBottom: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         padding: 20,
//         maxHeight: '70%',
//     },
//     modalHandle: {
//         width: 40,
//         height: 4,
//         backgroundColor: '#ddd',
//         borderRadius: 2,
//         alignSelf: 'center',
//         marginBottom: 16,
//     },
//     modalTitle: {
//         fontSize:  18,
//         fontFamily:  'Almarai-Bold',
//         color: '#1a1a1a',
//         textAlign: 'center',
//         marginBottom: 16,
//     },
//     menuItem: {
//         flexDirection: 'row-reverse',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical:  12,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     menuItemText: {
//         fontSize: 16,
//         fontFamily: 'Almarai-Regular',
//         color: '#333',
//         textAlign: 'right',
//         flex: 1,
//     },
// });

import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

type ProfileBannerProps = {
  profileImage?: string;
  name: string;
  jobTitle: string;
  area: string;
  mobile: string;
  email: string;

  subscriptionPackage?: string;
  subscriptionDuration?: 'monthly' | 'quarterly';
  subscriptionPrice?: number;
  subscriptionStart?: string;
  subscriptionEnd?: string;

  onEditPress?: () => void;
  onLock?: () => void;
};

export default function ProfileBanner({
  profileImage,
  name,
  jobTitle,
  area,
  mobile,
  email,
  subscriptionPackage,
  subscriptionDuration,
  subscriptionPrice,
  subscriptionStart,
  subscriptionEnd,
  onEditPress,
  onLock,
}: ProfileBannerProps) {
  const [locked, setLocked] = useState(false);

  const lockOnce = () => {
    if (locked) return;
    setLocked(true);
    onLock?.();
  };

  return (
    <View style={styles.container} onTouchStart={lockOnce}>
      <View style={styles.backgroundDecoration} />

      <View style={styles.content}>
        {/* الصورة + زر التعديل */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialCommunityIcons name="account" size={60} color="#2b992dff" />
              </View>
            )}
            <View style={styles.onlineIndicator} />
          </View>

          {onEditPress && (
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* الاسم + الوظيفة */}
        <View style={styles.infoSection}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{name}</Text>

            <View style={styles.jobTitleContainer}>
              <MaterialCommunityIcons name="briefcase-outline" size={16} color="#2b992dff" />
              <Text style={styles.jobTitle}>{jobTitle}</Text>
            </View>
          </View>

          {/* معلومات التواصل */}
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2b992dff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>المنطقة</Text>
                <Text style={styles.contactValue}>{area}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`tel:${mobile}`)}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="phone" size={20} color="#2b992dff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>الجوال</Text>
                <Text style={styles.contactValue}>{mobile}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactItem, styles.contactItemFull]}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#2b992dff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
                <Text numberOfLines={1} style={[styles.contactValue, styles.emailText]}>
                  {email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* بطاقة الاشتراك */}
          {subscriptionPackage && (
            <View style={styles.subscriptionCard}>
              <MaterialCommunityIcons name="crown" size={20} color="#FF9800" />

              <View style={{ flex: 1 }}>
                <Text style={styles.subTitle}>باقة الاشتراك</Text>

                <Text style={styles.subValue}>{subscriptionPackage}</Text>

                <Text style={styles.subRow}>
                  المدة: {subscriptionDuration === 'monthly' ? 'شهري' : 'ربع سنوي'}
                </Text>

                <Text style={styles.subRow}>السعر: ${subscriptionPrice}</Text>

                <Text style={styles.subRow}>تاريخ البدء: {subscriptionStart?.slice(0, 10)}</Text>

                <Text style={styles.subRow}>تاريخ الانتهاء: {subscriptionEnd?.slice(0, 10)}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     marginHorizontal: 16,
//     marginVertical: 12,
//     overflow: 'hidden',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },

//   backgroundDecoration: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 100,
//     backgroundColor: '#2b992dff',
//     borderRadius: 20,
//   },

//   content: { padding: 20 },

//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 20,
//     position: 'relative',
//   },

//   imageContainer: { position: 'relative' },

//   profileImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     borderWidth: 5,
//     borderColor: '#fff',
//   },

//   placeholderImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: '#f2fe75ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 5,
//     borderColor: '#fff',
//   },

//   onlineIndicator: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#4CAF50',
//     borderWidth: 3,
//     borderColor: '#fff',
//   },

//   editButton: {
//     position: 'absolute',
//     top: 0,
//     right: '30%',
//     backgroundColor: '#2b992dff',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: { elevation: 4 },
//     }),
//   },

//   infoSection: { gap: 16 },

//   headerInfo: {
//     alignItems: 'center',
//     gap: 8,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },

//   name: {
//     fontSize: 22,
//     fontFamily: 'Almarai-Bold',
//     color: '#1a1a1a',
//     textAlign: 'center',
//   },

//   jobTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: '#f2fe75ff',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   jobTitle: {
//     fontSize: 15,
//     fontFamily: 'Almarai-Bold',
//     color: '#2b992dff',
//   },

//   contactGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 8,
//   },

//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 12,
//     borderRadius: 12,
//     flex: 1,
//     minWidth: '45%',
//     gap: 10,
//   },

//   contactItemFull: { minWidth: '100%' },

//   iconWrapper: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#2b992dff',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: { elevation: 2 },
//     }),
//   },

//   contactTextContainer: { flex: 1, gap: 2 },

//   contactLabel: {
//     fontSize: 11,
//     color: '#888',
//     fontFamily: 'Almarai-Regular',
//   },

//   contactValue: {
//     fontSize: 14,
//     color: '#1a1a1a',
//     fontFamily: 'Almarai-Bold',
//   },

//   emailText: { fontSize: 13 },

//   /* بطاقة الاشتراك */
//   subscriptionCard: {
//     flexDirection: 'row-reverse',
//     gap: 10,
//     backgroundColor: '#fff8e6',
//     borderRadius: 14,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#FFE0B2',
//     marginTop: 4,
//   },

//   subTitle: {
//     fontFamily: 'Almarai-Bold',
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'right',
//   },

//   subValue: {
//     fontFamily: 'Almarai-Bold',
//     fontSize: 16,
//     color: '#FF9800',
//     textAlign: 'right',
//     marginBottom: 4,
//   },

//   subRow: {
//     fontFamily: 'Almarai-Regular',
//     fontSize: 13,
//     color: '#444',
//     textAlign: 'right',
//   },
// });
