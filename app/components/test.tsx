const handleSave = async () => {
  // Validation ...
  if (!name.trim()) {
    Alert.alert('خطأ', 'الرجاء إدخال الاسم'); return;
  }
  if (!jobTitle) {
    Alert.alert('خطأ', 'الرجاء اختيار المهنة'); return;
  }
  if (!area) {
    Alert.alert('خطأ', 'الرجاء اختيار المنطقة'); return;
  }
  if (!mobile.trim() || mobile.length < 10) {
    Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف صحيح'); return;
  }
  if (!email.trim() || !email.includes('@')) {
    Alert.alert('خطأ', 'الرجاء إدخال بريد إلكتروني صحيح'); return;
  }
  if (wordCount > 120) {
    Alert.alert('خطأ', `الوصف يحتوي على ${wordCount} كلمة. الحد الأقصى 120 كلمة`); return;
  }

  // ========= SHOW WARNING ALERT =========
  Alert.alert(
    'تنبيه',
    'سيتم تعطيل حسابك لمدة ٤٨ ساعة للمراجعة. إذا وافقت اضغط استمرار. إذا أردت إبقاء معلوماتك القديمة اضغط إلغاء.',
    [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'استمرار',
        style: 'default',
        onPress: async () => {
          setSaving(true);
          const updatedProfile = {
            ...profile,
            name: name.trim(),
            jobTitle,
            area,
            mobile: mobile.startsWith('+964') ? mobile : '+964' + mobile.trim(),
            email: email.trim(),
            description: description.trim(),
            password: password || profile.password,
          };

          try {
            if (profile.id) {
              const userRef = doc(db, "users", profile.id);
              await updateDoc(userRef, {
                name: updatedProfile.name,
                jobTitle: updatedProfile.jobTitle,
                area: updatedProfile.area,
                mobile: updatedProfile.mobile,
                email: updatedProfile.email,
                description: updatedProfile.description,
                password: updatedProfile.password,
                "subscription.isActive": false, // <<<<< ستعطل الحساب هنا
                "metadata.updatedAt": serverTimestamp(),
              });
            }

            // Also update local
            await storage.setObject('userProfile', updatedProfile);
            await storage.setObject('currentUser', updatedProfile);
            const allUsers = await storage.getObject<any[]>('allUsers') || [];
            const userIndex = allUsers.findIndex((u: any) => u.id === profile.id);
            if (userIndex !== -1) {
              allUsers[userIndex] = updatedProfile;
              await storage.setObject('allUsers', allUsers);
            }

            Alert.alert(
              'تم إرسال المعلومات',
              'تم إرسال معلوماتك للمراجعة وسيتم تفعيل الحساب خلال ٤٨ ساعة.',
              [{
                text: 'حسناً',
                onPress: () => {
                  onSave?.();
                  navigation.goBack();
                }
              }]
            );
          } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('خطأ', 'فشل تحديث المعلومات. يرجى المحاولة مرة أخرى.');
          } finally {
            setSaving(false);
          }
        },
      },
    ]
  );
};