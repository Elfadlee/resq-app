import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import ServiceCard from './components/ServiceCard';

import { getDocs, collection } from "firebase/firestore";
import { db } from "./services/firestore";

// نفس نوع البيانات
type User = {
  id: string;
  name: string;
  jobTitle: string;
  area: string;
  description?: string;
  phone?: string;
  mobile?: string;
  subscription?: {
    package?: 'basic' | 'pro' | 'business';
    packageName?: string;
    duration?: 'monthly' | 'quarterly';
    price?: number;
    startAt?: string;
    endAt?: string;
    isActive?: boolean;
  };
};

export default function SearchResultsScreen() {
  const params = useLocalSearchParams();

  const jobTitle = Array.isArray(params.jobTitle)
    ? params.jobTitle[0]
    : params.jobTitle ?? "";

  const area = Array.isArray(params.area)
    ? params.area[0]
    : params.area ?? "";

  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, area]);

  const loadResults = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const users: User[] = [];
      snap.forEach(doc => users.push({ id: doc.id, ...doc.data() } as any));

      const normalize = (v?: string) =>
        (v ?? "").replace(/\s+/g, ' ').trim().toLowerCase();

      const paramsAreEmpty =
        (!jobTitle || normalize(jobTitle) === "") &&
        (!area || normalize(area) === "");

      const filtered = paramsAreEmpty
        ? users
        : users.filter(u =>
            (!jobTitle || normalize(u.jobTitle).includes(normalize(jobTitle))) &&
            (!area || normalize(u.area).includes(normalize(area)))
          );

      // ترتيب حسب الباقة
      const order = { business: 0, pro: 1, basic: 2 };
      const sorted = filtered.sort((a, b) => {
        const pa = a.subscription?.package ?? 'basic';
        const pb = b.subscription?.package ?? 'basic';
        return (order[pa] ?? 3) - (order[pb] ?? 3);
      });

      setResults(sorted);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.resultCard}>
      <ServiceCard
        name={item.name ?? ''}
        jobTitle={item.jobTitle ?? ''}
        description={item.description ?? ''}
        phone={item.phone ?? item.mobile ?? ''}
        area={item.area ?? ''}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader onMenuOpen={() => { /* handle menu open here */ }} />
      <View style={styles.wrap}>
        <View style={styles.headerBox}>
          <Icon name="account-search" color="#25D366" size={26} /> {/* لون واتساب */}
          <Text style={styles.pageTitle}>
            نتائج البحث
          </Text>
          {(jobTitle || area) ? (
            <Text style={styles.subTitle}>
              {jobTitle ? `المهنة: ${jobTitle}` : ''}
              {jobTitle && area ? ' - ' : ''}
              {area ? `المنطقة: ${area}` : ''}
            </Text>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#25D366" />
            <Text style={styles.text}>جاري تحميل النتائج…</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.center}>
            <Icon name="emoticon-sad-outline" size={66} color="#FF9800" />
            <Text style={styles.noResultTitle}>لا توجد نتائج مطابقة لبحثك حاليًا</Text>
            <Text style={styles.noResultSub}>
              يمكنك تعديل خيارات البحث أو العودة للصفحة الرئيسية
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <AppFooter/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  wrap: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 4,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Almarai-Bold',
    color: '#222',
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'Almarai-Regular',
    color: '#FF9800',
    marginBottom: 6,
    marginTop: 1,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 24,
  },
  text: {
    marginTop: 10,
    color: '#555',
    fontFamily: 'Almarai-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  noResultTitle: {
    marginTop: 14,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Almarai-ExtraBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  noResultSub: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Almarai-Regular',
    marginTop: 3,
    textAlign: 'center',
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
});