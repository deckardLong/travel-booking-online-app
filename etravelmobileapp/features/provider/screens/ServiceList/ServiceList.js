import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, View, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, IconButton, SegmentedButtons, Surface, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Dùng icon cho trạng thái trống
import apis, { authApi, endpoints } from "../../../../configs/apis";
import styles from "./ServiceListStyles";
import { SafeAreaView } from "react-native-safe-area-context";

const ServiceList = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [serviceType, setServiceType] = useState('tours');

    const formatCurrency = (amount) => {
        return amount ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadServices = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).get(endpoints.create(serviceType));
            setServices(res.data.results || res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi kết nối", "Không thể cập nhật danh sách dịch vụ lúc này.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadServices();
    };

    useEffect(() => {
        setLoading(true);
        loadServices();
    }, [serviceType]);

    const confirmDelete = (id) => {
        Alert.alert(
            "Xác nhận xóa",
            "Dữ liệu này sẽ không thể khôi phục. Bạn chắc chắn chứ?",
            [
                { text: "Quay lại", style: "cancel" },
                { text: "Đồng ý xóa", style: "destructive", onPress: () => handleDelete(id) }
            ]
        );
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem('access-token');
            const url = `${endpoints.create(serviceType)}${id}/`;
            const res = await authApi(token).delete(url);

            if (res.status === 204 || res.status === 200) {
                Alert.alert("Thành công", "Đã gỡ dịch vụ khỏi hệ thống.");
                loadServices();
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể xóa dịch vụ. Vui lòng thử lại sau.");
        }
    };

    const renderServiceItem = ({ item }) => (
        <Card style={styles.card} onPress={() => {
            navigation.navigate('EditService', { item, type: serviceType })}}>
            <View style={styles.cardRow}>
                <Image
                    source={{ uri: getImageUrl(item.image) }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.serviceName} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <Text style={styles.priceTag}>
                            {formatCurrency(item.price)} VNĐ
                        </Text>
                    </View>

                    <View style={styles.actionRow}>
                        <IconButton
                            icon="square-edit-outline"
                            mode="contained-tonal"
                            containerColor="#E0F2F1"
                            iconColor="#088395"
                            size={22}
                            style={styles.actionBtn}
                            onPress={() => navigation.navigate('EditService', { item, type: serviceType })}
                        />
                        <IconButton
                            icon="trash-can-outline"
                            mode="contained-tonal"
                            containerColor="#FFEBEE"
                            iconColor="#FF5252"
                            size={22}
                            style={styles.actionBtn}
                            onPress={() => confirmDelete(item.id)}
                        />
                    </View>
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Surface style={styles.headerSurface} elevation={4}>
                <Text style={styles.headerTitle}>Quản lý dịch vụ</Text>
                <SegmentedButtons
                    value={serviceType}
                    onValueChange={setServiceType}
                    buttons={[
                        { value: 'tours', label: 'Tour', icon: 'map-outline' },
                        { value: 'hotels', label: 'Phòng', icon: 'bed-outline' },
                        { value: 'transports', label: 'Xe', icon: 'car-outline' },
                        { value: 'combos', label: 'Combo', icon: 'gift-outline' },
                    ]}
                    style={styles.segmentedContainer}
                    theme={{ colors: { secondaryContainer: '#E0F2F1', onSecondaryContainer: '#088395' } }}
                />
            </Surface>

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#088395" />
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderServiceItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#088395"]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="package-variant-closed" size={80} color="#CBD5E1" />
                            <Text style={styles.emptyText}>
                                Bạn chưa có dịch vụ nào trong danh mục này. Hãy nhấn nút "+" bên dưới để bắt đầu!
                            </Text>
                        </View>
                    }
                />
            )}

            <IconButton
                icon="plus"
                mode="contained"
                containerColor="#088395"
                iconColor="white"
                size={34}
                style={styles.fab}
                onPress={() => navigation.navigate('ServiceForm')}
            />
        </SafeAreaView>     
    );
};

export default ServiceList;