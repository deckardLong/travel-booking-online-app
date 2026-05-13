import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, List, Text, Icon, Surface, IconButton, Chip } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR } from "./AdminHotelDetailReportStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminHotelDetailReport = ({ route, navigation }) => {
    const { id } = route.params; 
    const { width } = useWindowDimensions();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadHotelDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['hotels']}${id}/`);
            setHotel(res.data);
        } catch (ex) {
            console.error("Lỗi tải khách sạn:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin khách sạn này. Có thể nhà cung cấp đã xóa nó.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadHotelDetail(); }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' }} size="large" color={PRIMARY_COLOR} />;

    if (!hotel) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon source="alert-circle-outline" size={50} color="#94A3B8" />
            <Text style={{ marginTop: 10, color: '#64748B' }}>Dữ liệu khách sạn không tồn tại.</Text>
            <IconButton icon="arrow-left" size={30} onPress={() => navigation.goBack()} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} iconColor="#1E293B" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Chi tiết Khách Sạn (Kiểm duyệt)</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(hotel.image) }} style={styles.image} />
                    <View style={styles.adminBadge}>
                        <Icon source="shield-alert" size={16} color="#FFF" />
                        <Text style={styles.adminBadgeText}>BỊ BÁO CÁO</Text>
                    </View>
                    <View style={styles.starBadge}>
                        <Icon source="star" size={16} color="#FFD700" />
                        <Text style={styles.starText}>{hotel.star_rating} Sao</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* THÔNG TIN KIỂM DUYỆT CỦA ADMIN */}
                    <Surface style={styles.adminInfoBox} elevation={1}>
                        <Text style={styles.adminBoxTitle}>Dữ liệu hệ thống</Text>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Mã Khách Sạn (ID):</Text>
                            <Text style={styles.adminInfoValue}>#{hotel.id}</Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Nhà cung cấp:</Text>
                            <Text style={[styles.adminInfoValue, { color: PRIMARY_COLOR }]}>
                                {hotel.provider_name || `Provider #${hotel.provider}`}
                            </Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Trạng thái:</Text>
                            <Text style={[styles.adminInfoValue, { color: hotel.active ? '#10B981' : '#EF4444' }]}>
                                {hotel.active ? "Đang hoạt động" : "Đã bị ẩn"}
                            </Text>
                        </View>
                    </Surface>

                    {/* TÊN & ĐỊA CHỈ */}
                    <Text style={styles.name}>{hotel.name}</Text>
                    <View style={styles.addressRow}>
                        <Icon source="map-marker-outline" size={18} color="#64748B" />
                        <Text style={styles.addressText}>{hotel.address}</Text>
                    </View>

                    {/* GIÁ */}
                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.priceLabel}>Giá tham khảo (từ)</Text>
                            <Text style={styles.priceValue}>{formatPrice(hotel.price)} VNĐ</Text>
                        </View>
                    </View>

                    {/* HIGHLIGHT INFO (Checkin/out) */}
                    <View style={styles.highlightBox}>
                        <View style={styles.infoCol}>
                            <Icon source="clock-in" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Check-in</Text>
                            <Text style={styles.infoValue}>{hotel.checkin_time?.substring(0, 5) || "14:00"}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.infoCol}>
                            <Icon source="clock-out" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Check-out</Text>
                            <Text style={styles.infoValue}>{hotel.checkout_time?.substring(0, 5) || "12:00"}</Text>
                        </View>
                    </View>

                    {/* AMENITIES (TIỆN NGHI) */}
                    {hotel.amenities ? (
                        <>
                            <Text style={styles.sectionTitle}>Tiện nghi khách sạn</Text>
                            <View style={styles.amenitiesContainer}>
                                {hotel.amenities.split(',').map((item, index) => (
                                    <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText} icon="check-circle-outline">
                                        {item.trim()}
                                    </Chip>
                                ))}
                            </View>
                        </>
                    ) : null}

                    <Divider style={styles.divider} />

                    {/* MÔ TẢ */}
                    <Text style={styles.sectionTitle}>Giới thiệu</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: hotel.description || "<p>Chưa cập nhật nội dung giới thiệu.</p>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    {/* CHÍNH SÁCH */}
                    {hotel.policy ? (
                        <List.Accordion 
                            title="Chính sách & Quy định" 
                            titleStyle={styles.accordionTitle}
                            left={props => <List.Icon {...props} icon="shield-check-outline" color={PRIMARY_COLOR} />}
                            style={styles.accordion}
                        >
                            <View style={styles.accordionContent}>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: hotel.policy }}
                                    tagsStyles={{ p: { color: '#475569', lineHeight: 20 } }}
                                />
                            </View>
                        </List.Accordion>
                    ) : null}
                    
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminHotelDetailReport;