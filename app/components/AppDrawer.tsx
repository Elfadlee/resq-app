import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import { List } from 'react-native-paper';
import theme from '../theme/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string, section?: "privacy" | "terms" | "subscriptions") => void;
};

const ITEMS = [
  { label: 'الرئيسية', route: 'main', icon: 'home-outline' },

  { label: 'صفحتي', route: 'profile', icon: 'account-outline' },

  { label: 'سياسة الخصوصية', route: 'policies', section: 'privacy', icon: 'shield-lock-outline' },
  { label: 'الشروط والأحكام', route: 'policies', section: 'terms', icon: 'file-document-outline' },
  { label: 'الاشتراكات والدفع', route: 'policies', section: 'subscriptions', icon: 'credit-card-outline' },

  { label: 'تواصل معنا', route: 'contact', icon: 'email-outline' },
];


export default function AppDrawer({ visible, onClose, onNavigate }: Props) {
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateX, {
        toValue: 0,
        damping: 18,
        stiffness: 120,
        mass: 0.9,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateX, {
        toValue: DRAWER_WIDTH,
        damping: 18,
        stiffness: 120,
        mass: 0.9,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);




  return (
    // <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
    <View style={styles.container}>

      {/* OVERLAY */}
      <TouchableWithoutFeedback disabled={!visible} onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: translateX.interpolate({
                inputRange: [0, DRAWER_WIDTH],
                outputRange: [1, 0],
              }),
              pointerEvents: visible ? 'auto' : 'none',
            },
          ]}
        />
      </TouchableWithoutFeedback>


      {/* DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX }] },
        ]}
      >
        {ITEMS.map((item) => (
          <TouchableOpacity
            // key={item.route}
            key={`${item.route}-${item.section ?? 'main'}`}
            style={styles.item}
            onPress={() => {
              onNavigate(item.route, item.section as any);
              onClose();
            }}
          >
            <List.Icon icon={item.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#c4cbc9ff',
    paddingTop: 64,

    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,

    elevation: 14,
  },

  item: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 16,
    marginEnd: 12,
    color: theme.colors.primary,
    fontFamily: 'Almarai-Regular',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

});
