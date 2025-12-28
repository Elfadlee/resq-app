// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   FlatList,
//   I18nManager,
//   Linking,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Card, Text, useTheme } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getBusinessUsers, type User } from '../storage/userStorage';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width;

// type Advertisement = {
//   id: string;
//   name: string;
//   profession: string;
//   location: string;
//   phone: string;
//   whatsapp: string;
//   color: string;
//   description: string;
// };

// const AdvertisementBanner = () => {
//   const theme = useTheme();
//   const flatListRef = useRef<FlatList<Advertisement>>(null);
//   const autoScrollRef = useRef<number | null>(null);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
//   const [direction, setDirection] = useState<1 | -1>(1);
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

//   useEffect(() => {
//     loadBusinessUsers();

//     const interval = setInterval(() => {
//       loadBusinessUsers();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const loadBusinessUsers = () => {
//     const businessUsers: User[] = getBusinessUsers();

//     console.log('📢 جلب مستخدمي Business للبنر:', businessUsers);

//     if (businessUsers. length > 0) {
//       const ads: Advertisement[] = businessUsers.map(user => ({
//         id: user.id,
//         name: user.name,
//         profession: user.jobTitle,
//         location: user.area,
//         phone: user.phone,
//         whatsapp: user.phone. replace('+', '').replace(/\s/g, ''),
//         color: '#FF9800',
//         description:  user.description || 'خدمات متميزة ومحترفة',
//       }));

//       setAdvertisements(ads);
//     } else {
//       setAdvertisements([
//         {
//           id: '1',
//           name: 'محمد الفضلي',
//           profession: 'كهربائي',
//           location: 'منطقة كربلاء',
//           phone: '+964 770 123 4567',
//           whatsapp: '964770123456',
//           color: '#FF9800',
//           description: 'خدمات كهربائية متكاملة - صيانة وتركيب',
//         },
//         {
//           id: '2',
//           name: 'علي حسن',
//           profession: 'سباك',
//           location: 'منطقة بغداد',
//           phone: '+964 771 234 5678',
//           whatsapp: '964771234567',
//           color: '#FF9800',
//           description: 'إصلاح وتركيب جميع أنواع السباكة',
//         },
//         {
//           id:  '3',
//           name: 'أحمد كريم',
//           profession: 'نجار',
//           location: 'منطقة النجف',
//           phone: '+964 772 345 6789',
//           whatsapp: '964772345678',
//           color: '#FF9800',
//           description:  'تفصيل وتصليح الأثاث المنزلي',
//         },
//       ]);
//     }
//   };

//   useEffect(() => {
//     if (!autoScrollEnabled || advertisements.length === 0) return;

//     autoScrollRef.current = setInterval(() => {
//       setCurrentIndex(prev => {
//         let next = prev + direction;

//         if (next >= advertisements.length) {
//           setDirection(-1);
//           next = prev - 1;
//         }

//         if (next < 0) {
//           setDirection(1);
//           next = prev + 1;
//         }

//         flatListRef.current?.scrollToIndex({
//           index: next,
//           animated: true,
//         });

//         return next;
//       });
//     }, 3500);

//     return () => {
//       if (autoScrollRef. current) clearInterval(autoScrollRef.current);
//     };
//   }, [autoScrollEnabled, direction, advertisements.length]);

//   const stopAutoScrollForever = () => {
//     if (autoScrollRef.current) {
//       clearInterval(autoScrollRef. current);
//       autoScrollRef.current = null;
//     }
//     setAutoScrollEnabled(false);
//   };

//   const handleWhatsApp = (whatsapp: string) => {
//     Linking.openURL(`whatsapp://send?phone=${whatsapp}`);
//   };

//   const renderItem = ({ item }: { item: Advertisement }) => (
//     <Card style={styles.card} elevation={3}>
//       <LinearGradient
//         colors={[
//           '#fad8a6ff',
//           '#faf9f8ff',
//           '#faf9f8ff',
//           '#f8d39bff',
//         ]}
//         start={{ x:  0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles. gradientBackground}
//       >
//         <Card.Content style={styles.content}>
//           <View style={styles.header}>
//             <View style={styles.headerText}>
//               <Text style={styles.name}>{item.name}</Text>

//               <View style={[styles.professionBadge, { backgroundColor: item. color }]}>
//                 <Text style={styles.professionText}>{item.profession}</Text>
//               </View>
//             </View>
//           </View>

//           <Text style={styles.description} numberOfLines={2}>
//             {item.description}
//           </Text>

