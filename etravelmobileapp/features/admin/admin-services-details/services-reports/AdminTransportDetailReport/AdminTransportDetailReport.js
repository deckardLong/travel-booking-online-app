import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, Text, Icon, Surface, IconButton } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR } from "./AdminTransportDetailReportStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminTransportDetailReport = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [transport, setTransport] = useState(null);
    const [loading, setLoading] = useState(true);

    const getVehicleInfo = (type) => {
        switch (type) {
            case 'FLIGHT': return { label: 'Máy bay', icon: 'airplane' };
            case 'SHIP': return { label: 'Tàu thủy', icon: 'ferry' };
            default: return { label: 'Xe khách', icon: 'bus-side' };
        }
    };

    const formatCurrency = (value) => {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['transports']}${id}/`);
            setTransport(res.data);
        } catch (ex) {
            console.error("Lỗi tải Phương tiện:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin phương tiện. Có thể nhà cung cấp đã xóa nó.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' }} size="large" color={PRIMARY_COLOR} />;

    if (!transport) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon source="alert-circle-outline" size={50} color="#94A3B8" />
            <Text style={{ marginTop: 10, color: '#64748B' }}>Dữ liệu phương tiện không tồn tại.</Text>
            <IconButton icon="arrow-left" size={30} onPress={() => navigation.goBack()} />
        </View>
    );

    const vehicle = getVehicleInfo(transport.vehicle_type);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} iconColor="#1E293B" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Chi tiết Phương Tiện (Kiểm duyệt)</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(transport.image) }} style={styles.image} />
                    
                    <View style={styles.adminBadge}>
                        <Icon source="shield-alert" size={16} color="#FFF" />
                        <Text style={styles.adminBadgeText}>BỊ BÁO CÁO</Text>
                    </View>

                    <Surface style={styles.typeBadge} elevation={2}>
                        <Icon source={vehicle.icon} size={18} color={PRIMARY_COLOR} />
                        <Text style={styles.typeText}>{vehicle.label}</Text>
                    </Surface>
                </View>

                <View style={styles.content}>
                    {/* THÔNG TIN KIỂM DUYỆT CỦA ADMIN */}
                    <Surface style={styles.adminInfoBox} elevation={1}>
                        <Text style={styles.adminBoxTitle}>Dữ liệu hệ thống</Text>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Mã Dịch Vụ (ID):</Text>
                            <Text style={styles.adminInfoValue}>#{transport.id}</Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Nhà cung cấp:</Text>
                            <Text style={[styles.adminInfoValue, { color: PRIMARY_COLOR }]}>
                                {transport.provider_name || `Provider #${transport.provider}`}
                            </Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Trạng thái:</Text>
                            <Text style={[styles.adminInfoValue, { color: transport.active ? '#10B981' : '#EF4444' }]}>
                                {transport.active ? "Đang hoạt động" : "Đã bị ẩn"}
                            </Text>
                        </View>
                    </Surface>

                    <Text style={styles.name}>{transport.name}</Text>

                    {/* BIỂU ĐỒ TUYẾN ĐƯỜNG */}
                    <View style={styles.routeCard}>
                        <View style={styles.routePoint}>
                            <Icon source="circle-slice-8" size={16} color={PRIMARY_COLOR} />
                            <Text style={styles.locationLabel}>ĐIỂM ĐI</Text>
                            <Text style={styles.locationName}>{transport.from_location}</Text>
                        </View>
                        
                        <View style={styles.routeLineContainer}>
                            <View style={styles.dashLine} />
                            <Icon source={vehicle.icon} size={24} color="#CBD5E1" />
                            <View style={styles.dashLine} />
                        </View>

                        <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
                            <Icon source="map-marker-check" size={20} color="#EF4444" />
                            <Text style={styles.locationLabel}>ĐIỂM ĐẾN</Text>
                            <Text style={styles.locationName}>{transport.to_location}</Text>
                        </View>
                    </View>

                    {/* GIÁ */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceValue}>{formatCurrency(transport.price)} VNĐ</Text>  
                        <Text style={styles.priceSub}>Giá vé tiêu chuẩn / người</Text>                        
                    </View>

                    <Divider style={styles.divider} />

                    {/* LƯỚI THÔNG TIN VẬN HÀNH */}
                    <View style={styles.highlightGrid}>
                        <View style={styles.gridItem}>
                            <Icon source="account-group-outline" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>{transport.seat_capacity} Chỗ</Text>
                            <Text style={styles.gridLabel}>Sức chứa</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Icon source="clock-fast" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>
                                {transport.departure_time ? new Date(transport.departure_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </Text>
                            <Text style={styles.gridLabel}>Giờ khởi hành</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Icon source="calendar-month" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>
                                {transport.departure_time ? new Date(transport.departure_time).toLocaleDateString('vi-VN') : '--/--'}
                            </Text>
                            <Text style={styles.gridLabel}>Ngày đi</Text>
                        </View>
                    </View>

                    {/* MÔ TẢ */}
                    <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: transport.description || "<div>Không có thông tin mô tả.</div>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminTransportDetailReport;