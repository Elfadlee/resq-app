import { Slot } from 'expo-router';
import { I18nManager, Platform, View } from 'react-native';
import { useEffect } from 'react';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import useAppFonts from './theme/useAppFonts';
import theme from './theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';



export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (Platform.OS !== 'web' && !I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

   if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
  <ActivityIndicator size="large" />
</View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
            <Slot />
          </PaperProvider>
    </SafeAreaProvider>
    
   
  );
}
