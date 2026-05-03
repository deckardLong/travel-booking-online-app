import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Text, Surface, IconButton, List, Divider, Avatar } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../../configs/apis';

// BƯỚC QUAN TRỌNG: Import file styles vừa tách ra
import styles from './AdminStatisticsStyles'; 

const screenWidth = Dimensions.get('window').width;

// Cấu hình màu sắc cho Biểu đồ
const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`, 
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "3", stroke: "#2563EB" },
    propsForLabels: { fontSize: 12, fontWeight: '600' }
};

const AdminStatistics = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("access-token");
                const response = await Apis.get(endpoints['admin-stats'], {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Lỗi lấy thống kê chi tiết:", error);
                Alert.alert("Lỗi", "Không thể tải dữ liệu doanh thu.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN') : '0';
    };

    const getPieChartData = () => {
        if (!stats?.service_distribution) return [];
        const dist = stats.service_distribution;
        return [
            { name: 'Tour', count: dist.tours || 0, color: '#3B82F6', legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Khách sạn', count: dist.hotels || 0, color: '#10B981', legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Xe', count: dist.transports || 0, color: '#F59E0B', legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Combo', count: dist.combos || 0, color: '#8B5CF6', legendFontColor: '#475569', legendFontSize: 13 },
        ].filter(item => item.count > 0); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Đang phân tích dữ liệu...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Surface style={styles.header} elevation={4}>
                <View style={styles.headerRow}>
                    <IconButton icon="arrow-left" iconColor="#fff" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Báo Cáo Chiến Lược</Text>
                </View>
            </Surface>

            <View style={styles.content}>
                <Surface style={styles.revenueCard} elevation={6}>
                    <View style={styles.revenueHeader}>
                        <Avatar.Icon size={48} icon="wallet-giftcard" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#fff" />
                        <Text style={styles.revenueLabel}>Doanh thu hệ thống tháng này</Text>
                    </View>
                    <Text style={styles.revenueValue}>
                        {formatCurrency(stats?.total_system_revenue)} <Text style={styles.revenueUnit}>VND</Text>
                    </Text>
                </Surface>

                <Text style={styles.sectionTitle}>Tỷ trọng dịch vụ hệ thống</Text>
                <Surface style={styles.chartCard} elevation={2}>
                    {getPieChartData().length > 0 ? (
                        <PieChart
                            data={getPieChartData()}
                            width={screenWidth - 40}
                            height={180}
                            chartConfig={chartConfig}
                            accessor={"count"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute 
                        />
                    ) : (
                        <Text style={styles.emptyText}>Chưa có dữ liệu phân bổ dịch vụ</Text>
                    )}
                </Surface>

                <Text style={styles.sectionTitle}>Tốc độ tăng trưởng doanh thu</Text>
                <Surface style={styles.chartCard} elevation={2}>
                    {stats?.monthly_chart && stats.monthly_chart.length > 0 ? (
                        <LineChart
                            data={{
                                labels: stats.monthly_chart.map(item => `T${item.month}`),
                                datasets: [{ data: stats.monthly_chart.map(item => item.revenue || 0) }]
                            }}
                            width={screenWidth - 40} 
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.lineChart}
                            withInnerLines={false} 
                        />
                    ) : (
                        <Text style={styles.emptyText}>Chưa có dữ liệu biểu đồ tăng trưởng cho năm nay</Text>
                    )}
                </Surface>

                <Text style={styles.sectionTitle}>Top Dịch vụ đóng góp</Text>
                <Surface style={styles.listCard} elevation={2}>
                    {stats?.service_summary && stats.service_summary.length > 0 ? (
                        stats.service_summary
                            .filter(s => s.total_revenue > 0) 
                            .sort((a, b) => b.total_revenue - a.total_revenue) 
                            .slice(0, 5) 
                            .map((item, index) => (
                                <View key={index}>
                                    <List.Item
                                        title={item.name}
                                        titleStyle={styles.listItemTitle}
                                        description={`${item.total_bookings} lượt đặt`}
                                        left={props => <Avatar.Icon {...props} icon="star-shooting" size={40} style={{ backgroundColor: '#EFF6FF' }} color="#3B82F6" />}
                                        right={() => (
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={styles.revenueGain}>
                                                    +{formatCurrency(item.total_revenue)}đ
                                                </Text>
                                            </View>
                                        )}
                                    />
                                    {index < 4 && <Divider style={{ marginHorizontal: 15 }} />}
                                </View>
                            ))
                    ) : (
                        <Text style={styles.emptyText}>Chưa có dịch vụ nào phát sinh doanh thu</Text>
                    )}
                </Surface>
            </View>
        </ScrollView>
    );
};

export default AdminStatistics;