//           <View style={styles.infoRow}>
//             <Icon name="map-marker" size={14} color={item.color} />
//             <Text style={styles.infoText}>{item.location}</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Icon name="phone" size={14} color={item. color} />
//             <Text style={styles.infoText}>{item.phone}</Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.whatsappButton, { backgroundColor: item.color }]}
//             onPress={() => handleWhatsApp(item.whatsapp)}
//           >
//             <Icon name="whatsapp" size={16} color="#fff" />
//             <Text style={styles.whatsappButtonText}>تواصل عبر واتساب</Text>
//           </TouchableOpacity>
//         </Card.Content>
//       </LinearGradient>
//     </Card>
//   );

//   if (advertisements.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles. container}>
//       <FlatList
//         ref={flatListRef}
//         data={advertisements}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         horizontal
//         inverted={I18nManager.isRTL}
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={CARD_WIDTH}
//         decelerationRate="fast"
//         onTouchStart={stopAutoScrollForever}
//         onMomentumScrollEnd={e => {
//           const index = Math.round(
//             e.nativeEvent.contentOffset.x / CARD_WIDTH
//           );
//           setCurrentIndex(index);
//         }}
//       />

//       <LinearGradient
//         colors={[
//           'rgba(0,0,0,0.18)',
//           'rgba(0,0,0,0.08)',
//           'transparent',
//         ]}
//         style={styles.bottomShadow}
//       />

