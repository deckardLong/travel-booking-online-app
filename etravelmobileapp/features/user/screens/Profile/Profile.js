import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Divider, IconButton, List, Text, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import styles from "./ProfileStyles";
import { authApi, endpoints } from "../../../../configs/apis";

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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={isEditing ? pickImage : null} disabled={!isEditing}>
                     <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={120}
                            source={{ uri: getAvatarUri() }}
                        />
                        {isEditing && (
                            <View style={styles.cameraIconBadge}>
                                <IconButton icon="camera" size={20} iconColor="#3b5998" />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {isEditing && avatarFile && (
                    <Button 
                        mode="outlined" 
                        onPress={handleUploadAvatar} 
                        loading={loading}
                        style={{marginTop: 10}}
                        icon="upload"
                    >
                        Xác nhận đổi ảnh
                    </Button>
                )}
               
                <Text variant="headlineSmall" style={styles.name}>
                    {user?.first_name} {user?.last_name}
                </Text>
                <Text variant="bodyMedium" style={styles.email}>@{user?.username}</Text>

                {!isEditing && (
                    <Button mode="contained" buttonColor="#fff" textColor="#3b5998"
                        onPress={() => setIsEditing(true)} icon="account-edit">
                        Chỉnh sửa hồ sơ
                    </Button>
                )}
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Tên đăng nhập (Username)"
                    value={formData.username}
                    onChangeText={(t) => setFormData({...formData, username: t})}
                    mode="outlined"
                    disabled={!isEditing}
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput
                        label="Họ"
                        value={formData.first_name}
                        onChangeText={(t) => setFormData({...formData, first_name: t})}
                        mode="outlined"
                        disabled={!isEditing}
                        style={[styles.input, {width: '48%'}]}
                    />
                    <TextInput
                        label="Tên"
                        value={formData.last_name}
                        onChangeText={(t) => setFormData({...formData, last_name: t})}
                        mode="outlined"
                        disabled={!isEditing}
                        style={[styles.input, {width: '48%'}]}
                    />
                </View>  
                <TextInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(t) => setFormData({...formData, email: t})}
                    mode="outlined"
                    disabled={!isEditing}
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                />

                {isEditing && (
                    <View> 
                        <Button mode="contained" onPress={handleUpdate} style={styles.btnSave} loading={loading}>
                            LƯU THAY ĐỔI
                        </Button>
                        <Button mode="text" onPress={() => {
                                setIsEditing(false);
                                setAvatarFile(null);
                            }}
                        >
                            HỦY
                        </Button>
                    </View>
                )}

                {!isEditing && (
                    <View style={{marginTop: 20}}>
                        <Divider style={{marginBottom: 10}} />
                        <Text variant="titleMedium" style={{marginBottom: 10, marginLeft: 10}}>
                            Tiện ích của tôi
                        </Text>

                        <List.Item
                            title="Lịch sử đặt chỗ"
                            description="Xem lại các chuyến đi và hóa đơn"
                            left={props => <List.Icon {...props} icon="history" color="#3b5998" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate("MyBookings")}
                            style={[styles.listItem, {backgroundColor: '#fff', borderRadius: 8}]}
                        />

                        <List.Item
                            title="Đăng xuất"
                            titleStyle={{ color: '#d32f2f', fontWeight: 'bold' }} 
                            description="Thoát khỏi tài khoản hiện tại"
                            left={props => <List.Icon {...props} icon="logout" color="#d32f2f" />}
                            onPress={handleLogout}
                            style={[styles.listItem, { backgroundColor: '#fff', borderRadius: 8 }]}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    )
};

export default Profile;