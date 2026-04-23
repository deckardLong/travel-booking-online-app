import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { authApi, endpoints } from "../configs/Apis";
import { Alert, FlatList, View } from "react-native";
import { ActivityIndicator, Card, Chip, Divider, List, Text } from "react-native-paper";
import styles from "./MyBookingsStyles";

const MyBookings = ({navigation}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBookings = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const res = await authApi(token).get(endpoints['my-bookings']);
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
        if (status === 'COMPLETED')
            return {bg: '#E8F5E9', text: '#2E7D32'};
        if (status === 'PENDING')
            return {bg: '#FFF3E0', text: '#EF6C00'};
        return {bg: '#FFEBEE', text: '#C62828'};
    };

    const renderBookingItem = ({item}) => {
        const status = getStatusStyle(item.status);
        return (
            <Card style={styles.card} mode="outlined">
                <Card.Content>
                    <View style={styles.rowBetween}>
                        <Text variant="titleMedium" style={styles.serviceName}>
                            {item.service_name || "Dịch vụ du lịch"}
                        </Text>
                        <Chip style={{backgroundColor: status.bg}} textStyle={{color: status.text, fontSize: 10}}>
                            {item.status}
                        </Chip>
                    </View>

                    <View style={styles.infoRow}>
                        <List.Icon icon="calendar-range" size={20} />
                        <Text variant="bodySmall">Ngày đi: {item.booking_date}</Text>
                    </View>

                    <Divider style={{marginVertical: 8}} />
                    <View style={styles.rowBetween}>
                        <Text variant="bodyMedium">Tổng thanh toán:</Text>
                        <Text variant="titleLarge" style={styles.totalAmount}>
                            {item.total_amount?.toLocaleString()} VNĐ
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    if (loading)
        return <ActivityIndicator style={{flex: 1}} size="large" />;

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={item => item.id.toString()}
                renderItem={renderBookingItem}
                contentContainerStyle={{paddingBottom: 20}}
                ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có giao dịch nào.</Text>}
                onRefresh={loadBookings}
                refreshing={loading}
            />
        </View>
    )
}

export default MyBookings;