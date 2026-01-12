// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
// import { useEffect, useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { db } from "../services/firestore";
// import storage from '../services/storage-helper';


// const JOBS = [
//   'كهربائي',
//   'سباك',
//   'نجار',
//   'دهان',
//   'بناء',
//   'ميكانيكي',
//   'خياط',
//   'حداد',
//   'نقاش',
//   'مبرمج',
// ];

// const AREAS = [
//   'بغداد',
//   'البصرة',
//   'النجف',
//   'كربلاء',
//   'أربيل',
//   'السليمانية',
//   'الموصل',
//   'ديالى',
//   'الأنبار',
//   'ذي قار',
// ];

// async function isMobileTaken(mobile: string, myId: string) {
//   const q = query(collection(db, "users"), where("mobile", "==", mobile));
//   const snap = await getDocs(q);
//   // true if another user with this mobile exists
//   return snap.docs.some(doc => doc.id !== myId);
// }

// async function isEmailTaken(email: string, myId: string) {
//   const q = query(collection(db, "users"), where("email", "==", email));
//   const snap = await getDocs(q);
//   return snap.docs.some(doc => doc.id !== myId);
// }

// export default function ProfileEdit({ navigation, route }: any) {
//   const { profile, onSave } = route.params;

//   const [name, setName] = useState(profile.name);
//   const [jobTitle, setJobTitle] = useState(profile.jobTitle);
//   const [area, setArea] = useState(profile.area);
//   const [mobile, setMobile] = useState(profile.mobile.replace('+964', ''));
//   const [email, setEmail] = useState(profile.email);
//   const [description, setDescription] = useState(profile.description);
//   const [password, setPassword] = useState('');
//   const [saving, setSaving] = useState(false);

//   const [jobMenuVisible, setJobMenuVisible] = useState(false);
//   const [areaMenuVisible, setAreaMenuVisible] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [checkingDuplicate, setCheckingDuplicate] = useState(false);
//   const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);
//   const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

//   const wordCount = description.trim().split(/\s+/).filter(Boolean).length;



//   useEffect(() => {
//     const checkDup = async () => {
//       setCheckingDuplicate(true);
//       setDuplicateMobile(null);
//       setDuplicateEmail(null);
//       // check mobile if changed and length is 10
//       if (mobile && mobile.length === 10) {
//         const mobSnap = await getDocs(query(collection(db, "users"), where("mobile", "==", '+964' + mobile)));
//         if (!mobSnap.empty && mobSnap.docs.some(doc => doc.id !== profile.id)) {
//           setDuplicateMobile('+964' + mobile);
//         }
//       }
//       // check email if allowed (not appbtn)
//       if (email && email.includes('@') && !(profile.authProvider === 'appbtn')) {
//         const emSnap = await getDocs(query(collection(db, "users"), where("email", "==", email.trim())));
//         if (!emSnap.empty && emSnap.docs.some(doc => doc.id !== profile.id)) {
//           setDuplicateEmail(email.trim());
//         }
//       }
//       setCheckingDuplicate(false);
//     };
//     checkDup();
//   }, [mobile, email]);

//   // Save Handler

//   const handleSave = async () => {
//     // Validation ...
//     if (!name.trim()) {
//       Alert.alert('خطأ', 'الرجاء إدخال الاسم'); return;
//     }
//     if (!jobTitle) {
//       Alert.alert('خطأ', 'الرجاء اختيار المهنة'); return;
//     }
//     if (!area) {
//       Alert.alert('خطأ', 'الرجاء اختيار المنطقة'); return;
//     }
//     if (!mobile.trim() || mobile.length < 10) {
//       Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف صحيح'); return;
//     }
//     if (!email.trim() || !email.includes('@')) {
//       Alert.alert('خطأ', 'الرجاء إدخال بريد إلكتروني صحيح'); return;
//     }
//     if (wordCount > 120) {
//       Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة. الحد الأقصى 120 كلمة`); return;
//     }

//     // ========= SHOW WARNING ALERT =========
//     Alert.alert(
//       'تنبيه',
//       'سيتم تعطيل حسابك لمدة ٤٨ ساعة للمراجعة. إذا وافقت اضغط استمرار. إذا أردت إبقاء معلوماتك القديمة اضغط إلغاء.',
//       [
//         { text: 'إلغاء', style: 'cancel' },
//         {
//           text: 'استمرار',
//           style: 'default',
//           onPress: async () => {
//             setSaving(true);
//             const myId = profile.id;
//             const formattedMobile = mobile.startsWith('+964') ? mobile : '+964' + mobile.trim();
//             if (await isMobileTaken(formattedMobile, myId)) {
//               setSaving(false);
//               Alert.alert('خطأ', 'رقم الهاتف مستخدم من قبل');
//               return;
//             }
//             if (!(profile.authProvider === 'appbtn')) {
//               if (await isEmailTaken(email.trim(), myId)) {
//                 setSaving(false);
//                 Alert.alert('خطأ', 'البريد الإلكتروني مستخدم من قبل');
//                 return;
//               }
//             }

