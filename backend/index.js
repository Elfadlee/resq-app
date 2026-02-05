const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();


exports.onSubscriptionActivated = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!before || !after) return;

    const wasInactive = !before.subscription?.isActive;
    const isActiveNow = after.subscription?.isActive === true;

    if (!wasInactive || !isActiveNow) {
      return;
    }

    const expoPushToken = after.expoPushToken;

    if (!expoPushToken) {
      console.log("⚠️ No expo push token");
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: "🎉 تم تفعيل الاشتراك",
      body: "تم تفعيل باقة الاشتراك الخاصة بك بنجاح",
      data: {
        type: "subscription_activated",
      },
    };

    try {
      await axios.post(
        "https://exp.host/--/api/v2/push/send",
        message,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Push notification sent");
    } catch (error) {
      console.error("❌ Error sending push", error);
    }
  }
);
