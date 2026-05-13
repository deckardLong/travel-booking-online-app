import React, { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Avatar, Card, IconButton, Surface } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Apis, { endpoints } from "../../../../configs/apis";
import styles from "./DashboardStyles"; 

const Dashboard = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [newBookings, setNewBookings] = useState(0);

    const serviceTypes = [
        { key: 'tours', label: 'Tours', icon: 'map-marker-path' },
        { key: 'hotels', label: 'Khách sạn', icon: 'office-building' },
        { key: 'transports', label: 'Xe cộ', icon: 'car-side' },
        { key: 'combos', label: 'Combos', icon: 'package-variant' }
    ];

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('access-token');
            const authHeader = { headers: { Authorization: `Bearer ${token}` } };

            const userRes = await Apis.get(endpoints['current-user'], authHeader);
            setUser(userRes.data);

            const statsResponses = await Promise.all(
                serviceTypes.map(type => Apis.get(endpoints['stats'](type.key), authHeader))
            );

            let tempStats = {};
            let tempTotal = 0;

            statsResponses.forEach((res, index) => {
                const typeKey = serviceTypes[index].key;
                const count = res.data.count || 0;
                tempStats[typeKey] = count;
                tempTotal += count;
            });

            setStats(tempStats);
            setTotal(tempTotal);

            if (statsResponses.length > 0) {
                setNewBookings(statsResponses[0].data.new_bookings || 0);
            }
        } catch (error) {
            console.error("Lỗi tải Dashboard", error);
            Alert.alert("Lỗi", "Không thể cập nhật dữ liệu mới nhất!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getAvatarUri = () => {
        if (!user?.avatar) return 'https://via.placeholder.com/150';
        if (user.avatar.startsWith('http')) return user.avatar;
        return `https://res.cloudinary.com/dtavh1b38/${user.avatar}`;
    };

    const handleLogout = async () => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Đăng xuất", 
                onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
            }
        ]);
    };

    useEffect(() => { loadData(); }, []);

    const renderMenuItem = (title, subtitle, icon, color, screen, isAlert = false, badge = 0) => (
        <Card style={styles.menuCard} onPress={() => navigation.navigate(screen)}>
            <View style={styles.menuContent}>
                <View style={styles.iconWrapper}>
                    <Avatar.Icon size={44} icon={icon} style={{ backgroundColor: color }} color="#fff" />
                    {badge > 0 && <View style={styles.redDot} />}
                </View>
                <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuTitle, isAlert && { color: '#E53935' }]}>{title}</Text>
                    <Text style={styles.menuSubtitle}>{subtitle}</Text>
                </View>
                <IconButton icon="chevron-right" iconColor="#CBD5E1" />
            </View>
        </Card>
    );

    if (loading) return <ActivityIndicator size="large" color="#088395" style={styles.loader} />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={() => { setRefreshing(true); loadData(); }} 
                    colors={['#088395']}
                />
            }
        >
            <LinearGradient colors={['#088395', '#00B8A9']} style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.avatarBorder}>
                        <Avatar.Image size={65} source={{ uri: getAvatarUri() }} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.welcome}>Chào mừng đối tác,</Text>
                        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
                    </View>
                    <IconButton icon="logout-variant" iconColor="#fff" size={26} onPress={handleLogout} />
                </View>
            </LinearGradient>

            <View style={styles.summaryContainer}>
                <Surface style={styles.totalCard} elevation={4}>
                    <View style={styles.decorCircle} />
                    
                    <View>
                        <Text style={styles.totalLabel}>Dịch vụ đang vận hành</Text>
                        
                        <View style={styles.totalValueContainer}>
                            <Text style={styles.totalValue}>{total}</Text>
                            <Text style={styles.unitText}>hệ thống</Text>
                        </View>
                        <View style={styles.statusActiveContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusTextLabel}>Đang hoạt động tốt</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor: '#088395', padding: 15, borderRadius: 20}}>
                        <IconButton 
                            icon="rocket-launch" 
                            size={30} 
                            iconColor="#fff" 
                            style={{margin: 0}} 
                        />
                    </View>
                </Surface>
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Quản lý kinh doanh</Text>
                
                {renderMenuItem("Đăng dịch vụ mới", "Mở rộng quy mô kinh doanh", "plus", "#4CAF50", 'ServiceForm')}
                {renderMenuItem("Đơn hàng mới", "Theo dõi yêu cầu khách hàng", "bell", "#fd9f23", 'MyBookings', false, newBookings)}
                {renderMenuItem("Báo cáo doanh thu", "Thống kê chi tiết tài chính", "chart-bar", "#2196F3", 'Statistics')}
                {renderMenuItem("Đánh giá từ khách", "Phản hồi & nâng cao chất lượng", "star", "#f1c40f", 'ReviewManager')}
                {renderMenuItem("Lịch sử khiếu nại", "Giải quyết vấn đề khách hàng", "shield-alert", "#E53935", 'ProviderReportList', true)}
            </View>
        </ScrollView>
    );
};

export default Dashboard;