//             const updatedProfile = {
//               ...profile,
//               name: name.trim(),
//               jobTitle,
//               area,
//               mobile: mobile.startsWith('+964') ? mobile : '+964' + mobile.trim(),
//               email: email.trim(),
//               description: description.trim(),
//               password: password || profile.password,
//             };

//             try {
//               if (profile.id) {
//                 const userRef = doc(db, "users", profile.id);
//                 await updateDoc(userRef, {
//                   name: updatedProfile.name,
//                   jobTitle: updatedProfile.jobTitle,
//                   area: updatedProfile.area,
//                   mobile: updatedProfile.mobile,
//                   email: updatedProfile.email,
//                   description: updatedProfile.description,
//                   password: updatedProfile.password,
//                   "subscription.isActive": false, // <<<<< ستعطل الحساب هنا
//                   "metadata.updatedAt": serverTimestamp(),
//                 });
//               }

//               // Also update local
//               await storage.setObject('userProfile', updatedProfile);
//               await storage.setObject('currentUser', updatedProfile);
//               const allUsers = await storage.getObject<any[]>('allUsers') || [];
//               const userIndex = allUsers.findIndex((u: any) => u.id === profile.id);
//               if (userIndex !== -1) {
//                 allUsers[userIndex] = updatedProfile;
//                 await storage.setObject('allUsers', allUsers);
//               }

//               Alert.alert(
//                 'تم إرسال المعلومات',
//                 'تم إرسال معلوماتك للمراجعة وسيتم تفعيل الحساب خلال ٤٨ ساعة.',
//                 [{
//                   text: 'حسناً',
//                   onPress: () => {
//                     onSave?.();
//                     navigation.goBack();
//                   }
//                 }]
//               );
//             } catch (error) {
//               console.error('Error updating profile:', error);
//               Alert.alert('خطأ', 'فشل تحديث المعلومات. يرجى المحاولة مرة أخرى.');
//             } finally {
//               setSaving(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={{ width: 40 }} />
//           <Text style={styles.headerTitle}>تعديل المعلومات</Text>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <MaterialCommunityIcons name="arrow-right" size={24} color="#FF9800" />
//           </TouchableOpacity>
//         </View>

//         <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//           <View style={styles.form}>
//             {/* Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>الاسم *</Text>
//               <View style={styles.inputWrapper}>
//                 <TextInput
//                   style={styles.input}
//                   value={name}
//                   onChangeText={setName}
//                   placeholder="أدخل الاسم"
//                   textAlign="right"
//                 />
//                 <MaterialCommunityIcons name="account" size={20} color="#FF9800" />
//               </View>
//             </View>

//             {/* Job Title */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>المهنة *</Text>
//               <TouchableOpacity
//                 style={styles.inputWrapper}
//                 onPress={() => setJobMenuVisible(true)}
//               >
//                 <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
//                   {jobTitle || 'اختر المهنة'}
//                 </Text>
//                 <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" />
//               </TouchableOpacity>
//             </View>

//             {/* Area */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>المنطقة *</Text>
//               <TouchableOpacity
//                 style={styles.inputWrapper}
//                 onPress={() => setAreaMenuVisible(true)}
//               >
//                 <Text style={[styles.dropdownText, !area && styles.placeholder]}>
//                   {area || 'اختر المنطقة'}
//                 </Text>
//                 <MaterialCommunityIcons name="map-marker" size={20} color="#FF9800" />
//               </TouchableOpacity>
//             </View>

//             {/* Mobile */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>رقم الهاتف *</Text>
//               <View style={styles.inputWrapper}>
//                 <View style={styles.mobileContainer}>
//                   <TextInput
//                     style={styles.mobileInput}
//                     value={mobile}
//                     onChangeText={setMobile}
//                     placeholder="770 123 4567"
//                     keyboardType="phone-pad"
//                     textAlign="right"
//                     maxLength={10}
//                   />
//                   {/* Mobile duplicate warning */}
//                   {duplicateMobile && (
//                     <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
//                       {duplicateMobile}{'\n'}رقم الهاتف مستخدم سابقاً، يرجى استخدام رقم آخر أو الدخول بحسابك.
//                     </Text>
//                   )}
//                   <Text style={styles.mobilePrefix}>964+</Text>
//                 </View>
//                 <MaterialCommunityIcons name="phone" size={20} color="#FF9800" />
//               </View>
//             </View>

