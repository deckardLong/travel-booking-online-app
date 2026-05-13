import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Text, Surface, List, Divider, Avatar, Icon, Button } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../../../configs/apis';
import styles from './AdminStatisticsStyles'; 

const screenWidth = Dimensions.get('window').width;
const PRIMARY_COLOR = '#088395';

// Thiết lập màu LineChart mượt mà hơn, bỏ lưới dọc rườm rà
const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(8, 131, 149, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, 
    style: { borderRadius: 24 },
    propsForDots: { r: "5", strokeWidth: "3", stroke: "#FFFFFF" }, // Dấu chấm trắng viền xanh
    propsForLabels: { fontSize: 11, fontWeight: '600' },
    fillShadowGradient: PRIMARY_COLOR,
    fillShadowGradientOpacity: 0.2, // Hiệu ứng gradient dưới đường line
};

const AdminStatistics = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleExportReport = () => {
        Alert.alert(
            "Xuất Báo Cáo",
            "Bạn muốn xuất dữ liệu thống kê dưới định dạng nào?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xuất Excel (.xlsx)", 
                    onPress: () => Alert.alert("Đang xử lý", "Hệ thống đang trích xuất dữ liệu ra file Excel...") 
                },
                { 
                    text: "Xuất PDF", 
                    onPress: () => Alert.alert("Đang xử lý", "Hệ thống đang tạo bản in PDF...") 
                }
            ]
        );
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("access-token");
                const response = await Apis.get(endpoints['admin-stats'], {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("===== KIỂM TRA DỮ LIỆU THỐNG KÊ =====");
                console.log("1. Toàn bộ Data:", JSON.stringify(response.data, null, 2));
                console.log("2. Biểu đồ tháng (monthly_chart):", response.data.monthly_chart);
                console.log("3. Danh sách dịch vụ (service_summary):", response.data.service_summary);
                console.log("4. Phân bổ (service_distribution):", response.data.service_distribution);
                console.log("=====================================");
                setStats(response.data);
            } catch (error) {
                console.error("Lỗi lấy thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN') : '0';
    };

    const formatYLabel = (y) => {
        const num = Number(y);
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'Tr';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return y;
    };

    const getPieChartData = () => {
        if (!stats?.service_distribution) return [];
        const dist = stats.service_distribution;
        return [
            { name: 'Tour', count: dist.tours || 0, color: PRIMARY_COLOR, legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Khách sạn', count: dist.hotels || 0, color: '#10B981', legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Xe', count: dist.transports || 0, color: '#F59E0B', legendFontColor: '#475569', legendFontSize: 13 },
            { name: 'Combo', count: dist.combos || 0, color: '#6366F1', legendFontColor: '#475569', legendFontSize: 13 },
        ].filter(item => item.count > 0); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Đang tổng hợp báo cáo...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.actionRow}>
                    <Text style={styles.pageTitle}>Tổng quan</Text>
                    <Button 
                        mode="outlined" 
                        icon="file-download-outline" 
                        textColor={PRIMARY_COLOR}
                        style={styles.exportBtn}
                        labelStyle={styles.exportBtnLabel}
                        onPress={handleExportReport}
                        rippleColor="rgba(8, 131, 149, 0.1)"
                    >
                        XUẤT FILE
                    </Button>
                </View>
                
                {/* --- CARD DOANH THU CHÍNH --- */}
                <View style={styles.revenueCard}>
                    <View style={styles.revenueHeader}>
                        <View style={styles.iconWrap}>
                            <Icon source="finance" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.revenueLabel}>Doanh thu tháng này</Text>
                    </View>
                    <Text style={styles.revenueValue} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(stats?.total_system_revenue)} <Text style={styles.revenueUnit}>VNĐ</Text>
                    </Text>
                </View>

                {/* --- TỶ TRỌNG DỊCH VỤ --- */}
                <View style={styles.sectionHeader}>
                    <Icon source="chart-pie" size={22} color={PRIMARY_COLOR} />
                    <Text style={styles.sectionTitle}>Tỷ trọng dịch vụ</Text>
                </View>
                <Surface style={[styles.baseCard, styles.chartCenter]}>
                    {getPieChartData().length > 0 ? (
                        <PieChart
                            data={getPieChartData()}
                            width={screenWidth - 40}
                            height={150}
                            chartConfig={chartConfig}
                            accessor={"count"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            center={[10, 0]}
                            absolute 
                        />
                    ) : (
                        <View style={styles.emptyStateBox}>
                            <Icon source="chart-donut-variant" size={50} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Chưa có đủ số liệu thống kê tỷ trọng</Text>
                        </View>
                    )}
                </Surface>

                {/* --- BIỂU ĐỒ TĂNG TRƯỞNG --- */}
                <View style={styles.sectionHeader}>
                    <Icon source="trending-up" size={22} color={PRIMARY_COLOR} />
                    <Text style={styles.sectionTitle}>Tốc độ tăng trưởng</Text>
                </View>
                <Surface style={[styles.baseCard, styles.chartCenter, { paddingHorizontal: 0 }]}>
                    {stats?.monthly_chart && stats.monthly_chart.length > 0 ? (
                        <LineChart
                            data={{
                                labels: stats.monthly_chart.map(item => `T${item.month}`),
                                datasets: [{ data: stats.monthly_chart.map(item => item.revenue || 0) }]
                            }}
                            width={screenWidth - 50} 
                            height={220}
                            chartConfig={chartConfig}
                            formatYLabel={formatYLabel}
                            bezier
                            withVerticalLines={false} // Bỏ lưới dọc cho giao diện clean
                            withHorizontalLines={true}
                            style={{ paddingRight: 30, marginTop: 10 }} 
                        />
                    ) : (
                        <View style={styles.emptyStateBox}>
                            <Icon source="chart-line-stacked" size={50} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Chưa có biểu đồ doanh thu cho năm nay</Text>
                        </View>
                    )}
                </Surface>

                {/* --- BẢNG XẾP HẠNG TOP DỊCH VỤ --- */}
                <View style={styles.sectionHeader}>
                    <Icon source="trophy-award" size={22} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Top Dịch vụ đóng góp</Text>
                </View>
                <Surface style={styles.listCard}>
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
                                        description={`${item.total_bookings} lượt đặt thành công`}
                                        descriptionStyle={{ color: '#64748B', marginTop: 2 }}
                                        left={props => (
                                            <Avatar.Text 
                                                {...props} 
                                                label={`#${index + 1}`} 
                                                size={42} 
                                                style={{ backgroundColor: index === 0 ? '#FEF3C7' : '#F1F5F9', marginLeft: 10 }} 
                                                color={index === 0 ? '#D97706' : '#64748B'} 
                                            />
                                        )}
                                        right={() => (
                                            <View style={{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: 15 }}>
                                                <Text style={styles.revenueGain}>
                                                    {formatYLabel(item.total_revenue)}đ
                                                </Text>
                                            </View>
                                        )}
                                    />
                                    {index < 4 && <Divider style={{ backgroundColor: '#F1F5F9', marginHorizontal: 20 }} />}
                                </View>
                            ))
                    ) : (
                        <View style={styles.emptyStateBox}>
                            <Icon source="medal-outline" size={50} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Chưa có dịch vụ nào lọt top doanh thu</Text>
                        </View>
                    )}
                </Surface>

            </View>
        </ScrollView>
    );
};

export default AdminStatistics;