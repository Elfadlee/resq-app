// // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import * as React from 'react';
// // import { useRef, useState } from 'react';
// // import {
// //     Alert,
// //     FlatList,
// //     Keyboard,
// //     Modal,
// //     Platform,
// //     ScrollView,
// //     StyleSheet,
// //     Text,
// //     TextInput as RNTextInput,
// //     TouchableOpacity,
// //     View,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // type RegistrationScreenProps = {
// //     initialData?: any;
// //     isSocialSignup?: boolean;   // 👈 جديد
// //     onNext: (data: any) => void;
// //     onBackToLogin: () => void;
// // };

// // const JOBS = [
// //     'كهربائي',
// //     'سباك',
// //     'نجار',
// //     'دهان',
// //     'بناء',
// //     'ميكانيكي',
// //     'خياط',
// //     'حداد',
// //     'نقاش',
// //     'مبرمج',
// // ];

// // const AREAS = [
// //     'بغداد',
// //     'البصرة',
// //     'النجف',
// //     'كربلاء',
// //     'أربيل',
// //     'السليمانية',
// //     'الموصل',
// //     'ديالى',
// //     'الأنبار',
// //     'ذي قار',
// // ];

// // const convertArabicToEnglish = (text: string): string => {
// //     const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
// //     const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// //     let converted = text;
// //     arabicNumbers.forEach((arabic, index) => {
// //         converted = converted.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
// //     });

// //     return converted;
// // };

// // const formatMobileDisplay = (mobile: string): string => {
// //   return mobile; // بدون تنسيق — نعرضه كما كُتب
// // };


// // export default function RegistrationScreen({
// //     initialData,
// //     isSocialSignup,
// //     onNext,
// //     onBackToLogin,
// // }: RegistrationScreenProps) {


// //     const [mobile, setMobile] = useState(initialData?.mobile?.replace('+964', '') || '');
// //     const [email, setEmail] = useState(initialData?.email || '');
// //     const [description, setDescription] = useState(initialData?.description || '');
// //     const [password, setPassword] = useState('');
// //     const [confirmPassword, setConfirmPassword] = useState('');
// //     const [showPassword, setShowPassword] = useState(false);
// //     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //     const [name, setName] = useState(initialData?.name || '');


// //     const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
// //     const [area, setArea] = useState(initialData?.area || '');
// //     const [jobMenuVisible, setJobMenuVisible] = useState(false);
// //     const [areaMenuVisible, setAreaMenuVisible] = useState(false);

// //     const [focusedField, setFocusedField] = useState<string | null>(null);

// //     const mobileInputRef = useRef<RNTextInput>(null);

// //     const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

// //     React.useEffect(() => {
// //         if (!initialData) return;

// //         setName(initialData.name || name || "");   // ← يعبّي الاسم إذا وصل
// //         setEmail(initialData.email || "");
// //         setMobile(initialData.mobile?.replace("+964", "") || "");
// //         setJobTitle(initialData.jobTitle || "");
// //         setArea(initialData.area || "");
// //         setDescription(initialData.description || "");
// //     }, [initialData]);



// //     const handleMobileChange = (text: string) => {
// //         const convertedText = convertArabicToEnglish(text);
// //         const digitsOnly = convertedText.replace(/[^0-9]/g, '');
// //         const limited = digitsOnly.slice(0, 10);
// //         setMobile(limited);
// //     };

// //     const handlePasswordChange = (text: string) => {
// //         setPassword(text);
// //     };

// //     const handleConfirmPasswordChange = (text: string) => {
// //         setConfirmPassword(text);
// //     };


// //     const getDisplayMobile = (): string => {
// //         return formatMobileDisplay(mobile);
// //     };

// //     const getDisplayPassword = (pwd: string, show: boolean): string => {
// //         if (show) {
// //             return pwd;
// //         }
// //         return '•'.repeat(pwd.length);
// //     };

// //     const handleNext = async () => {
// //         Keyboard.dismiss();

// //         if (!name.trim()) {
// //             Alert.alert('خطأ', 'يرجى إدخال الاسم');
// //             return;
// //         }
// //         if (!jobTitle) {
// //             Alert.alert('خطأ', 'يرجى اختيار المهنة');
// //             return;
// //         }
// //         if (!area) {
// //             Alert.alert('خطأ', 'يرجى اختيار المنطقة');
// //             return;
// //         }
// //         if (!mobile.trim() || mobile.length < 10) {
// //             Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
// //             return;
// //         }
// //         if (!password.trim() || password.length < 8) {
// //             Alert.alert('خطأ', 'يرجى إدخال كلمة مرور لا تقل عن 8 أحرف');
// //             return;
// //         }
// //         if (password !== confirmPassword) {
// //             Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
// //             return;
// //         }
// //         if (!email.trim() || !email.includes('@')) {
// //             Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
// //             return;
// //         }
// //         if (wordCount > 120) {
// //             Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة.  الحد الأقصى 120 كلمة`);
// //             return;
// //         }

// //         const englishPassword = convertArabicToEnglish(password);
// //         const englishMobile = convertArabicToEnglish(mobile);
// //         const draftData = {
// //             name: name.trim(),
// //             jobTitle,
// //             area,
// //             mobile: '+964' + englishMobile,
// //             email: email.trim(),
// //             description: description.trim(),
// //             password: englishPassword,
// //         };

// //         try {
// //             await AsyncStorage.setItem(
// //                 'userRegistrationDraft',
// //                 JSON.stringify(draftData)
// //             );
// //         } catch (err) {
// //             console.log('Storage error', err);
// //         } finally {

// //             onNext({
// //                 ...draftData,
// //                 signupType: "manual"
// //             });
// //         }
// //     };

// //     return (
// //         <ScrollView
// //             style={styles.container}
// //             contentContainerStyle={styles.scrollContent}
// //             showsVerticalScrollIndicator={false}
// //             keyboardShouldPersistTaps="handled"
// //         >
// //             <View style={styles.formCard}>
// //                 <View style={styles.header}>
// //                     <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
// //                     <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
// //                 </View>

