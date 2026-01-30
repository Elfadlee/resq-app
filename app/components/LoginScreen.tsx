import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firestore";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import {  Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { auth } from "../services/firestore";
import storage from "../services/storage-helper";
import AppleLoginButton from "./AppleLoginButton";





interface LoginScreenProps {
    onLogin?: (mobile: string, password: string, isSocial: boolean) => void;
    onGoToRegister?: (data?: any) => void;
    goToProfile?: (user: any) => void;
    navigation?: { navigate: (screen: string) => void };
}

export default function LoginScreen({ onLogin, onGoToRegister, goToProfile, navigation }: LoginScreenProps) {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [forgotVisible, setForgotVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetError, setResetError] = useState("");


    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");

        const emailValue = email.trim();
        const pass = password;

        if (!emailValue || !emailValue.includes("@")) {
            setEmailError("الرجاء إدخال بريد إلكتروني صحيح");
            return;
        }

        if (pass.length < 8) {
            setPasswordError("كلمة المرور يجب أن تكون 8 أحرف أو أكثر");
            return;
        }

        try {
            const cred = await signInWithEmailAndPassword(
                auth,
                emailValue,
                pass
            );
            const userRef = doc(db, "users", cred.user.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                await signOut(auth); // 🔒 تنظيف الجلسة
                setPasswordError("لا يوجد حساب مسجل بهذا البريد");
                return; // ⬅️ يبقى في صفحة اللوقن
            }


            const userData = {
                id: snap.id,
                uid: snap.id,
                ...snap.data(),
            };

            await storage.setObject("currentUser", userData);
            goToProfile?.(userData);


        } catch (error: any) {
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                setPasswordError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
            } else if (error.code === "auth/invalid-email") {
                setEmailError("البريد الإلكتروني غير صالح");
            } else {
                setPasswordError("حدث خطأ أثناء تسجيل الدخول");
            }
        }
    };



    const handleReset = async () => {
        setResetError("");

        if (!resetEmail || !resetEmail.includes("@")) {
            setResetError("الرجاء إدخال بريد إلكتروني صحيح");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, resetEmail.trim());

            alert(
                "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.\n\nيرجى التحقق من مجلد الرسائل غير المرغوب فيها (Junk / Spam) في حال لم يظهر في صندوق الوارد."
            );

            setForgotVisible(false);
            setResetEmail("");

        } catch (error: any) {
            console.log("RESET ERROR:", error);

            if (error.code === "auth/user-not-found") {
                setResetError("هذا البريد غير مسجل لدينا");
            } else if (error.code === "auth/invalid-email") {
                setResetError("البريد الإلكتروني غير صالح");
            } else {
                setResetError("حدث خطأ، حاول مرة أخرى");
            }
        }
    };


    return (

        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {Platform.OS === "ios" && (
                    <View style={{ marginBottom: 16 }}>
                        <AppleLoginButton
                            onSocialLogin={(draft) => {
                                onGoToRegister?.({
                                    initialData: draft,
                                    isSocialSignup: true,
                                });
                            }}
                            onGoToProfile={goToProfile}
                        />
                    </View>
                )}
                <View style={styles.card}>
                    <MaterialCommunityIcons name="login" size={42} color="#FF9800" />
                    <Text style={styles.title}>تسجيل الدخول</Text>
                    <Text style={styles.subtitle}>أدخل البريد الإلكتروني وكلمة المرور</Text>
                    {/* رقم الجوال */}

                    <Text style={styles.label}>البريد الإلكتروني</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholder="example@email.com"
                            placeholderTextColor="#999"
                            style={styles.input}
                            textAlign="right"
                            autoCapitalize="none"
                        />
                    </View>

                    {emailError !== "" && <Text style={styles.error}>{emailError}</Text>}



                    <Text style={styles.label}>كلمة المرور</Text>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eye}
                        >
                            <MaterialCommunityIcons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#777"
                            />
                        </TouchableOpacity>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="أدخل كلمة المرور"
                            placeholderTextColor="#999"
                            style={styles.input}
                            textAlign="right"
                        />
                    </View>
                    {passwordError !== "" && <Text style={styles.error}>{passwordError}</Text>}

                    <TouchableOpacity
                        onPress={() => setForgotVisible(true)}
                        style={[styles.forgotButton, { alignSelf: "flex-start" }]}
                    >

                        <Text style={styles.forgetText}>نسيت كلمة المرور ؟</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                        <MaterialCommunityIcons name="login" size={20} color="#fff" />
                        <Text style={styles.primaryText}>دخول</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={onGoToRegister}>
                        <MaterialCommunityIcons name="account-plus" size={20} color="#FF9800" />
                        <Text style={styles.secondaryText}>إنشاء حساب جديد</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* Forgot Password Modal */}

            <Modal
                visible={forgotVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setForgotVisible(false)}
            >
                {/* Overlay */}
                <TouchableWithoutFeedback onPress={() => setForgotVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                {/* Modal Card */}
                <View style={styles.modalCard}>
                    <MaterialCommunityIcons
                        name="lock-reset"
                        size={40}
                        color="#FF9800"
                    />

                    <Text style={styles.title}>نسيت كلمة المرور</Text>

                    <Text
                        style={[
                            styles.subtitle,
                            { textAlign: "right", writingDirection: "rtl" },
                        ]}
                    >
                        أدخل بريدك الإلكتروني لإعادة التعيين
                    </Text>

                    <Text style={styles.label}>البريد الإلكتروني</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={resetEmail}
                            onChangeText={setResetEmail}
                            placeholder="example@email.com"
                            placeholderTextColor="#999"
                            style={styles.input}
                            textAlign="right"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {resetError !== "" && (
                        <Text style={styles.error}>{resetError}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={handleReset}
                        activeOpacity={0.8}
                    >

                        <Text style={styles.primaryText}>إرسال الرابط</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setForgotVisible(false)}
                        style={styles.closeBtn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.closeText}>إغلاق</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


        </View>

    );
}



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 20,
        paddingBottom: 90,
    },



    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 22,
        alignItems: "center",
        elevation: 3,
    },

    title: { fontFamily: "Almarai", fontSize: 18, color: "#FF9800", marginTop: 6, marginBottom: 15 },
    subtitle: { fontFamily: "Almarai", fontSize: 12, color: "#666", marginBottom: 14 },

    label: { fontFamily: "Almarai", fontSize: 13, color: "#333", alignSelf: "flex-end", marginBottom: 10, marginTop: 8 },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
        paddingHorizontal: 10,
        marginTop: 4,
        marginBottom: 6,
        minHeight: 48,
    },

    input: {
        flex: 1,
        fontFamily: "Almarai",
        fontSize: 14,
        color: "#222",
    },

    prefix: {
        fontFamily: "Almarai",
        fontSize: 14,
        color: "#777",
        marginRight: 8,
    },

    eye: { paddingHorizontal: 6 },

    error: {
        fontFamily: "Almarai",
        fontSize: 12,
        color: "red",
        alignSelf: "flex-end",
    },

    forgotButton: { alignSelf: "flex-end", marginTop: 2 },

    forgetText: {
        fontFamily: "Almarai",
        fontSize: 12,
        color: "#FF9800",
        marginTop: 6,
        marginBottom: 6,
    },

    primaryBtn: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF9800",
        borderRadius: 12,
        paddingVertical: 14,
        width: "100%",
        marginTop: 10,
    },

    primaryText: {
        fontFamily: "Almarai",
        fontSize: 15,
        color: "#fff",

    },

    secondaryBtn: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FF9800",
        borderRadius: 12,
        paddingVertical: 14,
        width: "100%",
        marginTop: 10,
    },

    secondaryText: {
        fontFamily: "Almarai",
        fontSize: 15,
        color: "#FF9800",
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    modalCard: {
        position: "absolute",
        top: "30%",
        alignSelf: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 22,
        width: "85%",
        maxWidth: 420,
        alignItems: "center",
        gap: 12,
        elevation: 6,
    },
    closeBtn: {
        marginTop: 14,
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
    },

    closeText: {
        fontFamily: "Almarai",
        fontSize: 13,
        color: "#FF9800",
    },
});