import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Divider, IconButton, List, Surface, Text, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import styles from "./ProfileStyles";
import { authApi, endpoints } from "../../configs/apis";

const Profile =({navigation}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
    });

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const pickImage = async () => {
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Thông báo", "Hệ thống cần quyền truy cập ảnh để đổi avatar!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            setUser({...user, avatar: selectedImage.uri});
            setAvatarFile(selectedImage);
        }
    }

    const fetchCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const res = await authApi(token).get(endpoints['current-user']);
            setUser(res.data);
            setFormData({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                username: res.data.username,
                email: res.data.email
            });
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUri = () => {
        if (!user?.avatar) return 'https://via.placeholder.com/120';

        if (user.avatar.startsWith('http')) {
            return `${user.avatar}?t=${new Date().getTime()}`;
        }
        const cloudName = 'dtavh1b38'; 
        return `https://res.cloudinary.com/${cloudName}/${user.avatar}?t=${new Date().getTime()}`;
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            const res = await authApi(token).patch(endpoints['update-user'], formData);

            setUser(res.data);
            setIsEditing(false);
            Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân!");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", 'Không thể cập nhật thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile)
            return;
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            let formData = new FormData()

            formData.append('avatar', {
                uri: avatarFile.uri,
                name: avatarFile.fileName || 'avatar.jpg',
                type: avatarFile.mimeType || 'image/jpeg',
            });

            const res = await authApi(token).patch(endpoints['update-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                Alert.alert("Thành công", "Đã cập nhật avatar định danh!");
                setUser(res.data);
                console.log(res.data.avatar)
                setAvatarFile(null);
            }
        } catch (ex) {
            console.error("Lỗi upload:", ex.response?.data);
            Alert.alert("Lỗi", "Không thể tải ảnh lên server!");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn đăng xuất không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Đăng xuất", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("access-token");
                            await AsyncStorage.removeItem("user"); 
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (e) {
                            console.error("Lỗi đăng xuất:", e);
                        }
                    } 
                }
            ]
        );
    };

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} />;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={isEditing ? pickImage : null} disabled={!isEditing} activeOpacity={0.8}>
                     <View style={styles.avatarWrapper}>
                        <Avatar.Image
                            size={110}
                            source={{ uri: getAvatarUri() }}
                        />
                        {isEditing && (
                            <View style={styles.cameraIconBadge}>
                                <IconButton icon="camera" size={22} iconColor='#088395' style={{ margin: 0 }} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {isEditing && avatarFile && (
                    <Button 
                        mode="contained" 
                        onPress={handleUploadAvatar} 
                        loading={loading}
                        style={{marginTop: 5, marginBottom: 10, borderRadius: 20}}
                        buttonColor="#ffffff"
                        textColor='#088395'
                        icon="upload"
                    >
                        Xác nhận đổi ảnh
                    </Button>
                )}
               
                <Text style={styles.name}>
                    {user?.first_name} {user?.last_name}
                </Text>
                <Text style={styles.email}>@{user?.username}</Text>

                {!isEditing && (
                    <Button 
                        mode="outlined" 
                        textColor="#fff"
                        style={styles.editProfileBtn}
                        onPress={() => setIsEditing(true)} 
                        icon="account-edit"
                    >
                        Chỉnh sửa hồ sơ
                    </Button>
                )}
            </View>

            <View style={styles.formContainer}>
                <Surface style={styles.formCard}>
                    <TextInput
                        label="Tên đăng nhập (Username)"
                        value={formData.username}
                        onChangeText={(t) => setFormData({...formData, username: t})}
                        mode="outlined"
                        disabled={!isEditing}
                        style={styles.input}
                        activeOutlineColor='#088395'
                        outlineColor="transparent"
                        left={<TextInput.Icon icon="account" color={isEditing ? '#088395' : 'gray'} />}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TextInput
                            label="Họ"
                            value={formData.first_name}
                            onChangeText={(t) => setFormData({...formData, first_name: t})}
                            mode="outlined"
                            disabled={!isEditing}
                            style={[styles.input, {width: '48%'}]}
                            activeOutlineColor='#088395'
                            outlineColor="transparent"
                        />
                        <TextInput
                            label="Tên"
                            value={formData.last_name}
                            onChangeText={(t) => setFormData({...formData, last_name: t})}
                            mode="outlined"
                            disabled={!isEditing}
                            style={[styles.input, {width: '48%'}]}
                            activeOutlineColor='#088395'
                            outlineColor="transparent"
                        />
                    </View>  
                    <TextInput
                        label="Email"
                        value={formData.email}
                        onChangeText={(t) => setFormData({...formData, email: t})}
                        mode="outlined"
                        disabled={!isEditing}
                        style={styles.input}
                        activeOutlineColor='#088395'
                        outlineColor="transparent"
                        left={<TextInput.Icon icon="email" color={isEditing ? '#088395' : 'gray'} />}
                    />

                    {isEditing && (
                        <View style={{ marginTop: 10 }}> 
                            <Button 
                                mode="contained" 
                                onPress={handleUpdate} 
                                style={styles.btnSave} 
                                buttonColor='#088395'
                                labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
                                loading={loading}
                            >
                                LƯU THAY ĐỔI
                            </Button>
                            <Button 
                                mode="text" 
                                textColor="#64748B"
                                onPress={() => {
                                    setIsEditing(false);
                                    setAvatarFile(null);
                                }}
                            >
                                Hủy bỏ
                            </Button>
                        </View>
                    )}
                </Surface>

                {!isEditing && (
                    <View style={{ paddingBottom: 40 }}>
                        <Text style={styles.sectionTitle}>
                            Tiện ích của tôi
                        </Text>

                        <List.Item
                            title="Lịch sử đặt chỗ"
                            titleStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                            description="Xem lại các chuyến đi và hóa đơn"
                            left={props => <List.Icon {...props} icon="history" color='#088395' />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#94A3B8" />}
                            onPress={() => navigation.navigate("MyBookings")}
                            style={styles.listItem}
                        />

                        <List.Item
                            title="Đăng xuất"
                            titleStyle={{ color: '#EF4444', fontWeight: 'bold' }} 
                            description="Thoát khỏi tài khoản hiện tại"
                            left={props => <List.Icon {...props} icon="logout" color="#EF4444" />}
                            onPress={handleLogout}
                            style={styles.listItem}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    )
};

export default Profile;