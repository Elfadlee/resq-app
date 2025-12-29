import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Portal,
  Text,
} from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import theme from '../theme/theme';
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firestore"; // تأكد من هذه الاستيراد حسب مشروعك

const { width } = Dimensions.get('window');

export default function HeroSearch({
  onSearch,
}: {
  onSearch: (job: string, area: string) => void;
}) {
  const [jobOpen, setJobOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const [jobs, setJobs] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const [job, setJob] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);

  // =============== قراءة الداتا من Firestore ===============
  useEffect(() => {
    loadJobsAndAreas();
  }, []);

  const loadJobsAndAreas = async () => {
    try {
      // جلب المناطق
      const areasSnap = await getDocs(collection(db, "lookup_areas"));
      const areasList: string[] = [];
      areasSnap.forEach((doc) => {
        areasList.push(doc.id); // اسم المنطقة هو doc.id
      });

      // جلب المهن
      const jobsSnap = await getDocs(collection(db, "lookup_professions"));
      const jobsList: string[] = [];
      jobsSnap.forEach((doc) => {
        jobsList.push(doc.id);
      });

      setJobs(jobsList);
      setAreas(areasList);
    } catch (e) {
      setJobs([]);
      setAreas([]);
      console.error("Firestore read error:", e);
    }
  };

  // =============== تحكم الأنيميشن ===============
  const overlayAnim = React.useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    overlayAnim.setValue(0);
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = (cb?: () => void) => {
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setJobOpen(false);
      setAreaOpen(false);
      cb && cb();
    });
  };

  return (
    <>
      {/* ================= HERO (الواجهة والتصميم كما هو) ================= */}
      <View style={styles.heroWrapper}>
        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBadge}>
              <Icon name="account-search" size={28} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>ابحث عن أصحاب المهن</Text>
          <Text style={styles.subtitle}>اختر المهنة والمنطقة للبدء</Text>

          <View style={styles.inputsContainer}>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setJobOpen(true);
                setAreaOpen(false);
                openSheet();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.inputContent}>
                <Icon name="briefcase-outline" size={18} color={theme.colors.primary} />
                <Text style={job ? styles.inputTextSelected : styles.inputTextPlaceholder}>
                  {job ?? 'اختر المهنة'}
                </Text>
              </View>
              <Icon name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setAreaOpen(true);
                setJobOpen(false);
                openSheet();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.inputContent}>
                <Icon name="map-marker-outline" size={18} color={theme.colors.primary} />
                <Text style={area ? styles.inputTextSelected : styles.inputTextPlaceholder}>
                  {area ?? 'اختر المنطقة'}
                </Text>
              </View>
              <Icon name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={() => onSearch(job!, area!)}
            disabled={!job || !area}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            ابدأ البحث
          </Button>
        </Card>
      </View>

      {/* ================= BOTTOM SHEET (بدون تغيير) ================= */}
      <Portal>
        {(jobOpen || areaOpen) && (
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={() => closeSheet()}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <Animated.View
              style={{
                transform: [
                  {
                    translateY: overlayAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              }}
            >
              <Card style={styles.menuCard}>
                <Text style={styles.sheetTitle}>
                  {jobOpen ? 'اختر المهنة' : 'اختر المنطقة'}
                </Text>
                <ScrollView style={{ maxHeight: 260 }}>
                  {(jobOpen ? jobs : areas).map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() =>
                        closeSheet(() => {
                          jobOpen ? setJob(item) : setArea(item);
                        })
                      }
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Card>
            </Animated.View>
          </Animated.View>
        )}
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Almarai-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: 'Almarai-Regular',
  },
  inputsContainer: {
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 10,
  },
  inputContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  inputTextPlaceholder: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Almarai-Regular',
  },
  inputTextSelected: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Almarai-Bold',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#25D366',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Almarai-Bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuCard: {
    width: width,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 10,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 14,
    color: '#25D366',
    fontFamily: 'Almarai-Bold',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Almarai-Regular',
    textAlign: 'center',
  },
});