// //                 <View style={styles.form}>
// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>الاسم الكامل</Text>
// //                         <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
// //                             <RNTextInput
// //                                 value={name}
// //                                 onChangeText={setName}
// //                                 style={styles.input}
// //                                 textAlign="right"
// //                                 placeholder="أدخل الاسم الكامل"
// //                                 placeholderTextColor="#999"
// //                                 onFocus={() => setFocusedField('name')}
// //                                 onBlur={() => setFocusedField(null)}
// //                                 returnKeyType="next"
// //                             />
// //                             <MaterialCommunityIcons name="account" size={20} color="#FF9800" style={styles.icon} />
// //                         </View>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>المهنة</Text>
// //                         <TouchableOpacity
// //                             style={[styles.inputWrapper, focusedField === 'job' && styles.inputWrapperFocused]}
// //                             onPress={() => {
// //                                 Keyboard.dismiss();
// //                                 setJobMenuVisible(true);
// //                                 setFocusedField('job');
// //                             }}
// //                             activeOpacity={0.7}
// //                         >
// //                             <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
// //                                 {jobTitle || 'اختر المهنة'}
// //                             </Text>
// //                             <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" style={styles.icon} />
// //                         </TouchableOpacity>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>المنطقة</Text>
// //                         <TouchableOpacity
// //                             style={[styles.inputWrapper, focusedField === 'area' && styles.inputWrapperFocused]}
// //                             onPress={() => {
// //                                 Keyboard.dismiss();
// //                                 setAreaMenuVisible(true);
// //                                 setFocusedField('area');
// //                             }}
// //                             activeOpacity={0.7}
// //                         >
// //                             <Text style={[styles.dropdownText, !area && styles.placeholder]}>
// //                                 {area || 'اختر المنطقة'}
// //                             </Text>
// //                             <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" style={styles.icon} />
// //                         </TouchableOpacity>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>رقم الجوال</Text>
// //                         <View style={[styles.inputWrapper, focusedField === 'mobile' && styles.inputWrapperFocused]}>
// //                             <View style={styles.mobileInputContainer}>
// //                                 <RNTextInput
// //                                     ref={mobileInputRef}
// //                                     value={getDisplayMobile()}
// //                                     onChangeText={handleMobileChange}
// //                                     style={styles.mobileInput}
// //                                     textAlign="right"
// //                                     keyboardType="number-pad"
// //                                     placeholder="770 123 4567"
// //                                     placeholderTextColor="#999"
// //                                     onFocus={() => setFocusedField('mobile')}
// //                                     onBlur={() => setFocusedField(null)}
// //                                     returnKeyType="next"
// //                                 />
// //                                 <Text style={styles.mobilePrefix}>964+</Text>
// //                             </View>
// //                             <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
// //                         </View>
// //                         <Text style={styles.helperText}>
// //                             {mobile.length}/10 • استخدم الأرقام الإنجليزية أو العربية
// //                         </Text>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>البريد الإلكتروني</Text>
// //                         <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
// //                             <RNTextInput
// //                                 value={email}
// //                                 onChangeText={setEmail}
// //                                 style={styles.input}
// //                                 textAlign="right"
// //                                 keyboardType="email-address"
// //                                 autoCapitalize="none"
// //                                 placeholder="example@email.com"
// //                                 placeholderTextColor="#999"
// //                                 onFocus={() => setFocusedField('email')}
// //                                 onBlur={() => setFocusedField(null)}
// //                                 returnKeyType="next"
// //                                 editable={!isSocialSignup}
// //                             />
// //                             <MaterialCommunityIcons name="email" size={20} color="#FF9800" style={styles.icon} />
// //                         </View>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>كلمة المرور الجديدة</Text>
// //                         <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
// //                             <View style={styles.passwordInputContainer}>
// //                                 <TouchableOpacity
// //                                     onPress={() => setShowPassword(!showPassword)}
// //                                     style={styles.eyeIcon}
// //                                     activeOpacity={0.7}
// //                                 >
// //                                     <MaterialCommunityIcons
// //                                         name={showPassword ? 'eye-off' : 'eye'}
// //                                         size={20}
// //                                         color="#666"
// //                                     />
// //                                 </TouchableOpacity>
// //                                 <RNTextInput
// //                                     secureTextEntry={!showPassword}
// //                                     value={password}
// //                                     onChangeText={handlePasswordChange}
// //                                     style={styles.passwordInput}
// //                                     textAlign="right"
// //                                     keyboardType="default"
// //                                     placeholder="أدخل كلمة المرور (علي الاقل 8 احرف )"
// //                                     placeholderTextColor="#999"
// //                                     onFocus={() => setFocusedField('password')}
// //                                     onBlur={() => setFocusedField(null)}
// //                                     returnKeyType="next"
                                    
// //                                 />
// //                             </View>
// //                             <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
// //                         </View>
// //                         <Text style={styles.helperText}>
// //                             {password.length}/12 • استخدم 12 رقم فقط (عربي أو إنجليزي)
// //                         </Text>
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>تأكيد كلمة المرور</Text>
// //                         <View
// //                             style={[
// //                                 styles.inputWrapper,
// //                                 focusedField === 'confirmPassword' && styles.inputWrapperFocused,
// //                                 confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError,
// //                             ]}
// //                         >
// //                             <View style={styles.passwordInputContainer}>
// //                                 <TouchableOpacity
// //                                     onPress={() => setShowConfirmPassword(!showConfirmPassword)}
// //                                     style={styles.eyeIcon}
// //                                     activeOpacity={0.7}
// //                                 >
// //                                     <MaterialCommunityIcons
// //                                         name={showConfirmPassword ? 'eye-off' : 'eye'}
// //                                         size={20}
// //                                         color="#666"
// //                                     />
// //                                 </TouchableOpacity>
// //                                 <RNTextInput
// //                                     secureTextEntry={!showConfirmPassword}
// //                                     value={confirmPassword}

// //                                     onChangeText={handleConfirmPasswordChange}
// //                                     style={styles.passwordInput}
// //                                     textAlign="right"
// //                                     keyboardType="default"
// //                                     placeholder="أعد إدخال كلمة المرور"
// //                                     placeholderTextColor="#999"
// //                                     onFocus={() => setFocusedField('confirmPassword')}
// //                                     onBlur={() => setFocusedField(null)}
// //                                     returnKeyType="next"
                                    
// //                                 />
// //                             </View>
// //                             <MaterialCommunityIcons
// //                                 name={
// //                                     confirmPassword.length > 0 && password === confirmPassword
// //                                         ? 'check-circle'
// //                                         : 'lock-check'
// //                                 }
// //                                 size={20}
// //                                 color={confirmPassword.length > 0 && password === confirmPassword ? '#4CAF50' : '#FF9800'}
// //                                 style={styles.icon}
// //                             />
// //                         </View>
// //                         {confirmPassword.length > 0 && password !== confirmPassword && (
// //                             <Text style={styles.errorText}>كلمة المرور غير متطابقة</Text>
// //                         )}
// //                         {confirmPassword.length > 0 && password === confirmPassword && (
// //                             <Text style={styles.successText}>✓ كلمة المرور متطابقة</Text>
// //                         )}
// //                     </View>

// //                     <View style={styles.inputContainer}>
// //                         <Text style={styles.label}>الوصف</Text>
// //                         <View
// //                             style={[
// //                                 styles.inputWrapper,
// //                                 styles.textAreaWrapper,
// //                                 focusedField === 'description' && styles.inputWrapperFocused,
// //                             ]}
// //                         >
// //                             <RNTextInput
// //                                 value={description}
// //                                 onChangeText={setDescription}
// //                                 style={[styles.input, styles.textArea]}
// //                                 textAlign="right"
// //                                 multiline
// //                                 numberOfLines={4}
// //                                 placeholder="اكتب وصف مختصر عن خدماتك..."
// //                                 placeholderTextColor="#999"
// //                                 onFocus={() => setFocusedField('description')}
// //                                 onBlur={() => setFocusedField(null)}
// //                                 returnKeyType="done"
// //                             />
// //                             <MaterialCommunityIcons
// //                                 name="text"
// //                                 size={20}
// //                                 color="#FF9800"
// //                                 style={[styles.icon, styles.textAreaIcon]}
// //                             />
// //                         </View>
// //                         <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
// //                             {wordCount} / 120 كلمة {wordCount > 120 && '(تجاوز الحد الأقصى)'}
// //                         </Text>
// //                     </View>

