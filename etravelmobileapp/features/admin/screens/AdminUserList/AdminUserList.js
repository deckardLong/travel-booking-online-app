import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, ScrollView } from 'react-native';
import { Avatar, Searchbar, useTheme, Icon, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './AdminUserListStyles'; 
import Apis, { endpoints } from '../../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = '#088395';

// THAY ĐỔI 2: Thêm prop navigation
const AdminUserList = ({ navigation }) => {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE TÌM KIẾM VÀ LỌC ---
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // THAY ĐỔI 3: Kiểm tra xem đang ở Tab đáy hay ở Stack
    const insets = useSafeAreaInsets();
    const isFromTab = !navigation.canGoBack();

    // Danh sách cấu hình Tabs phân quyền
    const roleTabs = [
        { id: 'ALL', label: 'Tất cả', icon: 'account-group' },
        { id: 'CUSTOMER', label: 'Khách hàng', icon: 'account' },
        { id: 'PROVIDER', label: 'Nhà cung cấp', icon: 'account-tie' },
        { id: 'ADMIN', label: 'Quản trị viên', icon: 'shield-account' },
    ];

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['users'], { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    const getAvatarUrl = (avatarPath, username) => {
        if (!avatarPath) {
            return `https://api.dicebear.com/7.x/initials/png?seed=${username || 'User'}&backgroundColor=088395`;
        }
        if (avatarPath.startsWith('http')) return avatarPath;
        return `https://res.cloudinary.com/dtavh1b38/${avatarPath}`;
    };

    const renderItem = ({ item }) => {
        let roleConfig = { color: '#2196F3', name: 'Khách hàng' };
        if (item.role === 'PROVIDER') roleConfig = { color: '#F59E0B', name: 'Nhà cung cấp' };
        if (item.role === 'ADMIN') roleConfig = { color: '#9C27B0', name: 'Quản trị viên' };

        const statusColor = item.is_active ? '#10B981' : '#EF4444';
        const statusText = item.is_active ? 'Hoạt động' : 'Đã khóa';

        return (
            <View style={styles.userCard}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image 
                        size={54} 
                        source={{ uri: getAvatarUrl(item.avatar, item.username) }} 
                        style={{ backgroundColor: '#E2E8F0' }}
                    />
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        {item.username || `${item.last_name || ''} ${item.first_name || ''}`.trim() || 'Người dùng'}
                    </Text>
                    <Text style={styles.contactText} numberOfLines={1}>
                        <Icon source="email-outline" size={14} color="#94A3B8" /> {item.email || 'Chưa cập nhật'}
                    </Text>
                    <Text style={styles.contactText} numberOfLines={1}>
                        <Icon source="phone-outline" size={14} color="#94A3B8" /> {item.phone || 'Chưa cập nhật'}
                    </Text>
                </View>

                <View style={styles.rightAction}>
                    <View style={[styles.roleBadge, { backgroundColor: roleConfig.color }]}>
                        <Text style={styles.roleBadgeText}>{roleConfig.name}</Text>
                    </View>
                    
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                    </View>
                </View>
            </View>
        );
    };

    // --- LOGIC LỌC DỮ LIỆU ---
    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()));
            
        if (!matchesSearch) return false;

        if (roleFilter !== 'ALL') {
            const isProvider = u.role === 'PROVIDER';
            const isAdmin = u.role === 'ADMIN';
            const isCustomer = !isProvider && !isAdmin;

            if (roleFilter === 'CUSTOMER' && !isCustomer) return false;
            if (roleFilter === 'PROVIDER' && !isProvider) return false;
            if (roleFilter === 'ADMIN' && !isAdmin) return false;
        }

        return true;
    });

    return (
        // THAY ĐỔI 4: Bọc bằng SafeAreaView và cách lề trên tương tự màn Báo cáo
        <View style={[styles.container, { backgroundColor: '#F8FAFC', paddingTop: isFromTab ? insets.top : 0 }]}>
            <View style={{ flex: 1, paddingTop: 15 }}>
                
                {/* HIỂN THỊ TIÊU ĐỀ NẾU MỞ TỪ TAB ĐÁY */}
                {isFromTab && (
                    <Text style={{ 
                        fontSize: 22, 
                        fontWeight: 'bold', 
                        color: '#1E293B', 
                        paddingHorizontal: 15, 
                        marginBottom: 15,
                        textAlign: 'center'
                    }}>
                        Quản Lý Người Dùng
                    </Text>
                )}

                {/* THANH TÌM KIẾM */}
                <View style={styles.searchContainer}>
                    <Searchbar
                        placeholder="Tìm tên, email hoặc vai trò..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        iconColor={PRIMARY_COLOR}
                        inputStyle={{ fontSize: 15 }}
                    />
                </View>

                {/* TAB LỌC PHÂN QUYỀN */}
                <View style={{ paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {roleTabs.map(tab => (
                            <Chip
                                key={tab.id}
                                icon={tab.icon}
                                selected={roleFilter === tab.id}
                                onPress={() => setRoleFilter(tab.id)}
                                style={{ backgroundColor: roleFilter === tab.id ? PRIMARY_COLOR : '#F1F5F9' }}
                                textStyle={{ 
                                    color: roleFilter === tab.id ? '#FFF' : '#475569',
                                    fontWeight: roleFilter === tab.id ? 'bold' : 'normal'
                                }}
                            >
                                {tab.label}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>
                
                {/* DANH SÁCH USER */}
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                ) : filteredUsers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon source="account-search-outline" size={60} color="#CBD5E1" />
                        <Text style={styles.emptyText}>Không tìm thấy người dùng nào.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

export default AdminUserList;