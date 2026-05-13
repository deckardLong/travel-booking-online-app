import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Searchbar, Text, Divider, Icon, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis, { endpoints } from '../../../../configs/apis';
import styles from './ProviderReportListStyles';

const PRIMARY_COLOR = '#088395';

const ProviderReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMyReports = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const response = await apis.get(endpoints['provder-report'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReports(response.data.results || response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách khiếu nại:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchMyReports(); }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyReports();
    };

    const renderItem = ({ item }) => {
        let statusConfig = {
            color: '#F59E0B', 
            label: 'Đang chờ', 
            icon: 'clock-alert-outline',
            bg: '#FFFBEB',
            text: '#B45309',
            note: 'Admin đang xem xét khiếu nại này. Vui lòng chuẩn bị thông tin giải trình.'
        };

        if (item.status === 'RESOLVED') {
            statusConfig = {
                color: '#EF4444', 
                label: 'Đã xử lý', 
                icon: 'alert-octagon',
                bg: '#FEF2F2',
                text: '#991B1B',
                note: 'Báo cáo đã được Admin xác nhận là ĐÚNG. Dịch vụ của bạn có thể bị hạn chế.'
            };
        } else if (item.status === 'DISMISSED') {
            statusConfig = {
                color: '#10B981', 
                label: 'Đã bác bỏ', 
                icon: 'check-decagram-outline',
                bg: '#F0FDF4',
                text: '#166534',
                note: 'Báo cáo sai sự thật đã bị bác bỏ. Dịch vụ của bạn an toàn.'
            };
        }

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                        {item.service_name || `Dịch vụ ID: ${item.service}`}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
                        <Text style={styles.badgeText}>{item.status_display || statusConfig.label}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon source="account-alert-outline" size={16} color="#64748B" />
                    <Text style={[styles.reasonText, { marginLeft: 5, marginBottom: 0 }]}>
                         {item.reason_display}
                    </Text>
                </View>
                
                <Text style={styles.contentText}>"{item.content}"</Text>
                
                <Divider style={styles.divider} />

                {/* NOTE BOX - Giao diện Alert chuyên nghiệp */}
                <View style={[styles.noteBox, { backgroundColor: statusConfig.bg }]}>
                    <Icon source={statusConfig.icon} size={20} color={statusConfig.text} />
                    <Text style={[styles.noteText, { color: statusConfig.text }]}>
                        {statusConfig.note}
                    </Text>
                </View>
            </View>
        );
    };

    const filteredReports = Array.isArray(reports) 
        ? reports.filter(r => {
            const name = r.service_name || `Dịch vụ #${r.service}`; 
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : [];

    return (
        <View style={styles.container}>
            <Surface style={styles.searchContainer} elevation={4}>
                <Searchbar
                    placeholder="Tìm dịch vụ bị báo cáo..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor={PRIMARY_COLOR}
                    placeholderTextColor="#94A3B8"
                    inputStyle={{ fontSize: 15 }}
                />
            </Surface>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredReports}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon source="shield-check-outline" size={80} color="#CBD5E1" />
                            <Text style={styles.emptyText}>
                                Tuyệt vời! Hiện tại không có khiếu nại nào nhắm vào dịch vụ của bạn.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default ProviderReportList;