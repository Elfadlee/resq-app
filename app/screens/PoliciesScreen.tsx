import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import theme from "../theme/theme";

type Props = {
  section?: "privacy" | "terms" | "subscriptions";
};

export default function PoliciesScreen({ section }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const privacyRef = useRef<View>(null);
  const termsRef = useRef<View>(null);
  const subsRef = useRef<View>(null);

  useEffect(() => {
    if (!section) return;

    const map: any = {
      privacy: privacyRef,
      terms: termsRef,
      subscriptions: subsRef,
    };

    const target = map[section];
    if (!target?.current || !scrollRef.current) return;

    target.current.measureLayout(
      scrollRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ y, animated: true });
      }
    );
  }, [section]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >

      {/* سياسة الخصوصية */}
      <View ref={privacyRef} style={styles.section}>
        <Text style={styles.title}>سياسة الخصوصية</Text>
        <Text style={styles.text}>
          نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. يتم جمع
          المعلومات مثل الاسم، رقم الهاتف، والبريد الإلكتروني فقط
          لأغراض تشغيل الخدمة وتحسين تجربة المستخدم.
        </Text>
        <Text style={styles.text}>
          لا يتم مشاركة بياناتك مع أي طرف ثالث إلا إذا كان ذلك
          ضروريًا لتشغيل الخدمة أو مطلوبًا قانونيًا.
        </Text>
      </View>

      {/* الشروط والأحكام */}
      <View ref={termsRef} style={styles.section}>
        <Text style={styles.title}>الشروط والأحكام</Text>
        <Text style={styles.text}>
          باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بجميع
          الشروط والأحكام المذكورة هنا.
        </Text>
        <Text style={styles.text}>
          يحق لإدارة التطبيق تعليق أو إيقاف الحساب في حال إساءة
          الاستخدام أو مخالفة السياسات.
        </Text>
      </View>

      {/* الاشتراكات والدفع */}
      <View ref={subsRef} style={styles.section}>
        <Text style={styles.title}>الاشتراكات والدفع</Text>
        <Text style={styles.text}>
          يوفر التطبيق خطط اشتراك مدفوعة يتم تحصيلها عبر متجر Apple.
        </Text>
        <Text style={styles.text}>
          يتم تجديد الاشتراك تلقائيًا ما لم يقم المستخدم بإلغائه من
          إعدادات حسابه في App Store.
        </Text>
        <Text style={styles.text}>
          يمكن استعادة الاشتراك من خلال خيار "Restore Purchases".
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "Almarai-Bold",
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: "right",
  },
  text: {
    fontSize: 15,
    fontFamily: "Almarai-Regular",
    color: "#333",
    lineHeight: 24,
    textAlign: "right",
    marginBottom: 10,
  },
});
