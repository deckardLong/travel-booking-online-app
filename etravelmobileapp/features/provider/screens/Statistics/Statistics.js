import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View, RefreshControl } from "react-native";
import { ActivityIndicator, Card, Divider, Icon, List, SegmentedButtons, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from 'react-native-chart-kit';
import { authApi, endpoints } from "../../../../configs/apis";
import styles from "./StatisticsStyles";

const screenWidth = Dimensions.get("window").width;
const PRIMARY_COLOR = '#088395';

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [serviceType, setServiceType] = useState('tours');
    const currentYear = new Date().getFullYear();

    const formatCurrency = (value) => {
        return (value || 0).toLocaleString('vi-VN');
    };

    const loadStats = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const url = `${endpoints['stats'](serviceType)}?year=${currentYear}`;
            const res = await authApi(token).get(url);
            const data = res.data;
            
            setStats(data);

            const revenueArray = new Array(12).fill(0);
            if (data.monthly_chart) {
                data.monthly_chart.forEach(item => {
                    revenueArray[item.month - 1] = item.revenue || 0;
                });
            }

            setChartData({
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{ data: revenueArray }]
            });
        } catch (ex) {
            console.error(`Lỗi thống kê:`, ex);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadStats();
    }, [serviceType]);

    if (loading && !refreshing) 
        return <ActivityIndicator style={styles.loader} size="large" color={PRIMARY_COLOR} />;

    return (
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); loadStats();}} color={PRIMARY_COLOR} />
            }
        >
            {/* BỘ LỌC DỊCH VỤ */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Phân tích theo loại hình</Text>
                <SegmentedButtons
                    value={serviceType}
                    onValueChange={setServiceType}
                    buttons={[
                        { value: 'tours', label: 'Tours', icon: 'map-marker-path' },
                        { value: 'hotels', label: 'Phòng', icon: 'bed-outline' },
                        { value: 'transports', label: 'Xe', icon: 'car-outline' },
                        { value: 'combos', label: 'Combo', icon: 'package-variant' },
                    ]}
                    theme={{ colors: { secondaryContainer: '#E0F2F1', onSecondaryContainer: PRIMARY_COLOR } }}
                />
            </View>

            {/* WIDGETS TỔNG QUAN */}
            <View style={styles.summarySection}>
                <Text style={styles.sectionHeader}>Kết quả kinh doanh {currentYear}</Text>
                <View style={styles.row}>
                    <Card style={[styles.summaryCard, styles.cardPending]}>
                        <Card.Content>
                            <Text style={styles.labelSmall}>Đơn chờ duyệt</Text>
                            <Text style={[styles.valueLarge, { color: '#C2410C' }]}>
                                {stats?.new_bookings ?? 0}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.summaryCard, styles.cardActive]}>
                        <Card.Content>
                            <Text style={styles.labelSmall}>Dịch vụ đang mở</Text>
                            <Text style={[styles.valueLarge, { color: '#15803D' }]}>
                                {stats?.count ?? 0}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>

            {/* BIỂU ĐỒ DOANH THU */}
            <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Biến động doanh thu theo tháng (VNĐ)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {chartData && (
                        <BarChart
                            data={chartData}
                            width={screenWidth > 450 ? screenWidth - 60 : 600}
                            height={240}
                            fromZero={true}
                            chartConfig={{
                                backgroundColor: '#fff',
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(8, 131, 149, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                barPercentage: 0.5,
                                propsForLabels: { fontSize: 10, fontWeight: '600' }
                            }}
                            style={{ borderRadius: 16 }}
                            flatColor={true}
                            showValuesOnTopOfBars={true}
                        />
                    )}
                </ScrollView>
            </View>

            <View style={styles.listSection}>
                <Text style={styles.sectionHeader}>Hiệu quả chi tiết</Text>
                {stats?.service_summary?.map((service, index) => (
                    <Card key={index} style={styles.serviceCard}>
                        <List.Item
                            title={service.name}
                            titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
                            description={
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Icon source="account-group" size={16} color="#64748B" />
                                    <Text style={{ fontSize: 13, color: '#64748B', marginLeft: 4, marginRight: 15 }}>
                                        {service.total_customers} khách
                                    </Text>

                                    <Icon source="clipboard-text-clock" size={16} color="#64748B" />
                                    <Text style={{ fontSize: 13, color: '#64748B', marginLeft: 4 }}>
                                        {service.total_bookings} đơn
                                    </Text>
                                </View>
                            }
                            descriptionStyle={{ fontSize: 12, marginTop: 4 }}
                            right={() => (
                                <View style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
                                    <Text style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase' }}>Doanh thu</Text>
                                    <Text style={styles.revenueText}>
                                        {formatCurrency(service.total_revenue)} đ
                                    </Text>
                                </View>
                            )}
                            left={props => <List.Icon {...props} icon="chart-line-variant" color={PRIMARY_COLOR} />}
                        />
                    </Card>
                ))}
                
                {stats?.service_summary?.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>
                        Chưa có dữ liệu giao dịch cho loại hình này.
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

export default Statistics;