// //                     <View style={styles.divider} />

// //                     <View style={styles.buttonContainer}>
// //                         <TouchableOpacity style={styles.submitButton} onPress={handleNext} activeOpacity={0.8}>
// //                             <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
// //                             <Text style={styles.submitButtonText}>التالي - اختيار الباقة</Text>
// //                         </TouchableOpacity>

// //                         <TouchableOpacity style={styles.backButton} onPress={onBackToLogin} activeOpacity={0.8}>
// //                             <MaterialCommunityIcons name="arrow-right" size={20} color="#FF9800" />
// //                             <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                 </View>
// //             </View>

// //             <Modal
// //                 visible={jobMenuVisible}
// //                 transparent
// //                 animationType="slide"
// //                 onRequestClose={() => {
// //                     setJobMenuVisible(false);
// //                     setFocusedField(null);
// //                 }}
// //             >
// //                 <TouchableOpacity
// //                     style={styles.modalOverlay}
// //                     activeOpacity={1}
// //                     onPress={() => {
// //                         setJobMenuVisible(false);
// //                         setFocusedField(null);
// //                     }}
// //                 >
// //                     <View style={styles.modalContentBottom}>
// //                         <View style={styles.modalHandle} />
// //                         <Text style={styles.modalTitle}>اختر المهنة</Text>
// //                         <FlatList
// //                             data={JOBS}
// //                             keyExtractor={(item) => item}
// //                             renderItem={({ item }) => (
// //                                 <TouchableOpacity
// //                                     style={styles.menuItem}
// //                                     onPress={() => {
// //                                         setJobTitle(item);
// //                                         setJobMenuVisible(false);
// //                                         setFocusedField(null);
// //                                     }}
// //                                     activeOpacity={0.7}
// //                                 >
// //                                     <Text style={styles.menuItemText}>{item}</Text>
// //                                     {jobTitle === item && (
// //                                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
// //                                     )}
// //                                 </TouchableOpacity>
// //                             )}
// //                         />
// //                     </View>
// //                 </TouchableOpacity>
// //             </Modal>

// //             <Modal
// //                 visible={areaMenuVisible}
// //                 transparent
// //                 animationType="slide"
// //                 onRequestClose={() => {
// //                     setAreaMenuVisible(false);
// //                     setFocusedField(null);
// //                 }}
// //             >
// //                 <TouchableOpacity
// //                     style={styles.modalOverlay}
// //                     activeOpacity={1}
// //                     onPress={() => {
// //                         setAreaMenuVisible(false);
// //                         setFocusedField(null);
// //                     }}
// //                 >
// //                     <View style={styles.modalContentBottom}>
// //                         <View style={styles.modalHandle} />
// //                         <Text style={styles.modalTitle}>اختر المنطقة</Text>
// //                         <FlatList
// //                             data={AREAS}
// //                             keyExtractor={(item) => item}
// //                             renderItem={({ item }) => (
// //                                 <TouchableOpacity
// //                                     style={styles.menuItem}
// //                                     onPress={() => {
// //                                         setArea(item);
// //                                         setAreaMenuVisible(false);
// //                                         setFocusedField(null);
// //                                     }}
// //                                     activeOpacity={0.7}
// //                                 >
// //                                     <Text style={styles.menuItemText}>{item}</Text>
// //                                     {area === item && (
// //                                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
// //                                     )}
// //                                 </TouchableOpacity>
// //                             )}
// //                         />
// //                     </View>
// //                 </TouchableOpacity>
// //             </Modal>
// //         </ScrollView>
// //     );
// // }






