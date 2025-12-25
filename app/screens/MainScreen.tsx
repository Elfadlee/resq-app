import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdvertisementBanner from '../components/AdvertisementBanner';
import AppDrawer from '../components/AppDrawer';
import AppFooter from '../components/AppFooter';
import AppHeader from '../components/AppHeader';
import HeroSearch from '../components/HeroSearch';
import ServiceCard from '../components/ServiceCard';

export default function MainScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false); 

  const SERVICES = [
  {
    name: 'محمد الفضلي',
    jobTitle: 'كهربائي',
    description: 'تمديدات كهربائية وصيانة عامة',
    phone: '+964 770 123 4567',
    area: 'كربلاء',
  },
  {
    name: 'خالد حسن',
    jobTitle: 'سباك',
    description: 'تصليح تسريبات وتركيب صحي',
    phone: '+964 771 555 8899',
    area: 'بغداد',
  },
  {
    name: 'علي عباس',
    jobTitle: 'نجار',
    description: 'تفصيل مطابخ وأبواب خشبية',
    phone: '+964 780 222 3344',
    area: 'النجف',
  },
  {
    name: 'حسين كاظم',
    jobTitle: 'دهان',
    description: 'دهانات داخلية وخارجية حديثة',
    phone: '+964 750 998 7766',
    area: 'الحلة',
  },
  {
    name: 'سجاد مهدي',
    jobTitle: 'مبرمج',
    description: 'تطوير مواقع وتطبيقات موبايل',
    phone: '+964 772 444 1100',
    area: 'بغداد',
  },
  {
    name: 'مرتضى علي',
    jobTitle: 'فني تكييف',
    description: 'صيانة وتنظيف أجهزة التبريد',
    phone: '+964 781 333 2211',
    area: 'كربلاء',
  },
];

  

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>

        {/* HEADER */}
        <AppHeader onMenuOpen={() => setDrawerOpen(true)} />

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!scrollLocked}  
        >
          <AdvertisementBanner />

          <HeroSearch
            onSearch={(job, area) => {
              console.log('SEARCH:', job, area);
            }}
          />
       
        

           {SERVICES.map((item, index) => (
            <ServiceCard
              key={index}
              name={item.name}
              jobTitle={item.jobTitle}
              description={item.description}
              phone={item.phone}
              area={item.area}
            />
          ))}
        </ScrollView>

      

        {/* FOOTER */}
        <AppFooter />

        {/* DRAWER */}
        <AppDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={() => setDrawerOpen(false)}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
