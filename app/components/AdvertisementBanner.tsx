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
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firestore";

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
  crown?: boolean;
};

const DEFAULT_ADS: Advertisement[] = [
  {
    id: '1',
    name: 'ناجح الفضلي', 
    profession: 'مبرمج', 
    location: 'منطقة كربلاء',
    phone: '+447377767774', 
    whatsapp: '+447377767774', 
    color: '#FF9800',
    description: 'عمل مواقع الانترنت وتطبيقات الموبايل ', 
    crown: true,
  },


];

const AdvertisementBanner = () => {
  const theme = useTheme();
  const flatListRef = useRef<FlatList<Advertisement>>(null);
  const autoScrollRef = useRef<number | null>(null);

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
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const allUsers: any[] = [];
      usersSnap.forEach((doc) => {
        allUsers.push({ id: doc.id, ...doc.data() });
      });

   const businessUsers = allUsers.filter(
  u =>
    u?.subscription?.package === 'business' &&
    u?.subscription?.isActive === true &&
    u?.ad?.status === 'approved' &&
    u?.ad?.isVisible === true
);


      if (businessUsers.length > 0) {
        const ads: Advertisement[] = businessUsers.map(user => {
          const phone = user.mobile || user.phone || '';
          return {
            id: user.id,
            name: user.name,
            profession: user.jobTitle,
            location: user.area,
            phone,
            whatsapp: phone.replace('+', '').replace(/\s/g, ''),
            color: '#FF9800',
            description: user.description || 'خدمات متميزة ومحترفة',
            crown: true,
          };
        });
        setAdvertisements(ads);
      } else {
        setAdvertisements(DEFAULT_ADS); // ابقِ العينة الافتراضية
      }
    } catch (e) {
      setAdvertisements(DEFAULT_ADS);
      console.error("Firebase error: ", e);
    }
  };

  useEffect(() => {
    if (!autoScrollEnabled || advertisements.length <= 1) return;

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

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
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
            <View style={[styles.professionBadge, { backgroundColor: item.color }]}>
              <Text style={styles.professionText}>{item.profession}</Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
            


            </View>
              {item.crown && (
                <Icon
                  name="crown"
                  size={22}
                  color="#FFC700"
                  style={styles.crownIcon}
                />
              )}
          </View>



          <View style={styles.infoRow}>
            <View style={styles.infoGroup}>
              <Icon name="map-marker" size={14} color={item.color} />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Icon name="phone" size={14} color={item.color} />
              <Text style={styles.infoText}>{item.phone}</Text>
            </View>
          </View>


          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>






          <TouchableOpacity
            style={[styles.whatsappButton, { backgroundColor: item.color }]}
            onPress={() => handleWhatsApp(item.whatsapp)}
          >
            <Icon name="whatsapp" size={16} color="#fff" />
            <Text style={styles.whatsappButtonText}>  تواصل عبر الواتسب   </Text>
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
        keyExtractor={(item, index) => `${item.id}-${index}`}
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

  container: {
    marginVertical: 0,
    paddingVertical: 0,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 0,
    overflow: 'hidden',

  },

  gradientBackground: {
    overflow: 'hidden',
  },

  content: {
    padding: 15,
  },


  header: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
  },

  headerText: {
    alignItems: 'flex-end',
    flex: 1,
  },

  name: {
    fontFamily: 'Almarai-Bold',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 6,
  },

  professionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  professionText: {
    fontFamily: 'Almarai-Bold',
    fontSize: 11,
    color: '#fff',
  },


  description: {
    fontFamily: 'Almarai-Regular',
    fontSize: 11,
    textAlign: 'right',
    lineHeight: 16,
    color: '#666',
    marginVertical: 10,
    marginHorizontal: 10,
  },

  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  infoText: {
    fontFamily: 'Almarai-Regular',
    fontSize: 11,
    color: '#555',
    marginRight: 4,
  },

  whatsappButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 16,
    marginTop: 14,
  },

  whatsappButtonText: {
    fontFamily: 'Almarai-Bold',
    fontSize: 11,
    color: '#fff',
    marginRight: 4,
  },


  bottomShadow: {
    height: 14,
    width: '100%',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },

  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  infoGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginLeft: 12,
  },
  crownIcon: {
    marginRight: 6,
    marginTop: -2,
  },

});


export default AdvertisementBanner;
