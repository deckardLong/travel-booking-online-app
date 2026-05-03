import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../../configs/apis";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import styles from "../styles";
import { ActivityIndicator, Avatar, Button, Card, IconButton, Surface } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const Dashboard = ({navigation}) => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [newBookings, setNewBookings] = useState(0);

    const serviceTypes = ['tours', 'hotels', 'transports', 'combos'];

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('access-token');
            const authHeader = {headers: {Authorization: `Bearer ${token}`}};

            const userRes = await Apis.get(endpoints['current-user'], authHeader);
            setUser(userRes.data);

            const statsResponses = await Promise.all(
                serviceTypes.map(type => Apis.get(endpoints['stats'](type), authHeader))
            );

            let tempStats = {};
            let tempTotal = 0;

            statsResponses.forEach((res, index) => {
                const type = serviceTypes[index];
                const count = res.data.count || 0;
                tempStats[type] = count;
                tempTotal += count;
            });

            setStats(tempStats);
            setTotal(tempTotal);

            if (statsResponses.length > 0) {
                setNewBookings(statsResponses[0].data.new_bookings || 0);
            }
        } catch (error) {
            console.error("Lỗi tải Dashboard", error);
            Alert.alert("Lỗi", "Không thể lấy dữ liệu từ hệ thống!");
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
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
        });
    }

    const handleTestChat = () => {
        const testProvider = { 
            id: 6, 
            username: 'provider06', 
            avatar: 'https://i.pravatar.cc/150?img=11' 
        };

        const testCustomer = { 
            id: 10, 
            username: 'customer01', 
            avatar: 'https://i.pravatar.cc/150?img=12' 
        };
        navigation.navigate('ChatProvider', {
            currentUser: testProvider,
            chatUser: testCustomer
        });
    };

    useEffect(() => {loadData(); }, []);

    if (loading) 
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); loadData();}} />}
        >
            <LinearGradient colors={['#2c3e50', '#000000']} style={styles.header}>
                <View style={styles.headerRow}>
                    <Avatar.Image size={60} source={user?.avatar ? {uri: getAvatarUri()} : {uri: 'https://via.placeholder.com/150'}} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.welcome}>Xin chào,</Text>
                        <Text style={styles.name}>{user?.last_name} {user?.first_name}</Text>
                    </View>

                    <IconButton
                        icon="logout"
                        iconColor="#fff"
                        size={26}
                        onPress={() => handleLogout()}
                        style={{marginLeft: 'auto'}}
                    />
                </View>
            </LinearGradient>

            <View style={styles.summaryContainer}>
                <Surface style={styles.totalCard} elevation={4}>
                    <Text style={styles.totalLabel}>Tổng dịch vụ đang chạy</Text>
                    <Text style={styles.totalValue}>{total}</Text>
                </Surface>
            </View>

            <View style={styles.grid}>
                {serviceTypes.map((type) => (
                    <Surface key={type} style={styles.gridItem} elevation={1}>
                        <IconButton
                            icon={type === 'tours' ? 'map-check' : type === 'hotels' ? 'office-building' : type === 'transports' ? 'car-side' : 'package-variant'}
                            size={24}
                        />
                        <Text style={styles.gridValue}>{stats[type] || 0}</Text>
                        <Text style={styles.gridLabel}>{type.toUpperCase()}</Text>
                    </Surface>
                ))}
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
                <Card style={styles.menuCard} onPress={() => navigation.navigate('ServiceForm')}>
                    <Card.Title
                        title="Đăng dịch vụ mới"
                        left={(props) => <Avatar.Icon {...props} icon="plus" style={{backgroundColor: "#4CAF50"}} />}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>

                <Card style={styles.menuCard} onPress={() => navigation.navigate('ServiceList')}>
                    <Card.Title
                        title="Dịch vụ của tôi"
                        left={(props) => <Avatar.Icon {...props} icon="format-list-bulleted" />}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
                
                <Card style={styles.menuCard} onPress={() => navigation.navigate('MyBookings')}>
                    <Card.Title
                        title="Đơn hàng mới"
                        left={(props) => (
                            <View>
                                <Avatar.Icon {...props} icon="bell" style={{backgroundColor: "#fd9f23"}} />
                                {newBookings > 0 && <View style={styles.redDot} />}
                            </View>
                        )}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>
                <Card 
                    style={{ marginBottom: 15, elevation: 3 }} 
                    onPress={() => navigation.navigate('Statistics')} 
                >
                    <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar.Icon size={50} icon="chart-bar" style={{ backgroundColor: '#4caf50' }} />
                        <View style={{ marginLeft: 15 }}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Báo cáo Thống kê</Text>
                            <Text style={{ color: '#7f8c8d' }}>Xem doanh thu và lượt đặt</Text>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.menuCard} onPress={() => navigation.navigate('ReviewManager')}>
                    <Card.Title
                        title="Các đánh giá về dịch vụ của tôi"
                        left={(props) => <Avatar.Icon {...props} icon="star-circle" backgroundColor="#f1c40f" />}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>

                <Card style={styles.menuCard} onPress={() => navigation.navigate('ProviderReportList')}>
                    <Card.Title
                        title="Lịch sử bị khiếu nại"
                        titleStyle={{ color: '#E53935', fontWeight: 'bold' }} 
                        subtitle="Xem các báo cáo từ Khách hàng"
                        subtitleStyle={{ fontSize: 12 }}
                        left={(props) => (
                            <View>
                                <Avatar.Icon {...props} icon="shield-alert-outline" style={{backgroundColor: "#E53935"}} />

                            </View>
                        )}
                        right={(props) => <IconButton {...props} icon="chevron-right" iconColor="#E53935" />}
                    />
                </Card>
                
            </View>
            
            <Button 
                mode="contained" 
                buttonColor="#ff5252"
                icon="chat-alert"
                style={{ marginVertical: 20 }}
                onPress={handleTestChat}
            >
                Test Chat Realtime
            </Button>
        </ScrollView>
    )
};

export default Dashboard;