//             {/* Email */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>البريد الإلكتروني *</Text>
//               <View style={styles.inputWrapper}>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     profile.authProvider === 'appbtn' && { backgroundColor: '#f3f3f3', color: '#bbb' }
//                   ]}
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="example@email.com"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   textAlign="right"
//                   editable={!(profile.authProvider === 'appbtn')}
//                 />
//                 {duplicateEmail && (
//                   <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
//                     {duplicateEmail}{'\n'}البريد الإلكتروني مستخدم سابقاً، يرجى استخدام بريد آخر أو الدخول بحسابك.
//                   </Text>
//                 )}
//                 {profile.authProvider === 'appbtn' && (
//                   <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
//                     تم إنشاء الحساب بواسطة التطبيق ولا يمكنك تغيير البريد الإلكتروني
//                   </Text>
//                 )}
//                 <MaterialCommunityIcons name="email" size={20} color="#FF9800" />
//               </View>
//             </View>

//             {/* Password */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>كلمة المرور (اختياري)</Text>
//               <View style={styles.inputWrapper}>
//                 <View style={styles.passwordContainer}>
//                   <TouchableOpacity
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={styles.eyeIcon}
//                   >
//                     <MaterialCommunityIcons
//                       name={showPassword ? 'eye-off' : 'eye'}
//                       size={20}
//                       color="#666"
//                     />
//                   </TouchableOpacity>
//                   <TextInput
//                     style={styles.passwordInput}
//                     value={password}
//                     onChangeText={setPassword}
//                     placeholder="اترك فارغاً للإبقاء على القديمة"
//                     secureTextEntry={!showPassword}
//                     textAlign="right"
//                   />
//                 </View>
//                 <MaterialCommunityIcons name="lock" size={20} color="#FF9800" />
//               </View>
//             </View>

//             {/* Description */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>الوصف</Text>
//               <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
//                 <TextInput
//                   style={[styles.input, styles.textArea]}
//                   value={description}
//                   onChangeText={setDescription}
//                   placeholder="أدخل وصف مختصر"
//                   multiline
//                   numberOfLines={4}
//                   textAlign="right"
//                   textAlignVertical="top"
//                 />
//                 <MaterialCommunityIcons
//                   name="text"
//                   size={20}
//                   color="#FF9800"
//                   style={styles.textAreaIcon}
//                 />
//               </View>
//               <Text style={[styles.wordCount, { color: wordCount > 120 ? '#f44336' : '#888' }]}>
//                 {wordCount} / 120 كلمة
//               </Text>
//             </View>

