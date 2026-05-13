import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../../../configs/apis";
import { Alert, FlatList, View } from "react-native";
import { ActivityIndicator, Card, Chip, Divider, Text, Icon } from "react-native-paper";
import styles from "./MyBookingsStyles";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    const loadBookings = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const storedRole = await AsyncStorage.getItem('user-role');
            setRole(storedRole);
            
            let url = storedRole === 'PROVIDER' ? endpoints['provider-bookings'] : endpoints['my-bookings'];
            const res = await authApi(token).get(url);
            setBookings(res.data);        
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể tải lịch sử đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const getStatusStyle = (status) => {
        const s = status?.toUpperCase() || '';
        if (s === 'COMPLETED' || s === 'PAID') 
            return {bg: '#E0F2F1', text: '#00897B'}; 
        if (s === 'PENDING' || s === 'UNPAID') 
            return {bg: '#FFF3E0', text: '#F57C00'}; 
        return {bg: '#FFEBEE', text: '#D32F2F'}; 
    };

    const renderBookingItem = ({item}) => {
        const statusStyle = getStatusStyle(item.status);
        const displayAmount = item.total_amount ? item.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '0';

        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.rowBetween}>
                        <Text 
                            variant="titleMedium" 
                            style={styles.serviceName} 
                            numberOfLines={2} 
                        >
                            {item.service_name || "Dịch vụ du lịch"}
                        </Text>
                        <Chip 
                            style={[styles.statusChip, {backgroundColor: statusStyle.bg}]} 
                            textStyle={[styles.statusText, {color: statusStyle.text}]}
                        >
                            {item.status || 'UNKNOWN'}
                        </Chip>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon source="calendar-blank" size={18} color="#64748B" />
                        <Text style={styles.dateText}>Ngày đi: {item.booking_date}</Text>
                    </View>

                    <Divider style={{marginVertical: 10, backgroundColor: '#E2E8F0'}} />
                    
                    <View style={styles.footerRow}>
                        <Text style={styles.totalAmountLabel}>Tổng thanh toán:</Text>
                        <Text style={styles.totalAmount}>
                            {displayAmount} VNĐ
                        </Text>
                    </View>
                    {role === 'PROVIDER' && item.customer_username && (
                        <View style={styles.customerRow}>
                            <Icon source="account-circle-outline" size={18} color="#475569" />
                            <Text style={styles.customerName}>Khách hàng: {item.customer_username}</Text>
                        </View>
                    )}        
                </Card.Content>
            </Card>
        );
    };

    if (loading)
        return <ActivityIndicator style={{flex: 1, backgroundColor: '#F1F5F9'}} size="large" color="#088395" />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Đơn hàng</Text>
                <Text style={styles.headerSubtitle}>
                    {role === 'PROVIDER' ? 'Quản lý các giao dịch với khách hàng' : 'Quản lý các chuyến đi của bạn'}
                </Text>
            </View>

            <FlatList
                data={bookings}
                keyExtractor={item => item.id.toString()}
                renderItem={renderBookingItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon source="text-box-search-outline" size={60} color="#CBD5E1" />
                        <Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>
                    </View>
                }
                onRefresh={loadBookings}
                refreshing={loading}
            />
        </View>
    )
}

export default MyBookings;