//       <View style={styles.pagination}>
//         {advertisements.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles. dot,
//               {
//                 backgroundColor: 
//                   currentIndex === index
//                     ? theme.colors.primary
//                     : theme.colors.surfaceDisabled,
//                 width: currentIndex === index ? 20 : 6,
//               },
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet. create({
//   container: { marginVertical: 8, marginTop: 0 },
//   card: {
//     width: CARD_WIDTH,
//     borderRadius: 0,
//     overflow: 'hidden',
//   },

//   gradientBackground: {
//     position: 'relative',
//     overflow: 'hidden',
//   },

//   content: { padding: 20 },

//   header: {
//     flexDirection: 'row-reverse',
//     marginBottom: 6,
//   },
//   headerText: {
//     alignItems: 'flex-end',
//     flex: 1,
//   },

//   name: {
//     fontFamily: 'Almarai-Bold',
//     fontSize: 14,
//     textAlign: 'right',
//     marginBottom: 6,
//   },

//   professionBadge: {
//     paddingHorizontal: 10,
//     paddingVertical:  3,
//     borderRadius: 12,
//   },
//   professionText: {
//     fontFamily: 'Almarai-Bold',
//     fontSize: 11,
//     color: '#fff',
//   },

//   description:  {
//     fontFamily: 'Almarai-Regular',
//     fontSize: 12,
//     textAlign: 'right',
//     lineHeight: 18,
//     color: '#666',
//     marginVertical: 4,
//   },

//   infoRow: {
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   infoText: {
//     fontFamily: 'Almarai-Regular',
//     fontSize:  11,
//     color: '#555',
//     marginRight: 4,
//   },

//   whatsappButton: {
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingHorizontal: 14,
//     paddingVertical:  6,
//     borderRadius:  16,
//     marginTop: 8,
//   },

//   whatsappButtonText: {
//     fontFamily: 'Almarai-Bold',
//     fontSize: 11,
//     color: '#fff',
//     marginRight: 4,
//   },

//   bottomShadow: {
//     height: 14,
//     width: '100%',
//   },

//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 6,
//   },
//   dot:  {
//     height: 6,
//     borderRadius: 3,
//     marginHorizontal: 3,
//   },
// });

// export default AdvertisementBanner;

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  I18nManager,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '../services/storage-helper';   // ✅ بديل userStorage

const { width } = Dimensions.get('window');
const CARD_WIDTH = width;

type Advertisement = {
  id: string;
  name: string;
  profession: string;
  location: string;
  phone: string;
  whatsapp: string;
  color: string;
  description: string;
};

const AdvertisementBanner = () => {
  const theme = useTheme();
  const flatListRef = useRef<FlatList<Advertisement>>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    loadBusinessUsers();

    const interval = setInterval(loadBusinessUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBusinessUsers = async () => {
    const allUsers = (await storage.getObject<any[]>('allUsers')) || [];

    const businessUsers = allUsers.filter(
      u => u?.subscription?.package === 'business'
    );

    console.log('📢 جلب مستخدمي Business للبنر:', businessUsers);

    if (businessUsers.length > 0) {
      const ads: Advertisement[] = businessUsers.map(user => {
        const phone = user.mobile || user.phone || '';

        return {
          id: user.id || Math.random().toString(),
          name: user.name,
          profession: user.jobTitle,
          location: user.area,
          phone,
          whatsapp: phone.replace('+', '').replace(/\s/g, ''),
          color: '#FF9800',
          description: user.description || 'خدمات متميزة ومحترفة',
        };
      });

      setAdvertisements(ads);
    } else {
      // 🎯 بيانات افتراضية عند عدم وجود مستخدمين Business
      setAdvertisements([
        {
          id: '1',
          name: 'محمد الفضلي',
          profession: 'كهربائي',
          location: 'منطقة كربلاء',
          phone: '+964 770 123 4567',
          whatsapp: '9647701234567',
          color: '#FF9800',
          description: 'خدمات كهربائية متكاملة - صيانة وتركيب',
        },
        {
          id: '2',
          name: 'علي حسن',
          profession: 'سباك',
          location: 'منطقة بغداد',
          phone: '+964 771 234 5678',
          whatsapp: '9647712345678',
          color: '#FF9800',
          description: 'إصلاح وتركيب جميع أنواع السباكة',
        },
        {
          id: '3',
          name: 'أحمد كريم',
          profession: 'نجار',
          location: 'منطقة النجف',
          phone: '+964 772 345 6789',
          whatsapp: '9647723456789',
          color: '#FF9800',
          description: 'تفصيل وتصليح الأثاث المنزلي',
        },
      ]);
    }
  };

  // 🔁 Auto Scroll
  useEffect(() => {
    if (!autoScrollEnabled || advertisements.length === 0) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        let next = prev + direction;

        if (next >= advertisements.length) {
          setDirection(-1);
          next = prev - 1;
        }

        if (next < 0) {
          setDirection(1);
          next = prev + 1;
        }

        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);

    return () => autoScrollRef.current && clearInterval(autoScrollRef.current);
  }, [autoScrollEnabled, direction, advertisements.length]);

  const stopAutoScrollForever = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = null;
    setAutoScrollEnabled(false);
  };

  const handleWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return;
    Linking.openURL(`https://wa.me/${whatsapp}`);
  };

  const renderItem = ({ item }: { item: Advertisement }) => (
    <Card style={styles.card} elevation={3}>
      <LinearGradient
        colors={['#fad8a6ff', '#faf9f8ff', '#faf9f8ff', '#f8d39bff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.name}>{item.name}</Text>

              <View style={[styles.professionBadge, { backgroundColor: item.color }]}>
                <Text style={styles.professionText}>{item.profession}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={14} color={item.color} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={14} color={item.color} />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>

          <TouchableOpacity
            style={[styles.whatsappButton, { backgroundColor: item.color }]}
            onPress={() => handleWhatsApp(item.whatsapp)}
          >
            <Icon name="whatsapp" size={16} color="#fff" />
            <Text style={styles.whatsappButtonText}>تواصل عبر واتساب</Text>
          </TouchableOpacity>
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  if (advertisements.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={advertisements}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        inverted={I18nManager.isRTL}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onTouchStart={stopAutoScrollForever}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setCurrentIndex(index);
        }}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.08)', 'transparent']}
        style={styles.bottomShadow}
      />

      <View style={styles.pagination}>
        {advertisements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentIndex === index
                    ? theme.colors.primary
                    : theme.colors.surfaceDisabled,
                width: currentIndex === index ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8, marginTop: 0 },
  card: { width: CARD_WIDTH, borderRadius: 0, overflow: 'hidden' },
  gradientBackground: { overflow: 'hidden' },
  content: { padding: 20 },
  header: { flexDirection: 'row-reverse', marginBottom: 6 },
  headerText: { alignItems: 'flex-end', flex: 1 },
  name: { fontFamily: 'Almarai-Bold', fontSize: 14, textAlign: 'right', marginBottom: 6 },
  professionBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  professionText: { fontFamily: 'Almarai-Bold', fontSize: 11, color: '#fff' },
  description: { fontFamily: 'Almarai-Regular', fontSize: 12, textAlign: 'right', lineHeight: 18, color: '#666', marginVertical: 4 },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 },
  infoText: { fontFamily: 'Almarai-Regular', fontSize: 11, color: '#555', marginRight: 4 },
  whatsappButton: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 8 },
  whatsappButtonText: { fontFamily: 'Almarai-Bold', fontSize: 11, color: '#fff', marginRight: 4 },
  bottomShadow: { height: 14, width: '100%' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
});

export default AdvertisementBanner;
