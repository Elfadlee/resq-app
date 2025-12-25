import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  name: string;
  jobTitle:  string;
  description: string;
  phone: string;
  area: string;
  onPress?: () => void;
};

export default function ServiceCard({
  name,
  jobTitle,
  description,
  phone,
  area,
  onPress,
}: Props) {
  const theme = useTheme();

  const openWhatsApp = () => {
    const digits = phone. replace(/[^\d+]/g, '').replace(/^\+/, '');
    Linking.openURL(`https://wa.me/${digits}`).catch(() => {});
  };

  return (
    <Card
      mode="elevated"
      elevation={2}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        {/* RIGHT – NAME + JOB */}
        <View style={styles.rightSection}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          
          <View style={styles.jobPill}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {jobTitle}
            </Text>
          </View>
        </View>

        {/* MIDDLE */}
        <View style={styles.middleSection}>
          <Text
            numberOfLines={2}
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {description}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={14} color="#6b7280" />
            <Text numberOfLines={1} style={styles.area}>
                {area}
            </Text>
          </View>

         <View style={styles.infoRow}>
                    <Icon name="whatsapp" size={14} color="#25D366" />
                    <Text
                        numberOfLines={1}
                        style={styles.phoneLink}
                        onPress={openWhatsApp}
                    >
                        {phone}
                    </Text>
                    </View>

        </View>

        {/* LEFT – WHATSAPP */}
     
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal:  16,
    marginVertical: 6,
    borderRadius: 14,
  },

  content: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  /* RIGHT – NAME + JOB */
  rightSection:  {
    minWidth: 90,
    alignItems: 'center',
    justifyContent:  'center',
    gap: 4,
  },
  name: {
    fontFamily: 'Almarai-Bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#1f2937',
  },
  jobPill: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  jobTitle: {
    fontFamily: 'Almarai-Bold',
    fontSize: 12,
    color:  '#fff',
    textAlign:  'center',
  },

  /* MIDDLE */
  middleSection: {
    flex:  1,
    marginHorizontal: 10,
  },
  description: {
    fontFamily: 'Almarai-Regular',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 4,
  },

  infoRow: {
    flexDirection:  'row-reverse',
    alignItems: 'center',
    marginBottom: 3,
    gap: 4,
  },

  area: {
    fontFamily: 'Almarai-Regular',
    fontSize:  11,
    color: '#6b7280',
    textAlign: 'right',
  },

  phone: {
    fontFamily: 'Almarai-Regular',
    fontSize:  11,
    fontWeight:  '600',
    textAlign:  'right',
  },

  phoneLink: {
    fontFamily: 'Almarai-Regular',
    fontSize:  11,
    fontWeight:  '600',
    textAlign:  'right',
    // color: '#25D366',
    color: '#f59e0b',

   
  },

  /* LEFT – WHATSAPP */
  leftSection: {
    width: 36,
    alignItems: 'center',
  },
  whatsappSurface: {
    // backgroundColor:  '#f59e0b',
    backgroundColor: '#25D366',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBtn:  {
    margin: 0,
  },
});