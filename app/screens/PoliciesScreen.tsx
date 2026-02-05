import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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

    target.current.measureLayout(scrollRef.current, (_x, y) => {
      scrollRef.current?.scrollTo({ y, animated: true });
    });
  }, [section]);

  const FOOTER_HEIGHT = 120;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: FOOTER_HEIGHT + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>السياسات والشروط</Text>
        <Text style={styles.headerSubtitle}>
          نرجو قراءة سياسة الخصوصية، الشروط والأحكام، وسياسة الاشتراكات بعناية قبل
          استخدام التطبيق.
        </Text>
      </View>

      {/* سياسة الخصوصية */}
      <View ref={privacyRef} style={styles.card}>
        <Text style={styles.title}>سياسة الخصوصية</Text>

        <Text style={styles.paragraph}>
          تحترم منصة «رزق» خصوصية مستخدميها وتلتزم بحماية بياناتهم الشخصية. توضح
          هذه السياسة نوع المعلومات التي نقوم بجمعها، وكيفية استخدامها، وطرق
          حمايتها.
        </Text>

        <Text style={styles.subTitle}>البيانات التي يتم جمعها</Text>
        <Text style={styles.bullet}>• الاسم أو الاسم التجاري.</Text>
        <Text style={styles.bullet}>• رقم الهاتف (للتواصل عبر واتساب عند موافقة المستخدم).</Text>
        <Text style={styles.bullet}>• البريد الإلكتروني.</Text>
        <Text style={styles.bullet}>• المهنة أو الحرفة والمنطقة ووصف الخدمة.</Text>
        <Text style={styles.bullet}>• معلومات تقنية أساسية لتحسين الأداء والأمان.</Text>

        <Text style={styles.subTitle}>استخدام البيانات</Text>
        <Text style={styles.bullet}>• تشغيل الخدمة وعرض الإعلانات داخل التطبيق.</Text>
        <Text style={styles.bullet}>• تحسين تجربة المستخدم وتطوير المنصة.</Text>
        <Text style={styles.bullet}>• التواصل مع المستخدم لأغراض الدعم أو التنبيهات المهمة.</Text>

        <Text style={styles.subTitle}>مشاركة البيانات</Text>
        <Text style={styles.paragraph}>
          لا نقوم ببيع أو مشاركة بيانات المستخدمين مع أي طرف ثالث لأغراض تجارية.
          قد تتم مشاركة بيانات محدودة فقط عند الضرورة لتشغيل الخدمة أو إذا كان ذلك
          مطلوبًا قانونيًا.
        </Text>

        <Text style={styles.subTitle}>الاحتفاظ بالبيانات</Text>
        <Text style={styles.paragraph}>
          يتم الاحتفاظ بالبيانات طالما كان الحساب نشطًا أو حسب الحاجة التشغيلية،
          مع إمكانية طلب حذف البيانات وفق القوانين المعمول بها.
        </Text>

        <Text style={styles.subTitle}>أمان البيانات</Text>
        <Text style={styles.paragraph}>
          نطبق إجراءات أمنية مناسبة لحماية البيانات، مع العلم أنه لا يوجد نظام
          إلكتروني آمن بنسبة 100%.
        </Text>

        <Text style={styles.subTitle}>خصوصية الأطفال</Text>
        <Text style={styles.paragraph}>
          التطبيق غير مخصص للأطفال، ولا نقوم بجمع بيانات عن قصد من أي شخص دون
          السن القانوني.
        </Text>
      </View>

      {/* الشروط والأحكام */}
      <View ref={termsRef} style={styles.card}>
        <Text style={styles.title}>الشروط والأحكام</Text>

        <Text style={styles.paragraph}>
          باستخدامك لتطبيق «رزق»، فإنك توافق على الالتزام بهذه الشروط والأحكام.
        </Text>

        <Text style={styles.subTitle}>طبيعة الخدمة</Text>
        <Text style={styles.paragraph}>
          «رزق» منصة إعلانية فقط، تهدف إلى عرض خدمات أصحاب المهن والحرف وربطهم
          بالعملاء. لا يقدم التطبيق أي ضمانات تتعلق بجودة الخدمات أو نتائج
          التعامل بين الأطراف.
        </Text>

        <Text style={styles.subTitle}>المسؤولية عن النزاعات</Text>
        <Text style={styles.paragraph}>
          التطبيق غير مسؤول عن أي نزاعات أو خلافات أو أضرار قد تحدث بين المشترك
          (صاحب الإعلان) والعميل. تقع المسؤولية الكاملة عن أي تعامل أو اتفاق
          بينهما على عاتق الطرفين فقط.
        </Text>

        <Text style={styles.paragraph}>
          ومع ذلك، يحق لإدارة التطبيق استقبال الشكاوى المتعلقة بأي مشترك يقوم
          بالتلاعب أو الاحتيال على العملاء، واتخاذ الإجراء المناسب بحقه.
        </Text>

        <Text style={styles.subTitle}>إدارة الإعلانات وحق الإلغاء</Text>
        <Text style={styles.bullet}>
          • يحق لإدارة التطبيق رفض أو حذف أي إعلان مخالف للآداب العامة أو القوانين
          أو السياسات.
        </Text>
        <Text style={styles.bullet}>
          • يحق للإدارة تعديل صياغة الإعلان لغويًا دون تغيير المعنى العام.
        </Text>
        <Text style={styles.bullet}>
          • يحق لإدارة التطبيق إلغاء اشتراك أي مشترك يثبت تلاعبه أو إساءته
          للمستخدمين دون تعويض.
        </Text>

        <Text style={styles.subTitle}>الأولوية في الظهور</Text>
        <Text style={styles.paragraph}>
          يعتمد ترتيب وظهور الإعلانات على نوع الاشتراك (أساسي، محترفين، أعمال)
          وحالة الاشتراك، وقد يتم تعديل آلية العرض لتحسين تجربة المستخدم.
        </Text>

        <Text style={styles.subTitle}>القانون المعمول به</Text>
        <Text style={styles.paragraph}>
          تخضع جميع الإعلانات والاستخدامات داخل التطبيق للقانون العراقي، ويتم
          التعامل مع أي مخالفات وفقًا لذلك.
        </Text>
      </View>

      {/* الاشتراكات والدفع */}
      <View ref={subsRef} style={styles.card}>
        <Text style={styles.title}>الاشتراكات والدفع</Text>

        <Text style={styles.paragraph}>
          يوفر تطبيق «رزق» خطط اشتراك مدفوعة يتم تحصيلها حصريًا عبر متجر Apple
          باستخدام حساب Apple ID الخاص بالمستخدم.
        </Text>

        <Text style={styles.subTitle}>أنواع الاشتراكات</Text>
        <Text style={styles.bullet}>• الاشتراك الأساسي.</Text>
        <Text style={styles.bullet}>• اشتراك المحترفين.</Text>
        <Text style={styles.bullet}>• اشتراك الأعمال.</Text>

        <Text style={styles.subTitle}>التجديد التلقائي</Text>
        <Text style={styles.paragraph}>
          يتم تجديد الاشتراك تلقائيًا ما لم يقم المستخدم بإلغائه من إعدادات
          الاشتراكات في حسابه على App Store.
        </Text>

        <Text style={styles.subTitle}>إدارة وإلغاء الاشتراك</Text>
        <Text style={styles.paragraph}>
          يمكن للمستخدم إدارة اشتراكه أو إلغاؤه في أي وقت من خلال إعدادات Apple
          ID. لا يمكن إلغاء الاشتراك من داخل التطبيق نفسه.
        </Text>

        <Text style={styles.subTitle}>استعادة المشتريات</Text>
        <Text style={styles.paragraph}>
          في حال تغيير الجهاز أو إعادة تثبيت التطبيق، يمكن استعادة الاشتراك عبر
          خيار "Restore Purchases".
        </Text>

        <Text style={styles.subTitle}>سياسة الاسترجاع</Text>
        <Text style={styles.paragraph}>
          جميع عمليات الاسترداد أو الإلغاء المالي تخضع لسياسات Apple فقط، ولا
          تتحكم إدارة التطبيق في قرارات الاسترجاع.
        </Text>

        <Text style={styles.subTitle}>انتهاء الاشتراك</Text>
        <Text style={styles.paragraph}>
          عند انتهاء الاشتراك، يتم إيقاف ظهور بيانات المشترك للمستخدمين إلى حين
          تجديد الاشتراك.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          لأي استفسار أو شكوى، يمكنكم التواصل معنا عبر صفحة «تواصل معنا» داخل
          التطبيق.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Almarai-Bold",
    color: theme.colors.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Almarai-Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    fontSize: 18,
    fontFamily: "Almarai-Bold",
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: "right",
  },
  subTitle: {
    fontSize: 14,
    fontFamily: "Almarai-Bold",
    color: "#0B3C5D",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "right",
  },
  paragraph: {
    fontSize: 13.5,
    fontFamily: "Almarai-Regular",
    color: "#334155",
    lineHeight: 22,
    textAlign: "right",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 13.5,
    fontFamily: "Almarai-Regular",
    color: "#334155",
    lineHeight: 22,
    textAlign: "right",
    marginBottom: 6,
  },
  footer: {
    alignItems: "center",
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Almarai-Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
});
