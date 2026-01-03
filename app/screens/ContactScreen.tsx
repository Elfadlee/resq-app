import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ContactForm from '../components/ContactForm';


export default function ContactScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B3C5D' }}>



      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        <ContactForm />
      </View>

    

    </SafeAreaView>
  );
}
