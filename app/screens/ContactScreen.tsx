import React from 'react';
import { ScrollView, View } from 'react-native';
import ContactForm from '../components/ContactForm'; // أو المسار الملائم

export default function ContactScreen({ navigation }: any) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
      <View style={{ flex: 1 }}>
        <ContactForm />
      </View>
    </ScrollView>
  );
}