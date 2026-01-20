import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import ServiceCard from '../components/ServiceCard';

import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firestore";

function safeString(val: any) {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return '';
}


type User = {
  id: string;
  name: any;
  jobTitle: any;
  area: any;
  description?: any;
  phone?: any;
  mobile?: any;
  subscription?: {
    package?: 'basic' | 'pro' | 'business';
    packageName?: string;
    duration?: 'monthly' | 'quarterly';
    price?: number;
    startAt?: string;
    endAt?: string;
    isActive?: boolean;
  };
  ad?: {
    status?: string;
    isVisible?: boolean;
  };
};

type SearchResultsScreenProps = {
  jobTitle?: string;
  area?: string;
  onBack?: () => void;
};

export default function SearchResultsScreen(props: SearchResultsScreenProps) {
  const params = useLocalSearchParams();


  const jobTitle =
    props.jobTitle ??
    (typeof params.jobTitle === "string"
      ? params.jobTitle
      : (Array.isArray(params.jobTitle) &&
        typeof params.jobTitle[0] === "string"
        ? params.jobTitle[0]
        : "")
    );

  const area =
    props.area ??
    (typeof params.area === "string"
      ? params.area
      : (Array.isArray(params.area) &&
        typeof params.area[0] === "string"
        ? params.area[0]
        : "")
    );


  const jobTitleSafe = safeString(jobTitle);
  const areaSafe = safeString(area);


  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitleSafe, areaSafe]);

  const loadResults = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const users: User[] = [];
      snap.forEach(doc => users.push({ id: doc.id, ...doc.data() } as any));

      const normalize = (v?: string) =>
        (safeString(v) ?? "").replace(/\s+/g, ' ').trim().toLowerCase();



      const normalizeExact = (v?: any) =>
        safeString(v).replace(/\s+/g, " ").trim().toLowerCase();

      const jt = normalizeExact(jobTitleSafe);
      const ar = normalizeExact(areaSafe);


      const filtered = users.filter(u => {
        const uj = normalizeExact(u.jobTitle);
        const ua = normalizeExact(u.area);

        const jobOk = !jt || uj === jt;
        const areaOk = !ar || ua === ar;

        const active = u.subscription?.isActive === true;
        const adAllowed =
          u.subscription?.package === "basic" ||
          (u.ad?.status === "approved" && u.ad?.isVisible === true);

        return jobOk && areaOk && active && adAllowed;

      });


      const order = { business: 0, pro: 1, basic: 2 };

      const sorted = filtered.sort((a, b) => {
        const pa = (safeString(a.subscription?.package) || "basic") as keyof typeof order;
        const pb = (safeString(b.subscription?.package) || "basic") as keyof typeof order;
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
        name={safeString(item.name)}
        jobTitle={safeString(item.jobTitle)}
        description={safeString(item.description)}
        phone={item.phone ? safeString(item.phone) : (item.mobile ? safeString(item.mobile) : "")}
        area={safeString(item.area)}
        subscription={item.subscription}
      />
    </View>
  );

  return (


    <View style={styles.wrap}>
      <View style={styles.headerBox}>
        <Icon name="account-search" color="#25D366" size={26} />
        <Text style={styles.pageTitle}>
          نتائج البحث
        </Text>
        {(jobTitleSafe || areaSafe) ? (
          <Text style={styles.subTitle}>
            {jobTitleSafe ? `المهنة: ${jobTitleSafe}` : ''}
            {jobTitleSafe && areaSafe ? ' - ' : ''}
            {areaSafe ? `المنطقة: ${areaSafe}` : ''}
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
          keyExtractor={item => safeString(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>


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
    marginTop: 8,
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