// // // csc style

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#f5f5f5',
// //     },
// //     scrollContent: {
// //         flexGrow: 1,
// //         paddingBottom: 32,
// //     },
// //     formCard: {
// //         margin: 16,
// //         borderRadius: 20,
// //         backgroundColor: '#fff',
// //         padding: 24,
// //         ...Platform.select({
// //             ios: {
// //                 shadowColor: '#000',
// //                 shadowOffset: { width: 0, height: 4 },
// //                 shadowOpacity: 0.1,
// //                 shadowRadius: 12,
// //             },
// //             android: {
// //                 elevation: 4,
// //             },
// //         }),
// //     },
// //     header: {
// //         alignItems: 'center',
// //         marginBottom: 24,
// //         gap: 12,
// //     },
// //     headerTitle: {
// //         fontSize: 18,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#1a1a1a',
// //         textAlign: 'center',
// //     },
// //     form: {
// //         gap: 16,
// //     },
// //     inputContainer: {
// //         gap: 8,
// //     },
// //     label: {
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#333',
// //         textAlign: 'right',
// //     },
// //     inputWrapper: {
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //         borderWidth: 1,
// //         borderColor: '#e0e0e0',
// //         borderRadius: 12,
// //         backgroundColor: '#fff',
// //         paddingHorizontal: 12,
// //         minHeight: 56,
// //     },
// //     inputWrapperFocused: {
// //         borderColor: '#FF9800',
// //         borderWidth: 2,
// //     },
// //     inputWrapperError: {
// //         borderColor: '#f44336',
// //         borderWidth: 2,
// //     },
// //     input: {
// //         flex: 1,
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#1a1a1a',
// //         paddingVertical: 12,
// //         textAlign: 'right',
// //     },
// //     icon: {
// //         marginLeft: 8,
// //     },
// //     mobileInputContainer: {
// //         flex: 1,
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //     },
// //     mobileInput: {
// //         flex: 1,
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#1a1a1a',
// //         paddingVertical: 12,
// //         textAlign: 'right',
// //     },
// //     mobilePrefix: {
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#666',
// //         marginRight: 8,
// //     },
// //     passwordInputContainer: {
// //         flex: 1,
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //     },
// //     passwordInput: {
// //         flex: 1,
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#1a1a1a',
// //         paddingVertical: 12,
// //         textAlign: 'right',
// //         letterSpacing: 2,
// //     },
// //     eyeIcon: {
// //         padding: 8,
// //         marginLeft: 4,
// //     },
// //     dropdownText: {
// //         flex: 1,
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#1a1a1a',
// //         textAlign: 'right',
// //     },
// //     placeholder: {
// //         color: '#999',
// //     },
// //     helperText: {
// //         fontSize: 12,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#666',
// //         textAlign: 'right',
// //         marginTop: 4,
// //     },
// //     errorText: {
// //         fontSize: 12,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#f44336',
// //         textAlign: 'right',
// //         marginTop: 4,
// //     },
// //     successText: {
// //         fontSize: 12,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#4CAF50',
// //         textAlign: 'right',
// //         marginTop: 4,
// //     },
// //     textAreaWrapper: {
// //         alignItems: 'flex-start',
// //         minHeight: 100,
// //     },
// //     textArea: {
// //         minHeight: 80,
// //         paddingTop: 12,
// //     },
// //     textAreaIcon: {
// //         alignSelf: 'flex-start',
// //         marginTop: 12,
// //     },
// //     wordCount: {
// //         fontSize: 12,
// //         fontFamily: 'Almarai-Regular',
// //         textAlign: 'right',
// //         marginTop: 4,
// //     },
// //     divider: {
// //         height: 1,
// //         backgroundColor: '#e0e0e0',
// //         marginVertical: 8,
// //     },
// //     buttonContainer: {
// //         gap: 12,
// //         marginTop: 8,
// //     },
// //     submitButton: {
// //         backgroundColor: '#FF9800',
// //         borderRadius: 12,
// //         paddingVertical: 14,
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: 8,
// //     },
// //     submitButtonText: {
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#fff',
// //     },
// //     backButton: {
// //         backgroundColor: '#fff',
// //         borderWidth: 1,
// //         borderColor: '#FF9800',
// //         borderRadius: 12,
// //         paddingVertical: 14,
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: 8,
// //     },
// //     backButtonText: {
// //         fontSize: 14,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#FF9800',
// //     },
// //     modalOverlay: {
// //         flex: 1,
// //         backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //         justifyContent: 'flex-end',
// //     },
// //     modalContentBottom: {
// //         backgroundColor: '#fff',
// //         borderTopLeftRadius: 24,
// //         borderTopRightRadius: 24,
// //         padding: 20,
// //         maxHeight: '70%',
// //     },
// //     modalHandle: {
// //         width: 40,
// //         height: 4,
// //         backgroundColor: '#ddd',
// //         borderRadius: 2,
// //         alignSelf: 'center',
// //         marginBottom: 16,
// //     },
// //     modalTitle: {
// //         fontSize: 18,
// //         fontFamily: 'Almarai-Bold',
// //         color: '#1a1a1a',
// //         textAlign: 'center',
// //         marginBottom: 16,
// //     },
// //     menuItem: {
// //         flexDirection: 'row-reverse',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingVertical: 12,
// //         paddingHorizontal: 16,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#f0f0f0',
// //     },
// //     menuItemText: {
// //         fontSize: 16,
// //         fontFamily: 'Almarai-Regular',
// //         color: '#333',
// //         textAlign: 'right',
// //         flex: 1,
// //     },
// // });
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as React from 'react';
// import { useRef, useState, useEffect } from 'react';
// import {
//     Alert,
//     FlatList,
//     Keyboard,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput as RNTextInput,
//     TouchableOpacity,
//     View,
//     ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // 👇 استيراد Firestore
// import { db } from '../services/firestore';
// import { collection, query, where, getDocs } from 'firebase/firestore';

// type RegistrationScreenProps = {
//     initialData?: any;
//     isSocialSignup?: boolean;
//     onNext: (data: any) => void;
//     onBackToLogin: () => void;
// };

// const JOBS = [
//     'كهربائي','سباك','نجار','دهان','بناء',
//     'ميكانيكي','خياط','حداد','نقاش','مبرمج',
// ];
// const AREAS = [
//     'بغداد', 'البصرة', 'النجف', 'كربلاء', 'أربيل',
//     'السليمانية', 'الموصل', 'ديالى', 'الأنبار', 'ذي قار',
// ];

// const convertArabicToEnglish = (text: string): string => {
//     const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
//     const englishNumbers = ['0','1','2','3','4','5','6','7','8','9'];
//     let converted = text;
//     arabicNumbers.forEach((a, i) => {
//         converted = converted.replace(new RegExp(a, 'g'), englishNumbers[i]);
//     });
//     return converted;
// };

// // فحص الباسورد انجليزي فقط
// const isEnglishPassword = (text: string): boolean => {
//     return /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]*$/.test(text);
// };
// // فحص الجوال أرقام إنجليزية فقط
// const isEnglishNumbers = (text: string): boolean => {
//     return /^[0-9]*$/.test(text);
// };

// export default function RegistrationScreen({
//     initialData,
//     isSocialSignup,
//     onNext,
//     onBackToLogin,
// }: RegistrationScreenProps) {
//     const [mobile, setMobile] = useState(initialData?.mobile?.replace('+964', '') || '');
//     const [email, setEmail] = useState(initialData?.email || '');
//     const [description, setDescription] = useState(initialData?.description || '');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [name, setName] = useState(initialData?.name || '');
//     const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
//     const [area, setArea] = useState(initialData?.area || '');
//     const [jobMenuVisible, setJobMenuVisible] = useState(false);
//     const [areaMenuVisible, setAreaMenuVisible] = useState(false);
//     const [focusedField, setFocusedField] = useState<string | null>(null);

//     // للتحقق من التكرار
//     const [checkingDuplicate, setCheckingDuplicate] = useState(false);
//     const [duplicateError, setDuplicateError] = useState<string | null>(null);
//     const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);
//     const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

//     // تحذيرات اللغة
//     const [passwordLangError, setPasswordLangError] = useState<string | null>(null);
//     const [mobileLangError, setMobileLangError] = useState<string | null>(null);

//     const mobileInputRef = useRef<RNTextInput>(null);
//     const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

//     // حفظ جميع حقول البيانات عند وصول initialData
//     useEffect(() => {
//         if (!initialData) return;
//         setName(initialData.name || name || "");
//         setEmail(initialData.email || "");
//         setMobile(initialData.mobile?.replace("+964", "") || "");
//         setJobTitle(initialData.jobTitle || "");
//         setArea(initialData.area || "");
//         setDescription(initialData.description || "");
//     }, [initialData]);

//     // التحقق من عدم تكرار الجوال أو الإيميل في قاعدة البيانات
//     useEffect(() => {
//         const checkForDuplicates = async () => {
//             setCheckingDuplicate(true);
//             let foundMobile: string | null = null;
//             let foundEmail: string | null = null;
//             let errorMsg = "";

//             // تحقق الجوال
//             if (mobile && mobile.length === 10) {
//                 const mobQuery = query(
//                     collection(db, 'users'),
//                     where('mobile', '==', '+964' + convertArabicToEnglish(mobile))
//                 );
//                 const mobSnap = await getDocs(mobQuery);
//                 if (!mobSnap.empty) {
//                     foundMobile = '+964' + convertArabicToEnglish(mobile);
//                     errorMsg += `رقم الجوال مستخدم سابقاً: ${foundMobile}\n`;
//                 }
//             }
//             // تحقق الإيميل
//             if (email && email.includes('@')) {
//                 const emQuery = query(
//                     collection(db, 'users'),
//                     where('email', '==', email.trim())
//                 );
//                 const emSnap = await getDocs(emQuery);
//                 if (!emSnap.empty) {
//                     foundEmail = email.trim();
//                     errorMsg += `البريد الإلكتروني مستخدم سابقاً: ${foundEmail}\n`;
//                 }
//             }
//             setDuplicateMobile(foundMobile);
//             setDuplicateEmail(foundEmail);
//             setDuplicateError(errorMsg ? errorMsg.trim() : null);
//             setCheckingDuplicate(false);
//         };

