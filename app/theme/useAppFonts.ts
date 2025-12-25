import { useFonts } from 'expo-font';

export default function useAppFonts() {
  const [fontsLoaded] = useFonts({
    /* =======================
       Almarai
    ======================= */
    'Almarai-Regular': require('../../assets/fonts/Almarai/Almarai-Regular.ttf'),
    'Almarai-Bold': require('../../assets/fonts/Almarai/Almarai-Bold.ttf'),
    'Almarai-Light': require('../../assets/fonts/Almarai/Almarai-Light.ttf'),
    'Almarai-ExtraBold': require('../../assets/fonts/Almarai/Almarai-ExtraBold.ttf'),

    /* =======================
       Cairo
    ======================= */
    'Cairo-Regular': require('../../assets/fonts/Cairo/Cairo-Regular.ttf'),
    'Cairo-Light': require('../../assets/fonts/Cairo/Cairo-Light.ttf'),
    'Cairo-ExtraLight': require('../../assets/fonts/Cairo/Cairo-ExtraLight.ttf'),
    'Cairo-Medium': require('../../assets/fonts/Cairo/Cairo-Medium.ttf'),
    'Cairo-SemiBold': require('../../assets/fonts/Cairo/Cairo-SemiBold.ttf'),
    'Cairo-Bold': require('../../assets/fonts/Cairo/Cairo-Bold.ttf'),
    'Cairo-ExtraBold': require('../../assets/fonts/Cairo/Cairo-ExtraBold.ttf'),
    'Cairo-Black': require('../../assets/fonts/Cairo/Cairo-Black.ttf'),

    /* =======================
       Oswald (EN / Numbers)
    ======================= */
    'Oswald-Regular': require('../../assets/fonts/Oswald/Oswald-Regular.ttf'),
    'Oswald-Light': require('../../assets/fonts/Oswald/Oswald-Light.ttf'),
    'Oswald-ExtraLight': require('../../assets/fonts/Oswald/Oswald-ExtraLight.ttf'),
    'Oswald-Medium': require('../../assets/fonts/Oswald/Oswald-Medium.ttf'),
    'Oswald-SemiBold': require('../../assets/fonts/Oswald/Oswald-SemiBold.ttf'),
    'Oswald-Bold': require('../../assets/fonts/Oswald/Oswald-Bold.ttf'),
  });

  return fontsLoaded;
}
