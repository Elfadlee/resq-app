import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

type ProfileBannerProps = {
  profileImage?: string;
  name: string;
  jobTitle: string;
  area: string;
  mobile: string;
  email: string;
  onEditPress?: () => void;


  onLock?: () => void;
};

export default function ProfileBanner({
  profileImage,
  name,
  jobTitle,
  area,
  mobile,
  email,
  onEditPress,
  onLock,
}: ProfileBannerProps) {
  const [locked, setLocked] = useState(false);

  const lockOnce = () => {
    if (locked) return;
    setLocked(true);
    onLock?.(); 
  };

  return (
    <View
      style={styles.container}
      onTouchStart={lockOnce} // 👈 أول لمس = قفل نهائي
    >
      <View style={styles.backgroundDecoration} />

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialCommunityIcons
                  name="account"
                  size={60}
                  color="#2b992dff"
                />
              </View>
            )}
            <View style={styles.onlineIndicator} />
          </View>

          {onEditPress && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={onEditPress}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.jobTitleContainer}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={16}
                color="#2b992dff"
              />
              <Text style={styles.jobTitle}>{jobTitle}</Text>
            </View>
          </View>

          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#2b992dff"
                />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>المنطقة</Text>
                <Text style={styles.contactValue}>{area}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`tel:${mobile}`)}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#2b992dff"
                />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>الجوال</Text>
                <Text style={styles.contactValue}>{mobile}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactItem, styles.contactItemFull]}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            >
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#2b992dff"
                />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
                <Text
                  style={[styles.contactValue, styles.emailText]}
                  numberOfLines={1}
                >
                  {email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:   { width: 0, height:  4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right:  0,
    height:  100,
    backgroundColor:  '#2b992dff',
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imageContainer:  {
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#fff',
  },
  placeholderImage:   {
    width:  110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f2fe75ff',
    justifyContent:   'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor:   '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: '30%',
    backgroundColor: '#2b992dff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform. select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoSection:  {
    gap: 16,
  },
  headerInfo:   {
    alignItems: 'center',
    gap: 8,
    paddingBottom:  16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  name: {
    fontSize:  24,
    fontWeight:  'bold',
    color:  '#1a1a1a',
    textAlign: 'center',
    fontFamily: Platform. OS === 'ios' ? 'System' : 'Roboto',
  },
  jobTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f2fe75ff',
    paddingHorizontal:   16,
    paddingVertical:  6,
    borderRadius:  20,
  },
  jobTitle: {
    fontSize:  15,
    fontWeight:  '600',
    color: '#2b992dff',
  },
  contactGrid:   {
    flexDirection: 'row',
    flexWrap:   'wrap',
    gap:   12,
    marginTop:   8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    gap: 10,
  },
  contactItemFull: {
    minWidth: '100%',
  },
  iconWrapper: {
    width:   40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems:   'center',
    ...Platform. select({
      ios: {
        shadowColor: '#2b992dff',
        shadowOffset:  { width: 0, height:  2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contactTextContainer: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: 11,
    color:  '#888',
    fontWeight:  '500',
  },
  contactValue: {
    fontSize:  14,
    color:   '#1a1a1a',
    fontWeight: '600',
  },
  emailText:   {
    fontSize: 13,
  },
});