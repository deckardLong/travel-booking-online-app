import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, Button, IconButton, Searchbar, useTheme, Chip, Surface } from 'react-native-paper';
import styles from './ApproveProviderStyles';
import Apis, { endpoints } from '../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApproveProvider = ({ navigation }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPendingProviders = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['pending-providers'], {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProviders(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            Alert.alert("Lỗi", "Không thể lấy danh sách chờ duyệt!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProviders();
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const url = endpoints['approve-providers'](id);

            await Apis.patch(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProviders(prev => prev.filter(p => p.id.toString() !== id.toString()));
            Alert.alert("Thành công", "Đã duyệt nhà cung cấp này!");
        } catch (error) {
            Alert.alert("Thất bại", "Không thể thực hiện thao tác!");
        }
    };

    const handleReject = async (id) => {
        Alert.alert(
            "Xác nhận từ chối",
            "Tài khoản nhà cung cấp này sẽ bị xóa khỏi hệ thống. Bạn chắc chắn chứ?",
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
                                setProviders(prev => prev.filter(p => p.id.toString() !== id.toString()));
                                Alert.alert("Thông báo", "Đã xóa yêu cầu đăng ký!");
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Lỗi", "Không thể thực hiện thao tác này!");
                        }
                    }
                }
            ]
        );
    };

    const renderProviderItem = ({ item }) => (
        <Card style={[styles.providerCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <Card.Title
                title={item.username} 
                subtitle={item.email}
                left={(props) => <Avatar.Image {...props} source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} size={50} />}
                right={() => <Chip style={styles.typeChip}>{item.provider_type || 'N/A'}</Chip>}
            />
            <Card.Actions style={styles.cardActions}>
                <Button textColor={theme.colors.error} onPress={() => {handleReject(item.id)}}>Từ chối</Button>
                <Button mode="contained" onPress={() => handleApprove(item.id)}>Duyệt ngay</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={[styles.headerSmall, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text variant="titleLarge" style={styles.boldText}>Duyệt Provider Thật</Text>
            </Surface>

            <View style={{ padding: 15, flex: 1 }}>
                <Searchbar
                    placeholder="Tìm theo tên..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 50 }} size="large" color={theme.colors.primary} />
                ) : (
                    <FlatList
                        data={providers.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()))}
                        extraData={providers}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderProviderItem}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text>Hiện không có yêu cầu nào.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

export default ApproveProvider;