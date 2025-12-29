import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import ContactForm from '../components/ContactForm';
import { restoreUsersToFirestore } from '../components/conllection';

export default function ContactScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B3C5D' }}>

      {/* HEADER */}
      <AppHeader
        onMenuOpen={() => navigation?.('main')}
      />
      restoreUsersToFirestore();

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        <ContactForm />
      </View>

      {/* FOOTER */}
      <View style={{ backgroundColor: '#0B3C5D' }}>
        <AppFooter />
      </View>

    </SafeAreaView>
  );
}
