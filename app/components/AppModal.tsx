// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";

// interface AppModalProps {
//   visible: boolean;
//   title: string;
//   message: string;
//   primaryText?: string;
//   secondaryText?: string;
//   onPrimary: () => void;
//   onSecondary?: () => void;
// }

// export default function AppModal({
//   visible,
//   title,
//   message,
//   primaryText = "موافق",
//   secondaryText,
//   onPrimary,
//   onSecondary,
// }: AppModalProps) {
//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="fade"
//       statusBarTranslucent
//     >
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Text style={styles.title}>{title}</Text>

//           <Text style={styles.message}>{message}</Text>

//           <View style={styles.actions}>
//             {secondaryText && onSecondary && (
//               <TouchableOpacity
//                 style={styles.secondaryBtn}
//                 onPress={onSecondary}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.secondaryText}>{secondaryText}</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={onPrimary}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.primaryText}>{primaryText}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     width: "85%",
//     backgroundColor: "#2f2f2f",
//     borderRadius: 18,
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#fff",
//     textAlign: "right",
//     marginBottom: 10,
//   },
//   message: {
//     fontSize: 15,
//     color: "#ddd",
//     textAlign: "right",
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//   },
//   primaryBtn: {
//     backgroundColor: "#c89b3c",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   primaryText: {
//     color: "#000",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   secondaryBtn: {
//     marginRight: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   secondaryText: {
//     color: "#aaa",
//     fontSize: 14,
//   },
// });

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

interface AppModalProps {
  visible: boolean;
  title: string;
  message: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

export default function AppModal({
  visible,
  title,
  message,
  primaryText = "موافق",
  secondaryText,
  onPrimary,
  onSecondary,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* MESSAGE */}
          <Text style={styles.message}>{message}</Text>

          {/* ACTIONS */}
          <View style={styles.actions}>
            {secondaryText && onSecondary && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondary}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryText}>{secondaryText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPrimary}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  title: {
    fontSize: 18,
    fontFamily: "Almarai-Bold",
    color: "#1A202C",
    textAlign: "right",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    fontFamily: "Almarai-Regular",
    color: "#4A5568",
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 22,
  },

  actions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  primaryButton: {
    backgroundColor: "#F6AD55",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  primaryText: {
    fontSize: 14,
    fontFamily: "Almarai-Bold",
    color: "#1A202C",
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  secondaryText: {
    fontSize: 14,
    fontFamily: "Almarai-Regular",
    color: "#718096",
  },
});
