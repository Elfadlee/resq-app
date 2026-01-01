import * as React from 'react';
import { View, StyleSheet, StatusBar, Image, Text } from 'react-native';  // لاحظ Text هنا فقط
import { IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onMenuOpen:  () => void;
};

export default function AppHeader({ onMenuOpen }: Props) {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      

      <View style={[
        styles.container,
        { backgroundColor: theme.colors.primary },
      ]}>
        {/* MENU */}
        <IconButton
          icon="menu"
          size={26}
          iconColor={theme.colors.onPrimary}
          onPress={onMenuOpen}
        />
        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
          رزق
        </Text>

        {/* LOGO + TITLE */}
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* BALANCE */}
        <View style={{ width: 48 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 88,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
    width: '100%',
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
    paddingBottom: 10,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  logo: {
    width: 44,
    height: 44,
  },
  title:  {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Almarai-ExtraBold',
  },
});
