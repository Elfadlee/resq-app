

import { router, usePathname } from 'expo-router';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import theme from '../theme/theme';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
  path: string;
};

const ROUTES: Route[] = [

  // {
  //   key: 'notifications',
  //   title: 'الإشعارات',
  //   focusedIcon: 'bell',
  //   unfocusedIcon: 'bell-outline',
  //   path: '/screens/notifications',
  // },
  {
    key: 'contact',
    title: 'تواصل معنا',
    focusedIcon: 'email',
    unfocusedIcon: 'email-outline',
    path: '/screens/contact',
  },
  {
    key: 'profile',
    title: 'صفحتي',
    focusedIcon: 'account',
    unfocusedIcon: 'account-outline',

    path: '/screens/ProfileScreen',
  },
  {
    key: 'home',
    title: 'الرئيسية',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',


    path: '/',
  },
];

const FOOTER_HEIGHT = Platform.OS === 'ios' ? 120 : 85;

const AppFooter = ({ setCurrentScreen }: { setCurrentScreen: (v: any) => void }) => {
  const theme = useTheme();
  const pathname = usePathname();

  const getCurrentIndex = () => {
    const currentRoute = ROUTES.findIndex(route => {
      if (route.path === '/') {
        return pathname === '/' || pathname === '/screens/MainScreen';
      }
      return pathname.includes(route.path);
    });
    return currentRoute >= 0 ? currentRoute : 3;
  };

  const [index, setIndex] = React.useState(getCurrentIndex());

  React.useEffect(() => {
    setIndex(getCurrentIndex());
  }, [pathname]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);

    const route = ROUTES[newIndex];
    if (!route) return;

    // 🔹 نبدّل الشاشة داخل MainScreen بدل router.push
    if (route.key === "home") {
      setCurrentScreen("main");
      return;
    }

    if (route.key === "profile") {
      setCurrentScreen("profile");
      return;
    }

    if (route.key === "contact") {
      setCurrentScreen("contact"); // لو عندك شاشة طلباتي
      return;
    }

    if (route.key === "notifications") {
      setCurrentScreen("notifications");
      return;
    }
  };


  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          height: FOOTER_HEIGHT,
        },
      ]}
    >
      <BottomNavigation
        navigationState={{
          index,
          routes: ROUTES.map(route => ({
            key: route.key,
            title: route.title,
            focusedIcon: route.focusedIcon,
            unfocusedIcon: route.unfocusedIcon,
          })),
        }}
        onIndexChange={handleIndexChange}
        renderScene={() => null}
        shifting={false}
        labeled
        barStyle={[styles.bar, { backgroundColor: theme.colors.primary }]}
        activeColor="#f59e0b"
        inactiveColor={theme.colors.onPrimary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    elevation: 12,
    paddingTop: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    width: '100%',
  },
  bar: {
    height: FOOTER_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Almarai-Bold',
    fontSize: 12,
    color: theme.colors.onPrimary,
  },
});

export default React.memo(AppFooter);
