import { router, usePathname } from 'expo-router';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';

type Route = {
  key: string;
  title: string; // فقط نص عادي، ليس مكون JSX
  focusedIcon: string;
  unfocusedIcon: string;
  path: string;
};

const ROUTES: Route[] = [
  {
    key: 'profile',
    title: 'صفحتي',
    focusedIcon: 'account',
    unfocusedIcon: 'account-outline',
    path: '/screens/ProfileScreen',
  },
  {
    key: 'notifications',
    title: 'الإشعارات',
    focusedIcon: 'bell',
    unfocusedIcon: 'bell-outline',
    path: '/screens/notifications',
  },
  {
    key: 'orders',
    title: 'طلباتي',
    focusedIcon: 'briefcase',
    unfocusedIcon: 'briefcase-outline',
    path: '/screens/orders',
  },
  {
    key: 'home',
    title: 'الرئيسية',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
    path: '/',
  },
];

const FOOTER_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const AppFooter = () => {
  const theme = useTheme();
  const pathname = usePathname();

  // تحديد الـ index بناءً على المسار الحالي
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

  // تحديث الـ index عند تغيير المسار
  React.useEffect(() => {
    setIndex(getCurrentIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);

    const route = ROUTES[newIndex];
    if (!route) return;

    try {
      if (route.key === 'home') {
        router.push('/');
        return;
      }

      if (route.key === 'profile') {
        router.push('/screens/ProfileScreen');
        return;
      }

      if (route.key === 'orders') {
        router.push('/screens/orders');
        return;
      }

      if (route.key === 'notifications') {
        router.push('/screens/notifications');
        return;
      }
    } catch (error) {
      console.error('Navigation error:', error);
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
            title: route.title, // فقط string
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
        inactiveColor="rgba(255, 255, 255, 0.6)"
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
  },
  bar: {
    height: FOOTER_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Almarai-Bold',
    fontSize: 12,
  },
});

export default React.memo(AppFooter);