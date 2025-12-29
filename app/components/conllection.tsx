import { collection, doc, setDoc } from "firebase/firestore";
import storage from "../services/storage-helper";
import { db } from "../services/firestore";

export const restoreUsersToFirestore = async () => {
  try {
    const allUsers = await storage.getObject<any[]>("allUsers");

    if (!allUsers || allUsers.length === 0) {
      alert("ما في بيانات محفوظة محليًا لإسترجاعها");
      return;
    }

    for (const user of allUsers) {
      await setDoc(doc(db, "users", user.id), {
        ...user,
        metadata: {
          ...user.metadata,
        }
      });
    }

    alert("👌 تم استرجاع المستخدمين إلى Firestore بنجاح");
  } catch (e) {
    console.log(e);
    alert("خطأ أثناء إعادة رفع البيانات");
  }
};
