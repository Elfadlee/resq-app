import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppleLoginButton from "./AppleLoginButton";

export default function LoginScreen({ onLogin, onGoToRegister, goToProfile, navigation }: any) {


    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [mobileError, setMobileError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [forgotVisible, setForgotVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetError, setResetError] = useState("");

    const handleLogin = () => {
        setMobileError("");
        setPasswordError("");

        if (mobile.length < 10) {
            setMobileError("رقم الجوال يجب أن يكون 10 أرقام");
            return;
        }

        if (password.length < 8) {
            setPasswordError("كلمة المرور يجب أن تكون 8 أحرف أو أكثر");
            return;
        }

        onLogin("+964" + mobile, password, false);
    };

    const handleReset = () => {
        setResetError("");

        if (!resetEmail.includes("@")) {
            setResetError("الرجاء إدخال بريد إلكتروني صحيح");
            return;
        }

        setForgotVisible(false);
        setResetEmail("");
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

                {Platform.OS === "ios" && (
                    <View style={{ marginBottom: 16 }}>
                        <AppleLoginButton
                            // مستخدم جديد → يذهب للتسجيل
                            onSocialLogin={(draft: any) => {
                                onGoToRegister?.({
                                    initialData: draft,
                                    isSocialSignup: true,
                                });
                            }}

                            // مستخدم موجود → يذهب إلى ProfileBanner
                            onGoToProfile={() => goToProfile?.()}
                        />



                    </View>
                )}

                <View style={styles.card}>
                    <MaterialCommunityIcons name="login" size={42} color="#FF9800" />

                    <Text style={styles.title}>تسجيل الدخول</Text>
                    <Text style={styles.subtitle}>أدخل رقم الجوال وكلمة المرور</Text>

                    {/* رقم الجوال */}
                    <Text style={styles.label}>رقم الجوال</Text>

                    <View style={styles.inputWrapper}>
                        {/* نجعل +964 مثبت يسار دائمًا */}
                        <Text style={styles.prefix}>+964</Text>

                        <TextInput
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="number-pad"
                            placeholder="770 123 4567"
                            style={styles.input}
                            textAlign="right"
                        />
                    </View>

                    {mobileError !== "" && <Text style={styles.error}>{mobileError}</Text>}

                    {/* كلمة المرور */}
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
                            style={styles.input}
                            textAlign="right"
                        />
                    </View>

                    {passwordError !== "" && <Text style={styles.error}>{passwordError}</Text>}

                    <TouchableOpacity onPress={() => setForgotVisible(true)} style={styles.forgotButton}>
                        <Text style={styles.forgetText}>نسيت كلمة المرور؟</Text>
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
                <TouchableWithoutFeedback onPress={() => setForgotVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={styles.modalCard}>

                    <MaterialCommunityIcons name="lock-reset" size={40} color="#FF9800" />

                    <Text style={styles.title}>نسيت كلمة المرور</Text>
                    <Text style={styles.subtitle}>أدخل بريدك الإلكتروني لإعادة التعيين</Text>

                    <Text style={styles.label}>البريد الإلكتروني</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={resetEmail}
                            onChangeText={setResetEmail}
                            placeholder="example@email.com"
                            style={styles.input}
                            textAlign="right"
                        />
                    </View>

                    {resetError !== "" && <Text style={styles.error}>{resetError}</Text>}

                    <TouchableOpacity style={styles.primaryBtn} onPress={handleReset}>
                        <MaterialCommunityIcons name="email-send" size={20} color="#fff" />
                        <Text style={styles.primaryText}>إرسال الرابط</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setForgotVisible(false)} style={{ marginTop: 6 }}>
                        <Text style={styles.forgetText}>إغلاق</Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: { flexGrow: 1, padding: 20, justifyContent: "center" },

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
        alignSelf: "center",
        top: "25%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 22,
        width: "85%",
        maxWidth: 420,
        alignItems: "center",
    },
});