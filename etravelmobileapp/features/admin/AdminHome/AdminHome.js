import React, { useState, useEffect, useCallback } from 'react'; 
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'; 
import { Text, Card, Avatar, IconButton, Surface, useTheme, Divider, List } from 'react-native-paper';
import styles from './AdminHomeStyles';
import Apis, { endpoints } from '../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AdminHome = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);

    const getAvatarUri = () => {
        if (!user?.avatar) return 'https://via.placeholder.com/150';
        if (user.avatar.startsWith('http')) return user.avatar;
        return `https://res.cloudinary.com/dtavh1b38/${user.avatar}`; 
    };

    const fetchStats = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['admin-stats'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("CON SỐ THỰC TẾ TỪ SERVER:", response.data.total_system_revenue);

            setData(response.data);
        } catch (error) {
            console.error("Lỗi lấy thống kê:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const loadFreshData = async () => {
                try {
                    const token = await AsyncStorage.getItem("access-token");
                    if (!token) return;

                    const userRes = await Apis.get(endpoints['current-user'], {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    setUser(userRes.data); 

                    await AsyncStorage.setItem("user", JSON.stringify(userRes.data));

                } catch (ex) {
                    console.error("Lỗi lấy thông tin user mới:", ex);
                    const userStr = await AsyncStorage.getItem("user");
                    if (userStr) setUser(JSON.parse(userStr));
                }
                fetchStats();
            };

            loadFreshData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStats();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const stats = [{ 
            title: 'Đã duyệt', 
            count: data?.total_users || 0, 
            icon: 'account-clock', 
            color: '#FF9800', 
            screen: 'AdminUserList' 
        }, { 
            title: 'Dịch vụ', 
            count: data?.total_active_services || 0, 
            icon: 'map-marker-radius', 
            color: '#2196F3', 
            screen: 'AdminServiceList' 
        }, { 
            title: 'Doanh thu', 
            count: data?.total_system_revenue ? `${(data.total_system_revenue / 1000000).toFixed(1)}M` : '0M', 
            icon: 'chart-line', 
            color: '#4CAF50', 
            screen: 'AdminStatistics' 
        }, { 
            title: 'Báo cáo', 
            count: data?.reports?.pending || 0, 
            icon: 'alert-octagon', 
            color: '#F44336', 
            screen: 'ReportList' 
        },
    ];

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Surface style={styles.header} elevation={1}>
                <View style={styles.userInfo}>
                    <Avatar.Image size={60} source={{ uri: getAvatarUri() }} />
                    <View style={styles.textInfo}>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Chào buổi sáng,</Text>
                        <Text variant="headlineSmall" style={[styles.boldText, { color: theme.colors.onSurface }]}>
                            {user ? `${user.last_name || ''} ${user.first_name || ''}`.trim() || user.username : 'Admin'}
                        </Text>
                    </View>
                </View>
                <IconButton icon="bell-outline" iconColor={theme.colors.primary} onPress={() => {}} />
            </Surface>

            <View style={styles.grid}>
                {stats.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.gridItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content style={styles.cardContent}>
                                <IconButton icon={item.icon} iconColor={item.color} size={30} />
                                <Text variant="headlineSmall" style={[styles.boldText, { color: item.color }]}>
                                    {item.count}
                                </Text>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {item.title}
                                </Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                    Quản lý hệ thống
                </Text>
                <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
                    <List.Item
                        title="Duyệt nhà cung cấp"
                        left={props => <List.Icon {...props} icon="shield-check-outline" color={theme.colors.primary} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.outline} />}
                        onPress={() => navigation.navigate('ApproveProvider')}
                    />
                    <Divider />
                    <List.Item
                        title="Quản lý báo cáo"
                        left={props => <List.Icon {...props} icon="alert-box-outline" color={theme.colors.error} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.outline} />}
                        onPress={() => navigation.navigate('ReportList')}
                    />
                </Card>
            </View>

            <TouchableOpacity 
                style={[styles.logoutBtn, { borderColor: theme.colors.error, marginVertical: 30 }]} 
                onPress={() => navigation.replace('Login')}
            >
                <Text style={[styles.logoutText, { color: theme.colors.error }]}>Đăng xuất hệ thống</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AdminHome;