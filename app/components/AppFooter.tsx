import { router } from 'expo-router';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
};

const ROUTES: Route[] = [
  {
    key: 'profile',
    title: 'صفحتي',
    focusedIcon: 'account',
    unfocusedIcon: 'account-outline',
  },
  {
    key: 'notifications',
    title: 'الإشعارات',
    focusedIcon: 'bell',
    unfocusedIcon: 'bell-outline',
  },
  {
    key: 'orders',
    title: 'طلباتي',
    focusedIcon: 'briefcase',
    unfocusedIcon: 'briefcase-outline',
  },
  {
    key: 'home',
    title: 'الرئيسية',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
  },
];

const FOOTER_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const AppFooter = () => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(3);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);

    const routeKey = ROUTES[newIndex]?.key;
    if (!routeKey) return;

    // Expo Router navigation (NO design change)
    if (routeKey === 'home') {
      router.replace('/');
      return;
    }

    if (routeKey === 'profile') {

      router.push('/screens/ProfileScreen');
      return;
    }


    if (routeKey === 'orders') {
      router.push('/screens/orders');
      return;
    }

    if (routeKey === 'notifications') {
      router.push('/screens/notifications');
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
        navigationState={{ index, routes: ROUTES }}
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
