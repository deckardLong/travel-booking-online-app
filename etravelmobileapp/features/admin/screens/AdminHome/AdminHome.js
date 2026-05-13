import React, { useState, useCallback } from 'react'; 
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'; 
import { Text, Card, Avatar, IconButton, Divider, List, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../../../configs/apis';
import styles from './AdminHomeStyles';

const PRIMARY_COLOR = '#088395';

const AdminHome = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState(null);
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    const stats = [
        { 
            title: 'Người dùng', 
            count: data?.total_users || 0, 
            icon: 'account-group-outline', 
            iconColor: '#F59E0B', 
            bgColor: '#FEF3C7', 
            screen: 'AdminUserFromHome' 
        }, { 
            title: 'Dịch vụ', 
            count: data?.total_active_services || 0, 
            icon: 'map-marker-radius-outline', 
            iconColor: PRIMARY_COLOR, 
            bgColor: '#E0F2F1', 
            screen: 'AdminServiceList' 
        }, { 
            title: 'Doanh thu', 
            count: data?.total_system_revenue ? `${(data.total_system_revenue / 1000000).toFixed(1)}M` : '0M', 
            icon: 'chart-line', 
            iconColor: '#10B981', 
            bgColor: '#D1FAE5', 
            screen: 'AdminStatistics' 
        }, { 
            title: 'Báo cáo', 
            count: data?.reports?.pending || 0, 
            icon: 'shield-alert-outline', 
            iconColor: '#EF4444', 
            bgColor: '#FEE2E2', 
            screen: 'ReportListFromHome' 
        },
    ];

    return (
        <ScrollView 
            style={styles.container}
            // Thêm paddingBottom: 20 để nội dung có một khoảng "thở" rất nhỏ ở dưới cùng thay vì dính chặt vào mép hoặc có một khoảng trắng khổng lồ
            contentContainerStyle={{ paddingBottom: 20 }} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} colors={[PRIMARY_COLOR]} />
            }
        >
            <View style={[styles.headerContainer, { paddingTop: insets.top + 15 }]}>
                <View style={styles.headerTop}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarWrapper}>
                        <View style={styles.avatarBorder}>
                            <Avatar.Image 
                                size={70} 
                                source={{ uri: getAvatarUri() }} 
                                style={styles.avatar} 
                            />
                        </View>
                    </View>
                        <View style={styles.textInfo}>
                            <Text style={styles.greeting}>Xin chào,</Text>
                            <Text style={styles.userName}>
                                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Admin'}
                            </Text>
                        </View>
                    </View>
                    <IconButton 
                        icon="bell-ring-outline" 
                        iconColor="#FFFFFF" 
                        size={24} 
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        onPress={() => {}} 
                    />
                </View>
            </View>

            <View style={styles.grid}>
                {stats.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.gridItem}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Card style={styles.statCard}>
                            <Card.Content style={styles.cardContent}>
                                <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                                    <Icon source={item.icon} color={item.iconColor} size={28} />
                                </View>
                                <Text style={styles.statCount}>{item.count}</Text>
                                <Text style={styles.statTitle}>{item.title}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quản lý hệ thống</Text>
                
                <View style={styles.menuCard}>
                    <List.Item
                        title="Duyệt nhà cung cấp"
                        titleStyle={{ fontWeight: '600', color: '#334155' }}
                        left={props => <List.Icon {...props} icon="account-check-outline" color={PRIMARY_COLOR} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color="#CBD5E1" />}
                        onPress={() => navigation.navigate('ApproveProvider')}
                    />
                    <Divider style={{ backgroundColor: '#F1F5F9', marginHorizontal: 15 }} />
                    <List.Item
                        title="Quản lý khiếu nại"
                        titleStyle={{ fontWeight: '600', color: '#334155' }}
                        left={props => <List.Icon {...props} icon="message-alert-outline" color="#F59E0B" />}
                        right={props => <List.Icon {...props} icon="chevron-right" color="#CBD5E1" />}
                        onPress={() => navigation.navigate('ReportListFromHome')}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default AdminHome;