//             {/* Save Button */}
//             <TouchableOpacity
//               style={[styles.saveButton, saving && styles.saveButtonDisabled]}
//               onPress={handleSave}
//               disabled={saving}
//             >
//               {saving ? (
//                 <Text style={styles.saveButtonText}>جاري الحفظ...</Text>
//               ) : (
//                 <>
//                   <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
//                   <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
//                 </>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
//               <Text style={styles.cancelButtonText}>إلغاء</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Job Modal */}
//       <Modal visible={jobMenuVisible} transparent animationType="slide">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setJobMenuVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>اختر المهنة</Text>
//             <FlatList
//               data={JOBS}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.menuItem}
//                   onPress={() => {
//                     setJobTitle(item);
//                     setJobMenuVisible(false);
//                   }}
//                 >
//                   <Text style={styles.menuItemText}>{item}</Text>
//                   {jobTitle === item && (
//                     <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                   )}
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Area Modal */}
//       <Modal visible={areaMenuVisible} transparent animationType="slide">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setAreaMenuVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>اختر المنطقة</Text>
//             <FlatList
//               data={AREAS}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.menuItem}
//                   onPress={() => {
//                     setArea(item);
//                     setAreaMenuVisible(false);
//                   }}
//                 >
//                   <Text style={styles.menuItemText}>{item}</Text>
//                   {area === item && (
//                     <MaterialCommunityIcons name="check" size={20} color="#FF9800" />
//                   )}
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row-reverse',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontFamily: 'Almarai-Bold',
//     color: '#2D3561',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   form: {
//     gap: 20,
//   },
//   inputContainer: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontFamily: 'Almarai-Bold',
//     color: '#2D3748',
//     textAlign: 'right',
//   },
//   inputWrapper: {
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     gap: 10,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 14,
//     fontFamily: 'Almarai-Regular',
//     color: '#2D3748',
//   },
//   dropdownText: {
//     flex: 1,
//     paddingVertical: 14,
//     fontSize: 16,
//     fontFamily: 'Almarai-Regular',
//     color: '#2D3748',
//     textAlign: 'right',
//   },
//   placeholder: {
//     color: '#999',
//   },
//   mobileContainer: {
//     flex: 1,
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//   },
//   mobileInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     fontFamily: 'Almarai-Regular',
//     color: '#2D3748',
//   },
//   mobilePrefix: {
//     fontSize: 16,
//     fontFamily: 'Almarai-Bold',
//     color: '#666',
//     marginRight: 8,
//   },
//   passwordContainer: {
//     flex: 1,
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//   },
//   passwordInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     fontFamily: 'Almarai-Regular',
//     color: '#2D3748',
//   },
//   eyeIcon: {
//     padding: 8,
//   },
//   textAreaWrapper: {
//     alignItems: 'flex-start',
//     paddingVertical: 12,
//   },
//   textArea: {
//     minHeight: 100,
//     paddingTop: 0,
//   },
//   textAreaIcon: {
//     alignSelf: 'flex-start',
//   },
//   wordCount: {
//     fontSize: 12,
//     fontFamily: 'Almarai-Regular',
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   saveButton: {
//     flexDirection: 'row-reverse',
//     backgroundColor: '#FF9800',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     gap: 8,
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#A0AEC0',
//   },
//   saveButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontFamily: 'Almarai-Bold',
//   },
//   cancelButton: {
//     backgroundColor: 'transparent',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E2E8F0',
//     marginBottom: 40,
//   },
//   cancelButtonText: {
//     color: '#718096',
//     fontSize: 14,
//     fontFamily: 'Almarai-Bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: '70%',
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ddd',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontFamily: 'Almarai-Bold',
//     color: '#1a1a1a',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   menuItem: {
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   menuItemText: {
//     fontSize: 16,
//     fontFamily: 'Almarai-Regular',
//     color: '#333',
//     textAlign: 'right',
//     flex: 1,
//   },
// });

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from "../services/firestore";
import storage from '../services/storage-helper';


const JOBS = ['كهربائي','سباك','نجار','دهان','بناء','ميكانيكي','خياط','حداد','نقاش','مبرمج'];
const AREAS = ['بغداد','البصرة','النجف','كربلاء','أربيل','السليمانية','الموصل','ديالى','الأنبار','ذي قار'];

async function isMobileTaken(mobile: string, myId: string) {
  const q = query(collection(db, "users"), where("mobile", "==", mobile));
  const snap = await getDocs(q);
  return snap.docs.some(doc => doc.id !== myId);
}

async function isEmailTaken(email: string, myId: string) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  return snap.docs.some(doc => doc.id !== myId);
}

export default function ProfileEdit({ navigation, route }: any) {
  const { profile, onSave } = route.params;

  const [name, setName] = useState(profile.name);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [area, setArea] = useState(profile.area);
  const [mobile, setMobile] = useState(profile.mobile.replace('+964', ''));
  const [email, setEmail] = useState(profile.email);
  const [description, setDescription] = useState(profile.description);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [jobMenuVisible, setJobMenuVisible] = useState(false);
  const [areaMenuVisible, setAreaMenuVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateMobile, setDuplicateMobile] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    const checkDup = async () => {
      setCheckingDuplicate(true);
      setDuplicateMobile(null);
      setDuplicateEmail(null);

      if (mobile && mobile.length === 10) {
        const mobSnap = await getDocs(query(collection(db, "users"), where("mobile", "==", '+964' + mobile)));
        if (!mobSnap.empty && mobSnap.docs.some(doc => doc.id !== profile.id)) {
          setDuplicateMobile('+964' + mobile);
        }
      }
      if (email && email.includes('@') && !(profile.authProvider === 'appbtn')) {
        const emSnap = await getDocs(query(collection(db, "users"), where("email", "==", email.trim())));
        if (!emSnap.empty && emSnap.docs.some(doc => doc.id !== profile.id)) {
          setDuplicateEmail(email.trim());
        }
      }
      setCheckingDuplicate(false);
    };
    checkDup();
  }, [mobile, email]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال الاسم'); return;
    }
    if (!jobTitle) {
      Alert.alert('خطأ', 'الرجاء اختيار المهنة'); return;
    }
    if (!area) {
      Alert.alert('خطأ', 'الرجاء اختيار المنطقة'); return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف صحيح'); return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('خطأ', 'الرجاء إدخال بريد إلكتروني صحيح'); return;
    }
    if (wordCount > 120) {
      Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة. الحد الأقصى 120 كلمة`); return;
    }

    Alert.alert(
      'تنبيه',
      'سيتم تعطيل حسابك لمدة ٤٨ ساعة للمراجعة. إذا وافقت اضغط استمرار. إذا أردت إبقاء معلوماتك القديمة اضغط إلغاء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'استمرار',
          style: 'default',
          onPress: async () => {
            setSaving(true);
            const myId = profile.id;
            const formattedMobile = mobile.startsWith('+964') ? mobile : '+964' + mobile.trim();
            if (await isMobileTaken(formattedMobile, myId)) {
              setSaving(false);
              Alert.alert('خطأ', 'رقم الهاتف مستخدم من قبل');
              return;
            }
            if (!(profile.authProvider === 'appbtn')) {
              if (await isEmailTaken(email.trim(), myId)) {
                setSaving(false);
                Alert.alert('خطأ', 'البريد الإلكتروني مستخدم من قبل');
                return;
              }
            }
            const updatedProfile = {
              ...profile,
              name: name.trim(),
              jobTitle,
              area,
              mobile: mobile.startsWith('+964') ? mobile : '+964' + mobile.trim(),
              email: email.trim(),
              description: description.trim(),
              password: password || profile.password,
            };

            try {
              if (profile.id) {
                const userRef = doc(db, "users", profile.id);
                await updateDoc(userRef, {
                  name: updatedProfile.name,
                  jobTitle: updatedProfile.jobTitle,
                  area: updatedProfile.area,
                  mobile: updatedProfile.mobile,
                  email: updatedProfile.email,
                  description: updatedProfile.description,
                  password: updatedProfile.password,
                  "subscription.isActive": false,
                  "metadata.updatedAt": serverTimestamp(),
                });
              }
              await storage.setObject('userProfile', updatedProfile);
              await storage.setObject('currentUser', updatedProfile);
              const allUsers = await storage.getObject<any[]>('allUsers') || [];
              const userIndex = allUsers.findIndex((u: any) => u.id === profile.id);
              if (userIndex !== -1) {
                allUsers[userIndex] = updatedProfile;
                await storage.setObject('allUsers', allUsers);
              }

              Alert.alert(
                'تم إرسال المعلومات',
                'تم إرسال معلوماتك للمراجعة وسيتم تفعيل الحساب خلال ٤٨ ساعة.',
                [{
                  text: 'حسناً',
                  onPress: () => {
                    onSave?.();
                    navigation.goBack();
                  }
                }]
              );
            } catch (error) {
              console.error('Error updating profile:', error);
              Alert.alert('خطأ', 'فشل تحديث المعلومات. يرجى المحاولة مرة أخرى.');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
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
                onPress={() => setJobMenuVisible(true)}
              >
                <Text style={[styles.dropdownText, !jobTitle && styles.placeholder]}>
                  {jobTitle || 'اختر المهنة'}
                </Text>
                <MaterialCommunityIcons name="briefcase" size={20} color="#FF9800" />
              </TouchableOpacity>
            </View>

            {/* Area */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>المنطقة *</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setAreaMenuVisible(true)}
              >
                <Text style={[styles.dropdownText, !area && styles.placeholder]}>
                  {area || 'اختر المنطقة'}
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
                    profile.authProvider === 'appbtn' && { backgroundColor: '#f3f3f3', color: '#bbb' }
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                  editable={!(profile.authProvider === 'appbtn')}
                />
                <MaterialCommunityIcons name="email" size={20} color="#FF9800" />
              </View>
              {/* Email duplicate warning (placed BELOW inputWrapper) */}
              {duplicateEmail && (
                <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                  {duplicateEmail}{'\n'}البريد الإلكتروني مستخدم سابقاً، يرجى استخدام بريد آخر أو الدخول بحسابك.
                </Text>
              )}
              {profile.authProvider === 'appbtn' && (
                <Text style={{ color: '#e53935', fontSize: 13, marginTop: 2, textAlign: 'right' }}>
                  تم إنشاء الحساب بواسطة التطبيق ولا يمكنك تغيير البريد الإلكتروني
                </Text>
              )}
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
              style={[styles.saveButton, (saving || checkingDuplicate) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || checkingDuplicate}
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
              data={JOBS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
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
              data={AREAS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
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