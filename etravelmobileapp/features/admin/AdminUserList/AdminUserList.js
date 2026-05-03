import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { List, Avatar, Searchbar, IconButton, useTheme, Chip, Text } from 'react-native-paper';
import styles from './AdminUserListStyles'; 
import Apis, { endpoints } from '../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminUserList = () => {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");

            const response = await Apis.get(endpoints['users'], { 
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            // Lấy TẤT CẢ user, không filter gì nữa.
            // Có thể filter bỏ chính tài khoản Admin hiện tại ra nếu muốn: 
            // const allUsers = response.data.filter(u => u.role !== 'ADMIN');
            setUsers(response.data);

        } catch (error) {
            console.error("Lỗi lấy danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchAllUsers(); 
    }, []);

    // Cấu hình giao diện tùy theo Role (Vai trò)
    const renderItem = ({ item }) => {
        // Xác định logic hiển thị thẻ Role
        let roleColor = '#9E9E9E'; // Mặc định xám
        let roleName = 'Khách hàng';

        if (item.role === 'PROVIDER') {
            roleColor = '#FF9800'; // Cam cho Provider
            roleName = 'Nhà cung cấp';
        } else if (item.role === 'ADMIN') {
            roleColor = '#9C27B0'; // Tím cho Admin
            roleName = 'Quản trị viên';
        } else {
            roleColor = '#2196F3'; // Xanh dương cho Customer
        }

        return (
            <List.Item
                title={item.username || item.first_name}
                titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                description={`Email: ${item.email || 'N/A'}\nSĐT: ${item.phone || 'N/A'}`}
                descriptionNumberOfLines={2}
                left={props => <Avatar.Image size={50} style={{ alignSelf: 'center' }} source={{ uri: item.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${item.username}` }} />}
                right={props => (
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        {/* Thẻ phân biệt Role */}
                        <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
                            <Text style={styles.roleBadgeText}>{roleName}</Text>
                        </View>
                        
                        {/* Trạng thái hoạt động (Active/Inactive) */}
                        <Text style={{ fontSize: 12, color: item.is_active ? '#4CAF50' : '#F44336', fontStyle: 'italic' }}>
                            {item.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                        </Text>
                    </View>
                )}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#eee', backgroundColor: '#fff', marginHorizontal: 12, marginTop: 8, borderRadius: 10, paddingVertical: 4 }}
            />
        );
    };

    const filteredUsers = users.filter(u => 
        (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <View style={[styles.container, { backgroundColor: '#f8f9fa' }]}>
            <Searchbar
                placeholder="Tìm tên, email hoặc vai trò..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{ margin: 12, backgroundColor: '#fff', elevation: 2, borderRadius: 12 }}
                iconColor={theme.colors.primary}
            />
            
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : filteredUsers.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ color: '#888', fontStyle: 'italic' }}>Không tìm thấy người dùng nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default AdminUserList;