//         if ((mobile && mobile.length === 10) || (email && email.includes('@') && email.trim().length > 0)) {
//             checkForDuplicates();
//         } else {
//             setDuplicateError(null);
//             setDuplicateMobile(null);
//             setDuplicateEmail(null);
//         }
//     }, [mobile, email]);

//     // الجوال: يمنع إلا إنجليزي، لايحوله
//     const handleMobileChange = (text: string) => {
//         if (!isEnglishNumbers(text)) {
//             setMobileLangError('يرجى إدخال الأرقام بالإنجليزية فقط');
//         } else {
//             setMobileLangError(null);
//         }
//         setMobile(text.replace(/[^0-9]/g, '').slice(0, 10));
//     };
//     // الباسورد: يمنع إلا انجليزي وارقام انجليزي
//     const handlePasswordChange = (text: string) => {
//         if (!isEnglishPassword(text)) {
//             setPasswordLangError('يرجى استخدام الحروف والأرقام الإنجليزية فقط');
//         } else {
//             setPasswordLangError(null);
//         }
//         setPassword(text);
//     };
//     const handleConfirmPasswordChange = (text: string) => setConfirmPassword(text);

//     const handleNext = async () => {
//         Keyboard.dismiss();
//         if (duplicateError) {
//             Alert.alert('خطأ', duplicateError); return;
//         }
//         if (!name.trim())      { Alert.alert('خطأ', 'يرجى إدخال الاسم'); return; }
//         if (!jobTitle)         { Alert.alert('خطأ', 'يرجى اختيار المهنة'); return; }
//         if (!area)             { Alert.alert('خطأ', 'يرجى اختيار المنطقة'); return; }
//         if (!isEnglishNumbers(mobile) || mobileLangError) {
//             Alert.alert('خطأ', 'يرجى إدخال رقم الجوال بالأرقام الإنجليزية فقط');
//             return;
//         }
//         if (!mobile.trim() || mobile.length < 10) {
//             Alert.alert('خطأ', 'يرجى إدخال رقم جوال صحيح (10 أرقام)');
//             return;
//         }
//         if (!isEnglishPassword(password) || passwordLangError) {
//             Alert.alert('خطأ', 'يرجى إدخال كلمة المرور بالحروف والأرقام الإنجليزية فقط');
//             return;
//         }
//         if (!password.trim() || password.length < 8) {
//             Alert.alert('خطأ', 'يرجى إدخال كلمة مرور لا تقل عن 8 أحرف');
//             return;
//         }
//         if (password !== confirmPassword) {
//             Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
//             return;
//         }
//         if (!email.trim() || !email.includes('@')) {
//             Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
//             return;
//         }
//         if (wordCount > 120) {
//             Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة.  الحد الأقصى 120 كلمة`);
//             return;
//         }

//         const englishPassword = password; // المستخدم مطلوب يكتب انجليزي فقط (لا تحويل)
//         const englishMobile  = mobile;
//         const draftData = {
//             name: name.trim(),
//             jobTitle,
//             area,
//             mobile: '+964' + englishMobile,
//             email: email.trim(),
//             description: description.trim(),
//             password: englishPassword,
//         };
//         try {
//             await AsyncStorage.setItem('userRegistrationDraft', JSON.stringify(draftData));
//         } catch (err) {
//             console.log('Storage error', err);
//         } finally {
//             onNext({ ...draftData, signupType: "manual" });
//         }
//     };

//     return (
//     <ScrollView style={styles.container}
//       contentContainerStyle={styles.scrollContent}
//       showsVerticalScrollIndicator={false}
//       keyboardShouldPersistTaps="handled">
//       <View style={styles.formCard}>
//         <View style={styles.header}>
//           <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
//           <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
//         </View>

//         {/* عرض رسالة خطأ التكرار أو تحميل التحقق */}
//         {checkingDuplicate && (
//           <View style={{ alignItems: 'center', marginVertical: 8 }}>
//             <ActivityIndicator color="#FF9800" />
//             <Text style={{ color: '#FF9800', fontSize: 15 }}>جاري التحـقق من البيانات ...</Text>
//           </View>
//         )}
//         {duplicateError && (
//           <View style={{ backgroundColor: '#fff5f2', borderWidth: 1, borderColor: '#ffc1a1', padding: 8, marginVertical: 8, borderRadius: 8 }}>
//             <Text style={{ color: '#e53935', textAlign: 'center', fontSize: 16 }}>
//               {duplicateError}
//             </Text>
//           </View>
//         )}

