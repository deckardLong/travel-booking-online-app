import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, List, Text, Icon, IconButton, Chip, Surface } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR, SUCCESS_COLOR } from "./AdminHotelDetailStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminHotelDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadHotelDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['hotels']}${id}/`);
            setHotel(res.data);
        } catch (ex) {
            console.error("Lỗi tải Khách sạn:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin chi tiết khách sạn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadHotelDetail(); }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={PRIMARY_COLOR} />;

    if (!hotel) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dữ liệu không tồn tại.</Text>
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(hotel.image) }} style={styles.image} />
                    <View style={styles.starBadge}>
                        <Icon source="star" size={14} color="#FFD700" />
                        <Text style={styles.starText}>{hotel.star_rating} Sao</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Thông tin hệ thống */}
                    <Surface style={styles.adminInfoBox} elevation={0}>
                        <Text style={styles.adminBoxTitle}>Dữ liệu quản trị</Text>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>ID Khách sạn:</Text>
                            <Text style={styles.adminInfoValue}>#{hotel.id}</Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Chủ sở hữu:</Text>
                            <Text style={[styles.adminInfoValue, { color: PRIMARY_COLOR }]}>
                                {hotel.provider_name || `ID: ${hotel.provider}`}
                            </Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Trạng thái:</Text>
                            <Text style={[styles.adminInfoValue, { color: hotel.active ? SUCCESS_COLOR : '#EF4444' }]}>
                                {hotel.active ? "Đang hiện" : "Đang ẩn"}
                            </Text>
                        </View>
                    </Surface>

                    <Text style={styles.name}>{hotel.name}</Text>
                    <View style={styles.addressRow}>
                        <Icon source="map-marker-outline" size={18} color="#64748B" />
                        <Text style={styles.addressText}>{hotel.address}</Text>
                    </View>

                    <Text style={styles.priceValue}>{formatPrice(hotel.price)} VNĐ / đêm</Text>

                    {/* Giờ giấc nhận/trả phòng */}
                    <View style={styles.highlightBox}>
                        <View style={styles.infoCol}>
                            <Icon source="clock-check-outline" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Nhận phòng</Text>
                            <Text style={styles.infoValue}>{hotel.checkin_time?.substring(0, 5) || "14:00"}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.infoCol}>
                            <Icon source="clock-out" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Trả phòng</Text>
                            <Text style={styles.infoValue}>{hotel.checkout_time?.substring(0, 5) || "12:00"}</Text>
                        </View>
                    </View>

                    {/* Danh sách tiện nghi */}
                    {hotel.amenities ? (
                        <>
                            <Text style={styles.sectionTitle}>Tiện nghi niêm yết</Text>
                            <View style={styles.amenitiesContainer}>
                                {hotel.amenities.split(',').map((item, index) => (
                                    <Chip key={index} style={styles.amenityChip} textStyle={{fontSize: 12}} icon="check">
                                        {item.trim()}
                                    </Chip>
                                ))}
                            </View>
                        </>
                    ) : null}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Giới thiệu chi tiết</Text>
                    <RenderHtml
                        contentWidth={width - 30}
                        source={{ html: hotel.description || "<p>Chưa có mô tả.</p>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    {/* Chính sách khách sạn */}
                    {hotel.policy ? (
                        <List.Accordion
                            title="Chính sách & Quy định"
                            left={props => <List.Icon {...props} icon="shield-check-outline" color={PRIMARY_COLOR} />}
                            style={styles.accordion}
                            titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
                        >
                            <View style={{ padding: 15 }}>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: hotel.policy }}
                                    tagsStyles={{ p: { color: '#475569' } }}
                                />
                            </View>
                        </List.Accordion>
                    ) : null}

                    <View style={{ height: 30 }} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminHotelDetail;