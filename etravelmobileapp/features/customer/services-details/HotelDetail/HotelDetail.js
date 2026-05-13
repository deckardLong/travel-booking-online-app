import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Divider, List, Text, Icon, Chip } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis, { endpoints } from "../../../../configs/apis";
import CustomerReportModal from "../../../../components/CustomerReportModal/CustomerReportModal";
import Rating from "../../Rating/Rating";
import styles from "./HotelDetailStyles";

const PRIMARY_COLOR = '#088395';

const HotelDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportVisible, setReportVisible] = useState(false);

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
            Alert.alert("Lỗi", "Không thể tải thông tin khách sạn này.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadHotelDetail(); }, [id]);

    const handleChatWithProvider = async () => {
        try {
            const providerId = hotel?.provider;
            const providerName = hotel?.provider_name;
            const providerAvatar = hotel?.provider_avatar;
            if (!providerId) return Alert.alert("Lỗi", "Không tìm thấy nhà cung cấp.");

            const token = await AsyncStorage.getItem("access-token");
            if (!token) {
                return Alert.alert("Yêu cầu", "Vui lòng đăng nhập để nhắn tin.", [
                    { text: "Hủy" },
                    { text: "Đăng nhập", onPress: () => navigation.navigate("Login") }
                ]);
            }

            const userStr = await AsyncStorage.getItem("user");
            const currentUser = JSON.parse(userStr);

            if (currentUser?.id === providerId) {
                return Alert.alert("Lưu ý", "Bạn không thể tự nhắn tin cho chính mình.");
            }

            navigation.navigate('ChatProvider', { 
                currentUser, 
                chatUser: { id: providerId, username: `Chủ khách sạn #${providerName}`, avatar: providerAvatar },
            });
        } catch (ex) {
            console.log(ex);
            Alert.alert("Lỗi", "Không thể kết nối chat.");
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />;
    if (!hotel) return <View style={styles.container}><Text>Không tìm thấy dữ liệu.</Text></View>;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(hotel?.image) }} style={styles.image} />
                    <View style={styles.starBadge}>
                        <Icon source="star" size={16} color="#FFD700" />
                        <Text style={styles.starText}>{hotel.star_rating} Sao</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* TÊN & ĐỊA CHỈ */}
                    <Text style={styles.name}>{hotel.name}</Text>
                    <View style={styles.addressRow}>
                        <Icon source="map-marker-outline" size={18} color="#64748B" />
                        <Text style={styles.addressText}>{hotel.address}</Text>
                    </View>

                    {/* GIÁ & CHAT */}
                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.priceLabel}>Giá mỗi đêm từ</Text>
                            <Text style={styles.priceValue}>{formatPrice(hotel.price)} VNĐ</Text>
                        </View>
                        <Button 
                            icon="chat-processing-outline" 
                            mode="outlined" 
                            onPress={handleChatWithProvider}
                            style={styles.chatBtn}
                            labelStyle={{ color: PRIMARY_COLOR }}
                        >
                            Nhắn tin
                        </Button>
                    </View>

                    <Divider style={styles.divider} />

                    {/* HIGHLIGHT INFO */}
                    <View style={styles.highlightBox}>
                        <View style={styles.infoCol}>
                            <Icon source="clock-in" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Check-in</Text>
                            <Text style={styles.infoValue}>{hotel.checkin_time?.substring(0, 5)}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.infoCol}>
                            <Icon source="clock-out" size={24} color={PRIMARY_COLOR} />
                            <Text style={styles.infoLabel}>Check-out</Text>
                            <Text style={styles.infoValue}>{hotel.checkout_time?.substring(0, 5)}</Text>
                        </View>
                    </View>

                    {/* AMENITIES (TIỆN NGHI) */}
                    <Text style={styles.sectionTitle}>Tiện nghi khách sạn</Text>
                    <View style={styles.amenitiesContainer}>
                        {hotel.amenities?.split(',').map((item, index) => (
                            <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText} icon="check-circle">
                                {item.trim()}
                            </Chip>
                        ))}
                    </View>

                    {/* MÔ TẢ */}
                    <Text style={styles.sectionTitle}>Giới thiệu</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: hotel.description || "<div>Đang cập nhật...</div>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    {/* CHÍNH SÁCH - Dùng Accordion cho gọn */}
                    <List.Accordion 
                        title="Chính sách & Quy định" 
                        titleStyle={styles.accordionTitle}
                        left={props => <List.Icon {...props} icon="shield-check-outline" color={PRIMARY_COLOR} />}
                        style={styles.accordion}
                    >
                        <View style={styles.accordionContent}>
                            <RenderHtml
                                contentWidth={width}
                                source={{ html: hotel.policy || "<div>Chưa có chính sách cụ thể.</div>" }}
                                tagsStyles={{ p: { color: '#475569' } }}
                            />
                        </View>
                    </List.Accordion>

                    <Divider style={styles.divider} />

                    <Rating serviceId={hotel.id} type="hotels" />
                    
                    <Button 
                        icon="alert-octagon" 
                        mode="text" 
                        textColor="#E53935" 
                        onPress={() => setReportVisible(true)}
                        style={styles.reportBtn}
                    >
                        Báo cáo khách sạn này
                    </Button>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', { item: hotel, type: 'hotels' })}
                    style={styles.bookBtn}
                    labelStyle={styles.bookBtnLabel}
                >
                    ĐẶT PHÒNG NGAY
                </Button>
            </View>

            <CustomerReportModal 
                visible={reportVisible} 
                onDismiss={() => setReportVisible(false)} 
                serviceId={hotel.id} 
            />
        </View>
    );
};

export default HotelDetail;