//         <View style={styles.form}>
//         {/* الاسم الكامل */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>الاسم الكامل</Text>
//             <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
//                 <RNTextInput
//                     value={name}
//                     onChangeText={setName}
//                     style={styles.input}
//                     textAlign="right"
//                     placeholder="أدخل الاسم الكامل"
//                     placeholderTextColor="#999"
//                     onFocus={() => setFocusedField('name')}
//                     onBlur={() => setFocusedField(null)}
//                     returnKeyType="next"
//                 />
//                 <MaterialCommunityIcons name="account" size={20} color="#FF9800" style={styles.icon} />
//             </View>
//         </View>
//         {/* المهنة */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>المهنة</Text>
//             <TouchableOpacity
//             style={[styles.inputWrapper, focusedField === 'job' && styles.inputWrapperFocused]}
//             onPress={() => { Keyboard.dismiss(); setJobMenuVisible(true); setFocusedField('job'); }}
//             activeOpacity={0.7}>
//                 <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
//                     {jobTitle || 'اختر المهنة'}
//                 </Text>
//                 <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" style={styles.icon} />
//             </TouchableOpacity>
//         </View>
//         {/* المنطقة */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>المنطقة</Text>
//             <TouchableOpacity
//             style={[styles.inputWrapper, focusedField === 'area' && styles.inputWrapperFocused]}
//             onPress={() => { Keyboard.dismiss(); setAreaMenuVisible(true); setFocusedField('area'); }}
//             activeOpacity={0.7}>
//                 <Text style={[styles.dropdownText, !area && styles.placeholder]}>
//                     {area || 'اختر المنطقة'}
//                 </Text>
//                 <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" style={styles.icon} />
//             </TouchableOpacity>
//         </View>
//         {/* رقم الجوال */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>رقم الجوال</Text>
//             <View style={[
//                 styles.inputWrapper,
//                 focusedField === 'mobile' && styles.inputWrapperFocused,
//                 mobileLangError && styles.inputWrapperError,
//             ]}>
//                 <View style={styles.mobileInputContainer}>
//                     <RNTextInput
//                         ref={mobileInputRef}
//                         value={mobile}
//                         onChangeText={handleMobileChange}
//                         style={styles.mobileInput}
//                         textAlign="right"
//                         keyboardType="number-pad"
//                         placeholder="770 123 4567"
//                         placeholderTextColor="#999"
//                         onFocus={() => setFocusedField('mobile')}
//                         onBlur={() => setFocusedField(null)}
//                         returnKeyType="next"
//                     />
//                     <Text style={styles.mobilePrefix}>+964</Text>
//                 </View>
//                 <MaterialCommunityIcons name="phone" size={20} color="#FF9800" style={styles.icon} />
//             </View>
//             <Text style={styles.helperText}>
//                 يرجى إدخال الأرقام الإنجليزية فقط
//             </Text>
//             {mobileLangError && (
//                 <Text style={styles.errorText}>{mobileLangError}</Text>
//             )}
//             {duplicateMobile && (
//                 <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
//                     {duplicateMobile} 
//                     {"\n"}
//                  رقم الجوال لديه حساب مستخدم مسبقاً يرجي الدخول الي الحساب الخاص بك 
//                 </Text>
//             )}
//         </View>
//         {/* البريد الإلكتروني */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>البريد الإلكتروني</Text>
//             <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
//                 <RNTextInput
//                     value={email}
//                     onChangeText={setEmail}
//                     style={styles.input}
//                     textAlign="right"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     placeholder="example@email.com"
//                     placeholderTextColor="#999"
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField(null)}
//                     returnKeyType="next"
//                     editable={!isSocialSignup}
//                 />
//                 <MaterialCommunityIcons name="email" size={20} color="#FF9800" style={styles.icon} />
//             </View>
//             {duplicateEmail && (
//                 <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
//                          {duplicateEmail} 
//                     {"\n"}
//                  البريد الإلكتروني لديه حساب مستخدم مسبقاً يرجي الدخول الي الحساب الخاص بك 
//                 </Text>
//             )}
//         </View>
//         {/* كلمة المرور الجديدة */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>كلمة المرور الجديدة</Text>
//             <View style={[
//                 styles.inputWrapper,
//                 focusedField === 'password' && styles.inputWrapperFocused,
//                 passwordLangError && styles.inputWrapperError,
//             ]}>
//                 <View style={styles.passwordInputContainer}>
//                     <TouchableOpacity
//                         onPress={() => setShowPassword(!showPassword)}
//                         style={styles.eyeIcon}
//                         activeOpacity={0.7}
//                     >
//                         <MaterialCommunityIcons
//                             name={showPassword ? 'eye-off' : 'eye'}
//                             size={20}
//                             color="#666"
//                         />
//                     </TouchableOpacity>
//                     <RNTextInput
//                         secureTextEntry={!showPassword}
//                         value={password}
//                         onChangeText={handlePasswordChange}
//                         style={styles.passwordInput}
//                         textAlign="right"
//                         keyboardType="default"
//                         placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
//                         placeholderTextColor="#999"
//                         onFocus={() => setFocusedField('password')}
//                         onBlur={() => setFocusedField(null)}
//                         returnKeyType="next" />
//                 </View>
//                 <MaterialCommunityIcons name="lock" size={20} color="#FF9800" style={styles.icon} />
//             </View>
//             <Text style={styles.helperText}>
//                 يرجى استخدام الحروف والأرقام الإنجليزية فقط
//             </Text>
//             {passwordLangError && (
//                 <Text style={styles.errorText}>{passwordLangError}</Text>
//             )}
//         </View>
//         {/* تأكيد كلمة المرور */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>تأكيد كلمة المرور</Text>
//             <View
//                 style={[
//                     styles.inputWrapper,
//                     focusedField === 'confirmPassword' && styles.inputWrapperFocused,
//                     confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError,
//                 ]}
//             >
//                 <View style={styles.passwordInputContainer}>
//                     <TouchableOpacity
//                         onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                         style={styles.eyeIcon}
//                         activeOpacity={0.7}
//                     >
//                         <MaterialCommunityIcons
//                             name={showConfirmPassword ? 'eye-off' : 'eye'}
//                             size={20}
//                             color="#666"
//                         />
//                     </TouchableOpacity>
//                     <RNTextInput
//                         secureTextEntry={!showConfirmPassword}
//                         value={confirmPassword}
//                         onChangeText={handleConfirmPasswordChange}
//                         style={styles.passwordInput}
//                         textAlign="right"
//                         keyboardType="default"
//                         placeholder="أعد إدخال كلمة المرور"
//                         placeholderTextColor="#999"
//                         onFocus={() => setFocusedField('confirmPassword')}
//                         onBlur={() => setFocusedField(null)}
//                         returnKeyType="next" />
//                 </View>
//                 <MaterialCommunityIcons
//                     name={
//                         confirmPassword.length > 0 && password === confirmPassword
//                             ? 'check-circle'
//                             : 'lock-check'
//                     }
//                     size={20}
//                     color={confirmPassword.length > 0 && password === confirmPassword ? '#4CAF50' : '#FF9800'}
//                     style={styles.icon}
//                 />
//             </View>
//             {confirmPassword.length > 0 && password !== confirmPassword && (
//                 <Text style={styles.errorText}>كلمة المرور غير متطابقة</Text>
//             )}
//             {confirmPassword.length > 0 && password === confirmPassword && (
//                 <Text style={styles.successText}>✓ كلمة المرور متطابقة</Text>
//             )}
//         </View>
//         {/* الوصف */}
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>الوصف</Text>
//             <View style={[
//                 styles.inputWrapper,
//                 styles.textAreaWrapper,
//                 focusedField === 'description' && styles.inputWrapperFocused,
//             ]}>
//                 <RNTextInput
//                     value={description}
//                     onChangeText={setDescription}
//                     style={[styles.input, styles.textArea]}
//                     textAlign="right"
//                     multiline
//                     numberOfLines={4}
//                     placeholder="اكتب وصف مختصر عن خدماتك..."
//                     placeholderTextColor="#999"
//                     onFocus={() => setFocusedField('description')}
//                     onBlur={() => setFocusedField(null)}
//                     returnKeyType="done"
//                 />
//                 <MaterialCommunityIcons
//                     name="text"
//                     size={20}
//                     color="#FF9800"
//                     style={[styles.icon, styles.textAreaIcon]}
//                 />
//             </View>
//             <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
//                 {wordCount} / 120 كلمة {wordCount > 120 && '(تجاوز الحد الأقصى)'}
//             </Text>
//         </View>

//         <View style={styles.divider} />
//         <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.submitButton} onPress={handleNext} activeOpacity={0.8}
//                 disabled={!!duplicateError || !!passwordLangError || !!mobileLangError || checkingDuplicate}>
//                 <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
//                 <Text style={styles.submitButtonText}>التالي - اختيار الباقة</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.backButton} onPress={onBackToLogin} activeOpacity={0.8}>
//                 <MaterialCommunityIcons name="arrow-right" size={20} color="#FF9800" />
//                 <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
//             </TouchableOpacity>
//         </View>
//         </View>
//       </View>

