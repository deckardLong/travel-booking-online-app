import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Avatar, Button, useTheme, Chip, SegmentedButtons, Icon } from 'react-native-paper';
import styles from './ReportListStyles';
import Apis, { endpoints } from '../../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Đổi sang dùng SafeAreaView thay vì useSafeAreaInsets
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#088395';

const ReportList = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    // 2. Mẹo thông minh: Nếu không thể GoBack (quay lại), chắc chắn 100% đang ở Tab dưới đáy!
    const insets = useSafeAreaInsets();
    const isFromTab = !navigation.canGoBack();

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const response = await Apis.get(endpoints['reports'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReports(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Lỗi lấy báo cáo:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách báo cáo!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { 
        setLoading(true);
        fetchReports(); 
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId, newStatus) => {
        const confirmMsg = newStatus === 'RESOLVED' ? "Đánh dấu báo cáo này đã xử lý xong?" : "Bạn có chắc chắn muốn bác bỏ báo cáo này?";
        
        Alert.alert("Xác nhận", confirmMsg, [
            { text: "Hủy", style: "cancel" },
            { text: "Đồng ý", onPress: async () => {
                try {
                    const token = await AsyncStorage.getItem("access-token");
                    const url = `${endpoints['reports']}${reportId}/`; 

                    await Apis.patch(url, { status: newStatus }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
                    Alert.alert('Thành công', "Trạng thái đã được cập nhật.");
                } catch (error) {
                    Alert.alert('Lỗi', "Cập nhật trạng thái thất bại.");
                }
            }}
        ]);
    };

    const handleNavigateDetail = (item) => {
        const serviceId = item.service?.id || item.service;
        const type = item.service_type;
        let screenName = '';
        
        switch (type) {
            case 'tours': screenName = 'AdminTourDetailReport'; break;
            case 'hotels': screenName = 'AdminHotelDetailReport'; break; 
            case 'transports': screenName = 'AdminTransportDetailReport'; break;
            case 'combos': screenName = 'AdminComboDetailReport'; break;
            default: screenName = 'AdminTourDetailReport';
        }

        if (serviceId) {
            navigation.navigate(screenName, { id: serviceId });
        } else {
            Alert.alert("Lỗi", "Không tìm thấy ID của dịch vụ này.");
        }
    };

    const getStatusInfo = (status) => {
        if (status === 'PENDING') return { color: '#F59E0B', label: 'CHỜ XỬ LÝ' };
        if (status === 'RESOLVED') return { color: '#10B981', label: 'ĐÃ XỬ LÝ' };
        return { color: '#EF4444', label: 'ĐÃ BÁC BỎ' };
    };

    const renderReportItem = ({ item }) => {
        const statusInfo = getStatusInfo(item.status);
        const reporter = item.user?.username || 'Ẩn danh';
        const serviceName = item.service?.name || 'Dịch vụ đã bị xóa';
        const formattedDate = item.created_date ? new Date(item.created_date).toLocaleDateString('vi-VN') : '--/--/----';

        return (
            <View style={styles.reportCard}>
                <View style={styles.cardHeader}>
                    <Avatar.Icon size={40} icon="alert-decagram" color="#FFFFFF" backgroundColor={statusInfo.color} />
                    <View style={styles.headerInfo}>
                        <Text style={[styles.reasonText, { color: statusInfo.color }]}>
                            {item.reason_display || item.reason || "Báo cáo vi phạm"}
                        </Text>
                        <Text style={styles.dateText}>Ngày gửi: {formattedDate}</Text>
                    </View>
                    <Chip mode="flat" textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 10 }} style={[styles.statusChip, { backgroundColor: statusInfo.color }]}>
                        {statusInfo.label}
                    </Chip>
                </View>

                <Text style={styles.reportContent}>{item.content || "Không có nội dung mô tả chi tiết."}</Text>

                <View style={styles.targetInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Người gửi: </Text>
                        <Text style={styles.value}>{reporter}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Dịch vụ: </Text>
                        <Text style={styles.value} numberOfLines={1}>{serviceName}</Text>
                    </View>
                </View>

                <View style={styles.cardActions}>
                    <Button 
                        mode="text" 
                        textColor={PRIMARY_COLOR}
                        labelStyle={styles.btnText}
                        icon="eye-outline"
                        onPress={() => handleNavigateDetail(item)}
                    >
                        XEM DỊCH VỤ
                    </Button>

                    {item.status === 'PENDING' && (
                        <>
                            <Button 
                                mode="text" 
                                textColor="#EF4444" 
                                labelStyle={styles.btnText}
                                onPress={() => handleUpdateStatus(item.id, 'DISMISSED')}
                            >
                                BÁC BỎ
                            </Button>
                            <Button 
                                mode="contained" 
                                style={styles.btnApprove}
                                labelStyle={styles.btnText}
                                onPress={() => handleUpdateStatus(item.id, 'RESOLVED')}
                            >
                                ĐÃ XỬ LÝ
                            </Button>
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        // 3. DÙNG SafeAreaView bọc toàn bộ. Thuộc tính edges={['top']} bảo nó chỉ cần chèn lề ở phía trên
        <View style={[styles.container, { backgroundColor: '#F8FAFC', paddingTop: isFromTab ? insets.top : 0 }]}>
            
            {/* 4. Cấp thêm paddingTop 15 để nó có không gian "thở", không bị ôm sát lên mép trên */}
            <View style={{ flex: 1, paddingTop: 15 }}>
                
                {isFromTab && (
                    <Text style={{ 
                        fontSize: 22, 
                        fontWeight: 'bold', 
                        color: '#1E293B', 
                        paddingHorizontal: 15, 
                        marginBottom: 15,
                        textAlign: 'center' // Căn giữa cho đẹp
                    }}>
                        Quản Lý Báo Cáo
                    </Text>
                )}

                <View style={[styles.content, { flex: 1 }]}>
                    <SegmentedButtons
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        buttons={[
                            { value: 'PENDING', label: 'Đang chờ', checkedColor: '#FFFFFF', showSelectedCheck: true },
                            { value: 'RESOLVED', label: 'Đã xong', checkedColor: '#FFFFFF' },
                        ]}
                        theme={{ colors: { secondaryContainer: PRIMARY_COLOR } }}
                        style={styles.segmentedContainer}
                    />

                    {loading ? (
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 50 }} />
                    ) : (
                        <FlatList
                            data={reports.filter(r => r.status === statusFilter)}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderReportItem}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Icon source="clipboard-check-outline" size={60} color="#CBD5E1" />
                                    <Text style={styles.emptyText}>Hiện không có báo cáo nào!</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default ReportList;