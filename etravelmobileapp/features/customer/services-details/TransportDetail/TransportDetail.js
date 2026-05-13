import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Button, Divider, Text, Icon, Surface } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis, { endpoints } from "../../../../configs/apis";
import CustomerReportModal from "../../../../components/CustomerReportModal/CustomerReportModal";
import Rating from "../../Rating/Rating";
import styles from "./TransportDetailStyles";

const PRIMARY_COLOR = '#088395';

const TransportDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [transport, setTransport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportVisible, setReportVisible] = useState(false);

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
            Alert.alert("Lỗi", "Không thể tải thông tin phương tiện.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    const handleChat = async () => {
        try {
            const providerId = transport?.provider;
            const providerName = transport?.provider_name;
            const providerAvatar = transport?.provider_avatar;
            const token = await AsyncStorage.getItem("access-token");
            if (!token) return navigation.navigate("Login");
            
            const userStr = await AsyncStorage.getItem("user");
            const currentUser = JSON.parse(userStr);

            if (currentUser?.id === providerId) return Alert.alert("Lưu ý", "Đây là dịch vụ của bạn.");

            navigation.navigate('ChatProvider', { 
                currentUser, 
                chatUser: { id: providerId, username: `Nhà xe/Hãng tàu #${providerName}`, avatar: providerAvatar }
            });
        } catch (ex) { Alert.alert("Lỗi", "Không thể kết nối."); }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />;

    const vehicle = getVehicleInfo(transport?.vehicle_type);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageHeader}>
                    <Image source={{ uri: getImageUrl(transport?.image) }} style={styles.image} />
                    <Surface style={styles.typeBadge} elevation={2}>
                        <Icon source={vehicle.icon} size={18} color={PRIMARY_COLOR} />
                        <Text style={styles.typeText}>{vehicle.label}</Text>
                    </Surface>
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{transport?.name}</Text>

                    {/* ROUTE VISUALIZATION */}
                    <View style={styles.routeCard}>
                        <View style={styles.routePoint}>
                            <Icon source="circle-slice-8" size={16} color={PRIMARY_COLOR} />
                            <Text style={styles.locationLabel}>ĐIỂM ĐI</Text>
                            <Text style={styles.locationName}>{transport?.from_location}</Text>
                        </View>
                        
                        <View style={styles.routeLineContainer}>
                            <View style={styles.dashLine} />
                            <Icon source={vehicle.icon} size={24} color="#CBD5E1" />
                            <View style={styles.dashLine} />
                        </View>

                        <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
                            <Icon source="map-marker-check" size={20} color="#EF4444" />
                            <Text style={styles.locationLabel}>ĐIỂM ĐẾN</Text>
                            <Text style={styles.locationName}>{transport?.to_location}</Text>
                        </View>
                    </View>

                    {/* PRICE & CHAT */}
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.priceValue}>{formatCurrency(transport?.price)} VNĐ</Text>  
                            <Text style={styles.priceSub}>Giá vé tiêu chuẩn / người</Text>                        
                        </View>
                        <Button icon="chat-outline" mode="outlined" onPress={handleChat} style={styles.chatBtn}>
                            Chat
                        </Button>
                    </View>

                    <Divider style={styles.divider} />

                    {/* INFO BOX */}
                    <View style={styles.highlightGrid}>
                        <View style={styles.gridItem}>
                            <Icon source="account-group-outline" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>{transport?.seat_capacity} Chỗ</Text>
                            <Text style={styles.gridLabel}>Sức chứa</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Icon source="clock-fast" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>
                                {new Date(transport?.departure_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                            </Text>
                            <Text style={styles.gridLabel}>Giờ khởi hành</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Icon source="calendar-month" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.gridValue}>
                                {new Date(transport?.departure_time).toLocaleDateString('vi-VN')}
                            </Text>
                            <Text style={styles.gridLabel}>Ngày đi</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: transport?.description || "<div>Thông tin đang được cập nhật...</div>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    <Divider style={styles.divider} />
                    <Rating serviceId={transport?.id} type="transports" />

                    <Button 
                        icon="alert-circle-outline" 
                        mode="text" 
                        textColor="#94A3B8" 
                        onPress={() => setReportVisible(true)}
                        style={styles.reportBtn}
                    >
                        Báo cáo vi phạm lịch trình
                    </Button>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', { item: transport, type: 'transports' })}
                    style={styles.bookBtn}
                    labelStyle={styles.bookBtnLabel}
                >
                    ĐẶT VÉ NGAY
                </Button>
            </View>

            <CustomerReportModal 
                visible={reportVisible} 
                onDismiss={() => setReportVisible(false)} 
                serviceId={transport?.id} 
            />
        </View>
    );
};

export default TransportDetail;