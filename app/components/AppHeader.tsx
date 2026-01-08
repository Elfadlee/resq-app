import * as React from 'react';
import { View, StyleSheet, StatusBar, Image, Text, Platform } from 'react-native';  // لاحظ Text هنا فقط
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type Props = {
  onMenuOpen:  () => void;
};

export default function AppHeader({ onMenuOpen }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();


  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      

      <View style={[
        styles.container,
        { backgroundColor: theme.colors.primary,
          paddingTop: Platform.OS === 'ios' ? insets.top - 15 : 4

         },
      ]}>
        {/* MENU */}
        <IconButton
          icon="menu"
          size={32}
          iconColor={theme.colors.onPrimary}
          onPress={onMenuOpen}
        />
        {/* <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
           منصة رزق
        </Text> */}

        {/* LOGO + TITLE */}
        
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
      
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
    display: 'flex',
    marginBottom: -10,
    marginTop: 10,
    
  },


  logo: {
    width: 230,
    height: 230,
    alignItems: 'center',
    marginTop: 20,
    marginRight: 20,
    
  },
  // title:  {
  //   flex: 1,
  //   textAlign: 'center',
  //   fontSize: 25,
  //   fontFamily: 'Almarai-ExtraBold',
  //   marginRight: 8,
  //   marginTop: 10,
  // },
});
