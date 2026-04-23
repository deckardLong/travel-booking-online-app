import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text, Surface, Avatar } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import styles from "./Styles"; 
import Apis, { endpoints } from "../../configs/Apis";

const Register = ({navigation}) => {
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "username": "",
        "password": "",
        "confirm": ""
    });
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const updateState = (field, value) => {
        setUser(current => ({...current, [field]: value}));
    }

    const register = async () => {
        if (user.password !== user.confirm) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            const res = await Apis.post(endpoints['register'], {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'password': user.password
            });

            Alert.alert("Thành công", "Tạo tài khoản thành công!", [
                {text: "Đăng nhập ngay", onPress: () => navigation.navigate('Login')}
            ]);
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể đăng ký. Tên tài khoản có thể đã tồn tại!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.container}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.header}>
                            <Avatar.Icon size={60} icon="account-plus" style={styles.iconCircle} color="#3b5998" />
                            <Text variant="headlineMedium" style={styles.welcomeText}>Đăng Ký</Text>
                            <Text variant="bodyMedium" style={styles.subText}>Tạo tài khoản để bắt đầu hành trình</Text>
                        </View>

                        <Surface style={styles.surface}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TextInput 
                                    label="Họ"
                                    value={user.last_name}
                                    onChangeText={v => updateState('last_name', v)}
                                    mode="outlined"
                                    style={[styles.input, {flex: 0.45}]}
                                    activeOutlineColor="#3b5998"
                                    
                                />

                                <TextInput 
                                    label="Tên"
                                    value={user.first_name}
                                    onChangeText={v => updateState('first_name', v)}
                                    mode="outlined"
                                    style={[styles.input, {flex: 0.5}]}
                                    activeOutlineColor="#3b5998"                            
                                />
                            </View>

                            <TextInput 
                                label="Tên đăng nhập"
                                value={user.username}
                                onChangeText={v => updateState('username', v)}
                                mode="outlined"
                                style={styles.input}
                                activeOutlineColor="#3b5998"
                                left={<TextInput.Icon icon="account" />}
                            />

                            <TextInput 
                                label="Mật khẩu"
                                value={user.password}
                                onChangeText={v => updateState('password', v)}
                                mode="outlined"
                                style={styles.input}
                                secureTextEntry={secureText}
                                activeOutlineColor="#3b5998"
                                left={<TextInput.Icon icon="lock" />}
                                right={
                                    <TextInput.Icon
                                        icon={secureText ? "eye": "eye-off"}
                                        onPress={() => setSecureText(!secureText)}
                                    />
                                }
                            />

                            <TextInput 
                                label="Xác nhận mật khẩu"
                                value={user.confirm}
                                onChangeText={v => updateState('confirm', v)}
                                mode="outlined"
                                style={styles.input}
                                secureTextEntry={secureText}
                                activeOutlineColor="#3b5998"
                                left={<TextInput.Icon icon="lock-check" />}
                            />

                            <Button
                                mode="contained"
                                onPress={register}
                                loading={loading}
                                disabled={loading}
                                style={styles.loginBtn}
                                contentStyle={styles.loginBtnContent}
                            >
                                ĐĂNG KÝ
                            </Button>

                            <View style={styles.footerLinks}>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
                                </TouchableOpacity>

                            </View>
                        </Surface>

                    </ScrollView>

                </KeyboardAvoidingView>

            </LinearGradient>
    )
};

export default Register;