import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,

  colors: {
    ...MD3LightTheme.colors,

    /* =========================
       Brand Colors
    ========================= */
    primary: '#0B3C5D',        
    onPrimary: '#FFFFFF',

    secondary: '#2B992D',     
    onSecondary: '#FFFFFF',

    /* =========================
       Background & Surface
    ========================= */
    background: '#F7F9FC',
    surface: '#FFFFFF',

    /* =========================
       Text
    ========================= */
    onBackground: '#0F172A',
    onSurface: '#0F172A',

    /* =========================
       States
    ========================= */
    error: '#B91C1C',
  },

  fonts: {
    ...MD3LightTheme.fonts,

    /* =========================
       Arabic – Almarai (Titles)
    ========================= */
    displayLarge: {
      fontFamily: 'Almarai-ExtraBold',
    },
    displayMedium: {
      fontFamily: 'Almarai-Bold',
    },
    displaySmall: {
      fontFamily: 'Almarai-Bold',
    },

    titleLarge: {
      fontFamily: 'Almarai-Bold',
    },
    titleMedium: {
      fontFamily: 'Almarai-Bold',
    },
    titleSmall: {
      fontFamily: 'Almarai-Regular',
    },

    /* =========================
       Arabic – Cairo (Body text)
    ========================= */
    bodyLarge: {
      fontFamily: 'Cairo-Regular',
    },
    bodyMedium: {
      fontFamily: 'Cairo-Regular',
    },
    bodySmall: {
      fontFamily: 'Cairo-Light',
    },

    /* =========================
       Labels / Buttons
    ========================= */
    labelLarge: {
      fontFamily: 'Almarai-Bold',
    },
    labelMedium: {
      fontFamily: 'Almarai-Regular',
    },
    labelSmall: {
      fontFamily: 'Almarai-Regular',
    },
  },
};

export default theme;
