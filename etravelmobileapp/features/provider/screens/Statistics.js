import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Card, Divider, List, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { authApi, endpoints } from "../../../configs/apis";
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const Statistics = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [serviceType, setServiceType] = useState('tours');
    const currentYear = new Date().getFullYear();

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
                datasets: [{data: revenueArray}]
            });
            console.log("Dữ liệu API trả về:", res.data);

        } catch (ex) {
            console.error(`Lỗi tải thống kê cho ${serviceType}:`, ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [serviceType]);

    if (loading || !stats || !chartData)
        return <ActivityIndicator style={{marginTop: 50}} size="large" color={theme.colors.primary} />;

    return (
            <ScrollView style={{flex: 1, backgroundColor: '#f4f4f8'}} showsVerticalScrollIndicator={false}>
                <View style={{padding: 15, backgroundColor: '#fff', marginBottm: 10}}>
                    <Text variant="titleMedium" style={{fontWeight: 'bold', marginBottom: 10}}>Chọn loại dịch vụ</Text>
                    <SegmentedButtons
                        value={serviceType}
                        onValueChange={setServiceType}
                        buttons={[
                            {value: 'tours', label: 'Tours', icon: 'map-marker-path'},
                            {value: 'hotels', label: 'Khách sạn', icon: 'bed'},
                            {value: 'transports', label: 'Phương tiện', icon: 'car'},
                            {value: 'combos', label: 'Combo', icon: 'package-variant'},
                        ]}
                    />
                </View>

                <View style={{padding: 15, backgroundColor: '#fff', marginBottom: 10}}>
                        <Text variant="titleLarge" style={{fontWeight: 'bold', marginBottom: 15}}>
                            Tổng quan Kinh doanh {currentYear}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Card style={{flex: 1, marginRight: 5, backgroundColor: '#e3f2fd'}}>
                                <Card.Content>
                                    <Text style={{ color: '#1565c0', fontSize: 13 }}>Đơn chờ duyệt</Text>
                                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#0d47a1' }}>
                                        {stats?.new_bookings ?? 0}
                                    </Text>
                                </Card.Content>
                            </Card>
                            <Card style={{ flex: 1, marginLeft: 5, backgroundColor: '#f3e5f5' }}>
                                <Card.Content>
                                    <Text style={{ color: '#6a1b9a', fontSize: 13 }}>Dịch vụ đang mở</Text>
                                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#4a148c' }}>
                                        {stats?.count ?? 0}
                                    </Text>
                                </Card.Content>
                            </Card>
                        </View>
                    </View>

                <View style={{ padding: 15, backgroundColor: '#fff', marginBottom: 10 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>Biểu đồ Doanh thu (VNĐ)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {chartData ? (
                            <BarChart
                                data={chartData}
                                width={screenWidth > 400 ? screenWidth - 30 : 500}
                                height={250}
                                yAxisLabel=""
                                yAxisSuffix=""
                                fromZero={true}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    barPercentage: 0.6,
                                }}
                                style={{ borderRadius: 8 }}
                            />
                        ) : (
                            <View style={{ width: screenWidth - 30, height: 250, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#999' }}>Chưa có dữ liệu biểu đồ</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                <View style={{ padding: 15, backgroundColor: '#fff', paddingBottom: 30 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 10 }}>Hiệu quả từng dịch vụ</Text>
                <Divider style={{ marginBottom: 10 }} />
                    
                {stats?.service_summary && stats?.service_summary?.map((service, index) => (
                    <Card key={index} style={{ marginBottom: 10, elevation: 1, backgroundColor: '#fafafa' }}>
                        <List.Item
                            title={service.name}
                            titleStyle={{ fontWeight: 'bold' }}
                            description={`Khách: ${service.total_customers} | Đơn: ${service.total_bookings}`}
                            right={() => (
                                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 12, color: '#7f8c8d' }}>Doanh thu</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#27ae60' }}>
                                        {(service.total_revenue || 0).toLocaleString('vi-VN')} đ
                                    </Text>
                                </View>
                            )}
                            left={props => <List.Icon {...props} icon="briefcase" color={theme.colors.primary} />}
                        />
                    </Card>
                ))}
                    
                {stats?.service_summary?.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 10 }}>Chưa có dữ liệu dịch vụ</Text>
                )}
            </View>      
        </ScrollView>
    )
};

export default Statistics;