//       {/* مودال الوظيفة */}
//       <Modal visible={jobMenuVisible} transparent animationType="slide"
//         onRequestClose={() => { setJobMenuVisible(false); setFocusedField(null); }}>
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}
//           onPress={() => { setJobMenuVisible(false); setFocusedField(null); }}>
//           <View style={styles.modalContentBottom}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>اختر المهنة</Text>
//             <FlatList data={JOBS} keyExtractor={item => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.menuItem}
//                     onPress={() => { setJobTitle(item); setJobMenuVisible(false); setFocusedField(null); }}
//                     activeOpacity={0.7}>
//                     <Text style={styles.menuItemText}>{item}</Text>
//                     {jobTitle === item && (
//                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                     )}
//                 </TouchableOpacity>
//               )} />
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* مودال المنطقة */}
//       <Modal visible={areaMenuVisible} transparent animationType="slide"
//         onRequestClose={() => { setAreaMenuVisible(false); setFocusedField(null); }}>
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}
//           onPress={() => { setAreaMenuVisible(false); setFocusedField(null); }}>
//           <View style={styles.modalContentBottom}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>اختر المنطقة</Text>
//             <FlatList data={AREAS} keyExtractor={item => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.menuItem}
//                     onPress={() => { setArea(item); setAreaMenuVisible(false); setFocusedField(null); }}
//                     activeOpacity={0.7}>
//                     <Text style={styles.menuItemText}>{item}</Text>
//                     {area === item && (
//                         <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                     )}
//                 </TouchableOpacity>
//               )} />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f5f5f5' },
//     scrollContent: { flexGrow: 1, paddingBottom: 32 },
//     formCard: {
//         margin: 16, borderRadius: 20, backgroundColor: '#fff', padding: 24,
//         ...Platform.select({
//             ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
//             android: { elevation: 4 },
//         }),
//     },
//     header: { alignItems: 'center', marginBottom: 24, gap: 12 },
//     headerTitle: {
//         fontSize: 18, fontFamily: 'Almarai-Bold', color: '#1a1a1a', textAlign: 'center',
//     },
//     form: { gap: 16 },
//     inputContainer: { gap: 8 },
//     label: {
//         fontSize: 14, fontFamily: 'Almarai-Bold', color: '#333', textAlign: 'right',
//     },
//     inputWrapper: {
//         flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0',
//         borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12, minHeight: 56,
//     },
//     inputWrapperFocused: { borderColor: '#FF9800', borderWidth: 2 },
//     inputWrapperError: { borderColor: '#f44336', borderWidth: 2 },
//     input: {
//         flex: 1, fontSize: 14, fontFamily: 'Almarai-Regular', color: '#1a1a1a', paddingVertical: 12, textAlign: 'right',
//     },
//     icon: { marginLeft: 8 },
//     mobileInputContainer: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center' },
//     mobileInput: {
//         flex: 1, fontSize: 14, fontFamily: 'Almarai-Regular', color: '#1a1a1a', paddingVertical: 12, textAlign: 'right',
//     },
//     mobilePrefix: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#666', marginRight: 8 },
//     passwordInputContainer: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center' },
//     passwordInput: {
//         flex: 1, fontSize: 14, fontFamily: 'Almarai-Regular', color: '#1a1a1a', paddingVertical: 12,
//         textAlign: 'right', letterSpacing: 2,
//     },
//     eyeIcon: { padding: 8, marginLeft: 4 },
//     dropdownText: { flex: 1, fontSize: 14, fontFamily: 'Almarai-Regular', color: '#1a1a1a', textAlign: 'right' },
//     placeholder: { color: '#999' },
//     helperText: { fontSize: 12, fontFamily: 'Almarai-Regular', color: '#666', textAlign: 'right', marginTop: 4 },
//     errorText: { fontSize: 12, fontFamily: 'Almarai-Regular', color: '#f44336', textAlign: 'right', marginTop: 4 },
//     successText: { fontSize: 12, fontFamily: 'Almarai-Regular', color: '#4CAF50', textAlign: 'right', marginTop: 4 },
//     textAreaWrapper: { alignItems: 'flex-start', minHeight: 100 },
//     textArea: { minHeight: 80, paddingTop: 12 },
//     textAreaIcon: { alignSelf: 'flex-start', marginTop: 12 },
//     wordCount: { fontSize: 12, fontFamily: 'Almarai-Regular', textAlign: 'right', marginTop: 4 },
//     divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8 },
//     buttonContainer: { gap: 12, marginTop: 8 },
//     submitButton: {
//         backgroundColor: '#FF9800', borderRadius: 12, paddingVertical: 14,
//         flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8,
//     },
//     submitButtonText: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#fff' },
//     backButton: {
//         backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF9800', borderRadius: 12,
//         paddingVertical: 14, flexDirection: 'row-reverse', alignItems: 'center',
//         justifyContent: 'center', gap: 8,
//     },
//     backButtonText: { fontSize: 14, fontFamily: 'Almarai-Bold', color: '#FF9800' },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//     modalContentBottom: {
//         backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
//         padding: 20, maxHeight: '70%',
//     },
//     modalHandle: {
//         width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2,
//         alignSelf: 'center', marginBottom: 16,
//     },
//     modalTitle: { fontSize: 18, fontFamily: 'Almarai-Bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 16 },
//     menuItem: {
//         flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between',
//         paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//     },
//     menuItemText: { fontSize: 16, fontFamily: 'Almarai-Regular', color: '#333', textAlign: 'right', flex: 1 },
// });

//abov is old one and the below is the full code///


// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import * as React from 'react';
// import { useRef, useState, useEffect } from 'react';
// import {
//   Alert,
//   FlatList,
//   Keyboard,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput as RNTextInput,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { db } from '../services/firestore';
// import { collection, query, where, getDocs } from 'firebase/firestore';

// type RegistrationScreenProps = {
//   initialData?: any;
//   isSocialSignup?: boolean;
//   onNext: (data: any) => void;
//   onBackToLogin: () => void;
// };

// const JOBS = ['كهربائي','سباك','نجار','دهان','بناء','ميكانيكي','خياط','حداد','نقاش','مبرمج'];
// const AREAS = ['بغداد','البصرة','النجف','كربلاء','أربيل','السليمانية','الموصل','ديالى','الأنبار','ذي قار'];

// const isEnglishNumbers = (v: string) => /^[0-9]*$/.test(v);
// const isEnglishPassword = (v: string) =>
//   /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]*$/.test(v);

// export default function RegistrationScreen({
//   initialData,
//   isSocialSignup,
//   onNext,
//   onBackToLogin,
// }: RegistrationScreenProps) {

//   const [name, setName] = useState(initialData?.name || '');
//   const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
//   const [area, setArea] = useState(initialData?.area || '');
//   const [mobile, setMobile] = useState(initialData?.mobile?.replace('+964','') || '');
//   const [email, setEmail] = useState(initialData?.email || '');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [description, setDescription] = useState('');

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   const [jobMenuVisible, setJobMenuVisible] = useState(false);
//   const [areaMenuVisible, setAreaMenuVisible] = useState(false);

