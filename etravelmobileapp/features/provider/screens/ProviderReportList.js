import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Searchbar, useTheme, Text, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis, { endpoints } from '../../../configs/apis';
import styles from './ProviderReportListStyles';

const ProviderReportList = () => {
    const theme = useTheme();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMyReports = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");
            const response = await apis.get(endpoints['provder-report'], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("=== API RESPONSE ===", response.data);

            setReports(response.data.results || response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách khiếu nại:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyReports(); }, []);

    const renderItem = ({ item }) => {
        let statusColor = '#FF9800'; 
        if (item.status === 'RESOLVED') statusColor = '#4CAF50'; 
        if (item.status === 'DISMISSED') statusColor = '#9E9E9E'; 

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>
                        {item.service_name || `Dịch vụ ID: ${item.service}`}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: statusColor }]}>
                        <Text style={styles.badgeText}>{item.status_display || item.status}</Text>
                    </View>
                </View>

                <Text style={styles.reasonText}>
                    Khách báo cáo: {item.reason_display}
                </Text>
                
                <Text style={styles.contentText}>
                    "{item.content}"
                </Text>
                
                <Divider style={styles.divider} />
                {item.status === 'PENDING' && (
                    <Text style={styles.notePending}>
                        * Admin đang xem xét khiếu nại này. Vui lòng chuẩn bị thông tin giải trình nếu Admin liên hệ.
                    </Text>
                )}
                {item.status === 'RESOLVED' && (
                    <Text style={styles.noteResolved}>
                        * Báo cáo đã được Admin xác nhận là ĐÚNG. Dịch vụ của bạn có thể bị giới hạn hiển thị.
                    </Text>
                )}
                {item.status === 'DISMISSED' && (
                    <Text style={styles.noteDismissed}>
                        * Báo cáo sai sự thật và đã bị Admin bác bỏ. Dịch vụ của bạn không bị ảnh hưởng.
                    </Text>
                )}
            </View>
        );
    };

    const filteredReports = Array.isArray(reports) 
        ? reports.filter(r => {
            if (!searchQuery) return true; 
            const name = r.service_name || `Dịch vụ #${r.service}`; 
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : [];

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Tìm tên dịch vụ bị báo cáo..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredReports}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>Tuyệt vời! Không có ai khiếu nại dịch vụ của bạn.</Text>}
                />
            )}
        </View>
    );
};

export default ProviderReportList;