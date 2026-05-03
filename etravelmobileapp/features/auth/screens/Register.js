import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { TextInput, Button, Text, Surface, Avatar } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import styles from "../AuthStyles";
import apis, { endpoints } from "../../../configs/apis";

const Register = ({navigation}) => {
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "username": "",
        "email": "",
        "password": "",
        "confirm": "",
        "role": 'CUSTOMER'
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const updateState = (field, value) => {
        setUser(current => ({...current, [field]: value}));
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setAvatar(result.assets[0]);
        }
    }

    const register = async () => {
        if (!user.first_name || !user.last_name || !user.username || !user.password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (user.password !== user.confirm) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
            return;
        }

        if (!avatar) {
            Alert.alert("Lỗi", "Vui lòng chọn ảnh đại diện (Avatar)!");
        }

        setLoading(true);
        try {
            let form = new FormData();
            form.append('first_name', user.first_name);
            form.append('last_name', user.last_name);
            form.append('username', user.username);
            form.append('password', user.password);
            form.append('email', user.email);
            form.append('role', user.role);

            form.append('avatar', {
                uri: avatar.uri,
                name: 'avatar.jpg',
                type: 'image/jpeg'
            });

            const res = await apis.post(endpoints['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const currentRole = user.role.trim().toUpperCase();

            if (currentRole === 'PROVIDER') {
                Alert.alert("Thành công", "Đăng ký Nhà cung cấp thành công! Vui lòng chờ Admin phê duyệt tài khoản!", [
                    {text: "Đăng nhập ngay", onPress: () => navigation.navigate('Login')}
                ]);
            } else {              
                Alert.alert("Thành công", "Tạo tài khoản thành công!", [
                    {text: "Đăng nhập ngay", onPress: () => navigation.navigate('Login')}
                ]);
            }
        } catch (ex) {
            if (ex.response) {
                console.log("CHI TIẾT LỖI TỪ SERVER:", ex.response.data); 
                Alert.alert("Lỗi Đăng Ký", JSON.stringify(ex.response.data));
            } else {
                console.log("Lỗi kết nối hoặc lỗi khác:", ex.message);
            }
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
                            <TouchableOpacity onPress={pickImage} style={{alignItems: 'center', marginBottom: 20}}>
                                {avatar && avatar.uri ? (
                                    <Image source={{uri: avatar.uri}} style={{width: 90, height: 90, borderRadius: 45}} />
                                ) : (
                                    <Avatar.Icon size={90} icon="camera-plus" style={{backgroundColor: '#e0e0e0'}} />
                                )}
                                <Text style={{marginTop: 8, color: '#666', fontSize: 13}}>Bấm để chọn Avatar</Text>
                            </TouchableOpacity>

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

                            <TextInput 
                                label="Email"
                                value={user.email}
                                onChangeText={v => updateState('email', v)}
                                mode="outlined"
                                style={styles.input}
                                activeOutlineColor="#3b5998"
                                left={<TextInput.Icon icon="email" />}
                                keyboardType="email-address" 
                            />

                            <Text style={{marginTop: 5, marginBottom: 10, fontWeight: 'bold', color: '#333'}}>Bạn là:</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                                <Button
                                    mode={user.role === 'CUSTOMER' ? 'contained' : 'outlined'}
                                    onPress={() => updateState('role', 'CUSTOMER')}
                                    style={{flex: 1, marginRight: 5, borderColor: '#3b5998'}}
                                    buttonColor={user.role === 'CUSTOMER' ? '#3b5998' : 'transparent'}
                                    textColor={user.role === 'CUSTOMER' ? '#fff' : '#3b5998'}
                                >
                                    Khách hàng  
                                </Button>
                                <Button
                                    mode={user.role === 'PROVIDER' ? 'contained' : 'outlined'}
                                    onPress={() => updateState('role', 'PROVIDER')}
                                    style={{flex: 1, marginLeft: 5, borderColor: '#ff9800'}}
                                    buttonColor={user.role === 'PROVIDER' ? '#ff9800' : 'transparent'}
                                    textColor={user.role === 'PROVIDER' ? '#fff' : '#ff9800'}
                                >
                                    Nhà cung cấp  
                                </Button>
                            </View>

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