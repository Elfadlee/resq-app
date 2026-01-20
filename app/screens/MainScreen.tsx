import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AdvertisementBanner from "../components/AdvertisementBanner";
import AppDrawer from "../components/AppDrawer";
import HeroSearch from "../components/HeroSearch";
import ServiceCard from "../components/ServiceCard";
import ContactScreen from "../screens/ContactScreen";
import SearchResultsScreen from "../screens/SearchResultsScreen";
import ProfileScreen from "./ProfileScreen";
import { db } from "../services/firestore";
import { onSnapshot, collection } from "firebase/firestore";
import PoliciesScreen from "./PoliciesScreen";


type MainScreenProps = {
  currentScreen: "main" | "contact" | "profile" | "search" | "policies";
  policySection: "privacy" | "terms" | "subscriptions";
  setCurrentScreen: (v: any) => void;
};

export default function MainScreen({
  currentScreen,
  policySection,
  setCurrentScreen,
}: MainScreenProps) {



  const [scrollLocked] = useState(false);
  const [proUsers, setProUsers] = useState<any[]>([]);

  const [searchParams, setSearchParams] = useState({
    jobTitle: "",
    area: "",
  });





  // const SERVICES = [
  //   {
  //     name: "محمد الفضلي",
  //     jobTitle: "كهربائي",
  //     description: "تمديدات كهربائية وصيانة عامة",
  //     phone: "+964 770 123 4567",
  //     area: "كربلاء",
  //   },
  //   {
  //     name: "خالد حسن",
  //     jobTitle: "سباك",
  //     description: "تصليح تسريبات وتركيب صحي",
  //     phone: "+964 771 555 8899",
  //     area: "بغداد",
  //   },
  //   {
  //     name: "علي عباس",
  //     jobTitle: "نجار",
  //     description: "تفصيل مطابخ وأبواب خشبية",
  //     phone: "+964 780 222 3344",
  //     area: "النجف",
  //   },
  //   {
  //     name: "حسين كاظم",
  //     jobTitle: "دهان",
  //     description: "دهانات داخلية وخارجية حديثة",
  //     phone: "+964 750 998 7766",
  //     area: "الحلة",
  //   },
  //   {
  //     name: "سجاد مهدي",
  //     jobTitle: "مبرمج",
  //     description: "تطوير مواقع وتطبيقات موبايل",
  //     phone: "+964 772 444 1100",
  //     area: "بغداد",
  //   },
  //   {
  //     name: "مرتضى علي",
  //     jobTitle: "فني تكييف",
  //     description: "صيانة وتنظيف أجهزة التبريد",
  //     phone: "+964 781 333 2211",
  //     area: "كربلاء",
  //   },
  // ];


  // get users from firestore in real-time
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(db, "users"),
  //     (snapshot) => {
  //       const users: any[] = [];
  //       snapshot.forEach(doc => {
  //         users.push({ id: doc.id, ...doc.data() });
  //       });
  //       setProUsers(users);
  //     },
  //     (error) => {
  //       console.log("Firestore realtime error:", error);
  //     }
  //   );

  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users: any[] = [];

        snapshot.forEach(doc => {
          const u: any = { id: doc.id, ...doc.data() };

          if (
            u.subscription?.isActive === true &&
            u.subscription?.package === "pro" &&
            u.ad?.status === "approved" &&
            u.ad?.isVisible === true
          ) {
            users.push(u);
          }

        });

        setProUsers(users);
      },
      (error) => {
        console.log("Firestore realtime error:", error);
      }
    );

    return () => unsubscribe();
  }, []);


  return (

    <View style={{ flex: 1, backgroundColor: "#F7FAFC" }}>
      <View style={styles.screen}>


        {currentScreen === "contact" && <ContactScreen />}


        {currentScreen === "search" && (
          <SearchResultsScreen
            jobTitle={searchParams.jobTitle}
            area={searchParams.area}
            onBack={() => setCurrentScreen("main")}
          />
        )}


        {currentScreen === "profile" && (
          <ProfileScreen />
        )}


        {currentScreen === "main" && (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!scrollLocked}
          >
            <AdvertisementBanner />

            <HeroSearch
              onSearch={(job, area) => {
                setSearchParams({ jobTitle: job, area });
                setCurrentScreen("search");
              }}
            />

            {proUsers.map((item) => (
              <ServiceCard
                key={item.id}
                name={item.name}
                jobTitle={item.jobTitle}
                description={item.description}
                phone={item.phone || item.mobile}
                area={item.area}
                subscription={item.subscription}
              />
            ))}
          </ScrollView>
        )}

        {currentScreen === "policies" && (
          <PoliciesScreen section={policySection} />
        )}



      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
});