//   const [checkingDuplicate, setCheckingDuplicate] = useState(false);
//   const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);
//   const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);

//   const [mobileLangError, setMobileLangError] = useState<string | null>(null);
//   const [passwordLangError, setPasswordLangError] = useState<string | null>(null);

//   const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
//   const mobileRef = useRef<RNTextInput>(null);

//   // 🔍 تحقق مباشر من التكرار
//   useEffect(() => {
//     const check = async () => {
//       setCheckingDuplicate(true);
//       setDuplicateEmail(null);
//       setDuplicateMobile(null);

//       if (mobile.length === 10) {
//         const q1 = query(
//           collection(db, 'users'),
//           where('mobile', '==', '+964' + mobile)
//         );
//         const s1 = await getDocs(q1);
//         if (!s1.empty) setDuplicateMobile(mobile);
//       }

//       if (email.includes('@')) {
//         const q2 = query(
//           collection(db, 'users'),
//           where('email', '==', email.trim())
//         );
//         const s2 = await getDocs(q2);
//         if (!s2.empty) setDuplicateEmail(email.trim());
//       }

//       setCheckingDuplicate(false);
//     };

//     if (mobile.length === 10 || email.includes('@')) check();
//   }, [mobile, email]);

//   const handleNext = async () => {
//     Keyboard.dismiss();

//     if (duplicateEmail || duplicateMobile) {
//       Alert.alert('خطأ', 'الإيميل أو رقم الجوال مستخدم مسبقاً');
//       return;
//     }

//     if (!name.trim()) return Alert.alert('خطأ','يرجى إدخال الاسم');
//     if (!jobTitle) return Alert.alert('خطأ','يرجى اختيار المهنة');
//     if (!area) return Alert.alert('خطأ','يرجى اختيار المنطقة');
//     if (mobile.length !== 10) return Alert.alert('خطأ','رقم الجوال غير صحيح');
//     if (password.length < 8) return Alert.alert('خطأ','كلمة المرور أقل من 8 أحرف');
//     if (password !== confirmPassword) return Alert.alert('خطأ','كلمتا المرور غير متطابقتين');
//     if (!email.includes('@')) return Alert.alert('خطأ','الإيميل غير صحيح');
//     if (wordCount > 120) return Alert.alert('خطأ','الوصف تجاوز 120 كلمة');

//     const data = {
//       name: name.trim(),
//       jobTitle,
//       area,
//       mobile: '+964' + mobile,
//       email: email.trim(),
//       password,
//       description,
//     };

//     await AsyncStorage.setItem('userRegistrationDraft', JSON.stringify(data));
//     onNext({ ...data, signupType: 'manual' });
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.scrollContent}
//       keyboardShouldPersistTaps="handled"
//     >
//       <View style={styles.formCard}>
//         <View style={styles.header}>
//           <MaterialCommunityIcons name="account-plus" size={40} color="#FF9800" />
//           <Text style={styles.headerTitle}>تسجيل حساب جديد</Text>
//         </View>

//         {checkingDuplicate && (
//           <View style={{ alignItems:'center', marginBottom:8 }}>
//             <ActivityIndicator color="#FF9800" />
//             <Text style={{ color:'#FF9800' }}>جاري التحقق...</Text>
//           </View>
//         )}

//         {/* الاسم */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>الاسم الكامل</Text>
//           <View style={[styles.inputWrapper, focusedField==='name' && styles.inputWrapperFocused]}>
//             <RNTextInput
//               value={name}
//               onChangeText={setName}
//               style={styles.input}
//               textAlign="right"
//               placeholder="أدخل الاسم"
//               onFocus={()=>setFocusedField('name')}
//               onBlur={()=>setFocusedField(null)}
//               returnKeyType="next"
//             />
//             <MaterialCommunityIcons name="account" size={20} color="#FF9800" />
//           </View>
//         </View>

//         {/* الجوال ✔️ */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>رقم الجوال</Text>
//           <View style={[
//             styles.inputWrapper,
//             focusedField==='mobile' && styles.inputWrapperFocused,
//             duplicateMobile && styles.inputWrapperError
//           ]}>
//             <RNTextInput
//               ref={mobileRef}
//               value={mobile}
//               onChangeText={(v)=>{
//                 if (!isEnglishNumbers(v)) setMobileLangError('أرقام إنجليزية فقط');
//                 else setMobileLangError(null);
//                 setMobile(v.replace(/[^0-9]/g,'').slice(0,10));
//               }}
//               keyboardType="number-pad"
//               style={styles.input}
//               textAlign="right"
//               placeholder="7701234567"
//               returnKeyType="done"     // ✔️
//               onSubmitEditing={handleNext}
//               onFocus={()=>setFocusedField('mobile')}
//               onBlur={()=>setFocusedField(null)}
//             />
//             <Text style={{ marginLeft:6, color:'#666' }}>+964</Text>
//             {mobile.length===10 && !duplicateMobile && (
//               <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
//             )}
//           </View>

//           {duplicateMobile && (
//             <Text style={styles.errorText}>
//               رقم الجوال مستخدم مسبقاً
//             </Text>
//           )}
//         </View>

//         {/* زر التالي */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleNext}
//           disabled={checkingDuplicate || duplicateEmail || duplicateMobile}
//         >
//           <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
//           <Text style={styles.submitButtonText}>التالي - اختيار الباقة</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={onBackToLogin}
//         >
//           <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flex:1, backgroundColor:'#f5f5f5' },
//   scrollContent:{ paddingBottom:32 },
//   formCard:{ margin:16, padding:24, borderRadius:20, backgroundColor:'#fff', elevation:4 },
//   header:{ alignItems:'center', marginBottom:24 },
//   headerTitle:{ fontFamily:'Almarai-Bold', fontSize:18 },
//   inputContainer:{ marginBottom:14 },
//   label:{ fontFamily:'Almarai-Bold', textAlign:'right' },
//   inputWrapper:{ flexDirection:'row-reverse', borderWidth:1, borderRadius:12, padding:12, alignItems:'center' },
//   inputWrapperFocused:{ borderColor:'#FF9800', borderWidth:2 },
//   inputWrapperError:{ borderColor:'#f44336', borderWidth:2 },
//   input:{ flex:1, textAlign:'right', fontFamily:'Almarai-Regular' },
//   submitButton:{ backgroundColor:'#FF9800', padding:14, borderRadius:12, alignItems:'center', flexDirection:'row-reverse', gap:8 },
//   submitButtonText:{ color:'#fff', fontFamily:'Almarai-Bold' },
//   backButton:{ marginTop:12, alignItems:'center' },
//   backButtonText:{ color:'#FF9800', fontFamily:'Almarai-Bold' },
//   errorText:{ color:'#f44336', fontSize:12, textAlign:'right', marginTop:4 },
// });
