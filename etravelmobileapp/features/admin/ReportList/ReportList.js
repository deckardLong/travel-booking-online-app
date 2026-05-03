import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Card, Avatar, Button, IconButton, useTheme, Chip, Surface, SegmentedButtons } from 'react-native-paper';
import styles from './ReportListStyles';
import Apis, { endpoints } from '../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportList = ({ navigation }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['reports'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReports(response.data);
        } catch (error) {
            console.error("Lỗi lấy báo cáo:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách báo cáo!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const url = endpoints['report-detail'](reportId); 

            await Apis.patch(url, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setReports(prev => prev.map(r => 
                r.id === reportId ? { ...r, status: newStatus } : r
            ));
            
            Alert.alert('Thành công', `Báo cáo đã được chuyển sang: ${newStatus}`);
        } catch (error) {
            Alert.alert('Lỗi', "Không thể cập nhật trạng thái báo cáo!");
        }
    };

    const handleNavigateDetail = (item) => {
        const serviceId = item.service?.id || item.service; 
        const type = item.service_type; 

        let screenName = '';
        switch (type) {
            case 'tours': screenName = 'TourDetail'; break;
            case 'hotels': screenName = 'HotelDetail'; break;
            case 'transports': screenName = 'TransportDetail'; break;
            case 'combos': screenName = 'ComboDetail'; break;
            default: screenName = 'TourDetail'; 
        }

        if (serviceId) {
            navigation.navigate(screenName, { id: serviceId });
        } else {
            console.error("Không tìm thấy ID dịch vụ để điều hướng!");
        }
    };

    const getReasonColor = (reason) => {
        switch (reason) {
            case 'SCAM': return '#F44336'; 
            case 'INCORRECT_INFO': return '#FF9800'; 
            default: return '#757575';
        }
    };

    const renderReportItem = ({ item }) => (
        <Card style={styles.providerCard} elevation={2}>
            <Card.Title
                title={`Báo cáo: ${item.reason_display || item.reason}`}
                titleStyle={[styles.boldText, { color: getReasonColor(item.reason) }]}
                subtitle={`Từ: ${item.user.username}Về: ${item.service.name}`}
                left={(props) => <Avatar.Icon {...props} icon="alert-outline" backgroundColor={getReasonColor(item.reason)} />}
            />
            <Card.Content>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>{item.content}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="labelSmall">Ngày gửi: {new Date(item.created_date).toLocaleDateString()}</Text>
                    <Chip mode="outlined" selectedColor={item.status === 'PENDING' ? 'red' : 'green'} style={{ height: 30 }} >
                        {item.status}
                    </Chip>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button 
                    mode="text" 
                    onPress={() => handleNavigateDetail(item)}
                >
                    Xem {item.service_type === 'tours' ? 'Tour' : 
                        item.service_type === 'hotels' ? 'Khách sạn' : 
                        item.service_type === 'transports' ? 'Xe' : 'Combo'}
                </Button>
                {item.status === 'PENDING' && (
                    <>
                        <Button textColor={theme.colors.error} onPress={() => handleUpdateStatus(item.id, 'DISMISSED')}>
                            Bác bỏ
                        </Button>
                        <Button mode="contained" onPress={() => handleUpdateStatus(item.id, 'RESOLVED')}>
                            Đã Xử Lý
                        </Button>
                    </>
                )}
            </Card.Actions>
        </Card>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.headerSmall} elevation={1}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text variant="titleLarge" style={styles.boldText}>Quản Lý Báo Cáo</Text>
            </Surface>

            <View style={{ padding: 15, flex: 1 }}>
                <SegmentedButtons
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    buttons={[
                        { value: 'PENDING', label: 'Đang chờ' },
                        { value: 'RESOLVED', label: 'Đã xong' },
                    ]}
                    style={{ marginBottom: 15 }}
                />

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={Array.isArray(reports) ? reports.filter(r => r.status === statusFilter) : []}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderReportItem}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchReports} />}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>Không có báo cáo nào!</Text>}
                    />
                )}
            </View>
        </View>
    );
};

export default ReportList;