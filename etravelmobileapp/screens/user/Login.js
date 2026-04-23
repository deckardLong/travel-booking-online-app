import { useState } from "react"
import Apis, { endpoints } from "../../configs/Apis";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Avatar } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import styles from "./Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!username || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);

        const details = {
            'username': username,
            'password': password,
            'client_id': 'TIv2Ik5iHSxeel7j4t7uRBlDgUSmx7kaxlNSVOTu',
            'client_secret': 'VhTyGMfRRLxyQdzn55TgMnKatVX6otFoHQaCA96tzC5oB5LcVktYG0MvKMEjGWNtKGbBafAJiLX0MCEUqK8UvqTJoSahTXLY0zZfuH9tgP3GQChyy2qmO6B196NhR3cw', 
            'grant_type': 'password'
        };

        const formBody = Object.keys(details).map(key => 
            encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
        ).join('&');

        try {
            const res = await Apis.post(endpoints['login'], formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const token = res.data.access_token;

            if (token) {
                await AsyncStorage.setItem("access-token", token);
            }

            Alert.alert("Thành công", "Đã đăng nhập!", [
                {text: "OK", onPress: () => navigation.navigate('Home')}
            ]);
        } catch (ex) {
            console.error(ex.response.data);
            Alert.alert("Lỗi", "Sai tài khoản hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

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
                        <Avatar.Icon size={80} icon="airplane-takeoff" style={styles.iconCircle} color="#3b5998" />
                        <Text variant="headlineMedium" style={styles.welcomeText}>E-Travel App</Text>
                        <Text variant="bodyMedium" style={styles.subText}>Khám phá thế giới cùng chúng tôi</Text>
                    </View>

                    <Surface style={styles.surface} elevation={4}>
                        <TextInput 
                            label="Tên đăng nhập"
                            value={username}
                            onChangeText={setUsername}
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor="#3b5998"
                            left={<TextInput.Icon icon="account" />}
                        />

                        <TextInput 
                            label="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
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

                        <Button
                            mode="contained"
                            onPress={login}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginBtn}
                            contentStyle={styles.loginBtnContent}
                        >
                            ĐĂNG NHẬP
                        </Button>

                        <View style={styles.footerLinks}>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.linkText}>Chưa có tài khoản?</Text>
                            </TouchableOpacity>

                        </View>
                    </Surface>

                </ScrollView>

            </KeyboardAvoidingView>

        </LinearGradient>
    )
};

export default Login;