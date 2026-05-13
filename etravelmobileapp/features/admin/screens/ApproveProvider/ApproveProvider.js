import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Alert, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, IconButton, Searchbar, useTheme, Chip, Icon } from 'react-native-paper';
import styles from './ApproveProviderStyles';
import Apis, { endpoints } from '../../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = '#088395';

const ApproveProvider = ({ navigation }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [providers, setProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPendingProviders = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['pending-providers'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProviders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            Alert.alert("Lỗi", "Không thể lấy danh sách chờ duyệt!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchPendingProviders();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPendingProviders();
    }, []);

    const handleApprove = async (id, name) => {
        Alert.alert(
            "Xác nhận duyệt",
            `Cho phép "${name}" trở thành nhà cung cấp chính thức?`,
            [
                { text: "Hủy", style: "cancel" },
                { text: "Duyệt ngay", onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("access-token");
                        const url = endpoints['approve-providers'](id);

                        await Apis.patch(url, {}, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        setProviders(prev => prev.filter(p => p.id !== id));
                        Alert.alert("Thành công", `Đã duyệt nhà cung cấp ${name}!`);
                    } catch (error) {
                        Alert.alert("Thất bại", "Không thể thực hiện thao tác!");
                    }
                }}
            ]
        );
    };

    const handleReject = async (id, name) => {
        Alert.alert(
            "Xác nhận từ chối",
            `Yêu cầu của "${name}" sẽ bị xóa. Bạn chắc chắn chứ?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Từ chối",
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("access-token");
                            const url = endpoints['reject-provider'](id);

                            const res = await Apis.delete(url, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            
                            if (res.status === 204 || res.status === 200) {
                                setProviders(prev => prev.filter(p => p.id !== id));
                                Alert.alert("Thông báo", "Đã xóa yêu cầu đăng ký!");
                            }
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể xóa yêu cầu!");
                        }
                    }
                }
            ]
        );
    };

    const renderProviderItem = ({ item }) => (
        <View style={styles.providerCard}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarBorder}>
                    <Avatar.Image 
                        source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} 
                        size={52} 
                    />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.usernameText}>{item.username}</Text>
                    <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <Chip 
                    mode="flat" 
                    style={styles.typeChip} 
                    textStyle={styles.typeChipText}
                >
                    {item.provider_type?.toUpperCase() || 'GENERAL'}
                </Chip>
            </View>

            <View style={styles.cardActions}>
                <Button 
                    mode="text" 
                    textColor="#EF4444" 
                    style={styles.btnReject}
                    labelStyle={styles.btnLabel}
                    onPress={() => handleReject(item.id, item.username)}
                >
                    TỪ CHỐI
                </Button>
                <Button 
                    mode="contained" 
                    style={styles.btnApprove}
                    labelStyle={styles.btnLabel}
                    icon="check-decagram"
                    onPress={() => handleApprove(item.id, item.username)}
                >
                    DUYỆT NGAY
                </Button>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Section */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm theo tên..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor={PRIMARY_COLOR}
                    inputStyle={{ fontSize: 14 }}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} size="large" color={PRIMARY_COLOR} />
            ) : (
                <FlatList
                    data={providers.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()))}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderProviderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon source="account-search-outline" size={80} color="#CBD5E1" />
                            <Text style={styles.emptyText}>Không có yêu cầu chờ duyệt</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default ApproveProvider;