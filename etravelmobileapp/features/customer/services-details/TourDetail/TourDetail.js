import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Button, Divider, List, Text, IconButton, Icon } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apis, { authApi, endpoints } from "../../../../configs/apis";
import CustomerReportModal from "../../../../components/CustomerReportModal/CustomerReportModal";
import styles from "./TourDetailStyles";
import Rating from "../../Rating/Rating";
import ReviewSection from "../../../../components/ReviewSection/ReviewSection";

const TourDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [tour, setTour] = useState(null);
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

    const loadTourDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['tours']}${id}/`);
            setTour(res.data);
        } catch (ex) {
            console.error("Lỗi tải Tour:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin tour này.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTourDetail(); }, [id]);

    const handleChatWithProvider = async () => {
        try {
            const providerId = tour?.provider;
            const providerName = tour?.provider_name;
            const providerAvatar = tour?.provider_avatar;
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
                chatUser: { id: providerId, username: `Nhà cung cấp #${providerName}`, avatar: providerAvatar },
            });
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể kết nối chat.");
        }
    };

    const formatHtmlContent = (html) => {
        if (!html) return "";
        // Biến các ký tự xuống dòng \n thành thẻ <br/> để RenderHtml nhận diện được
        return html.replace(/\n/g, '<br/>');
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color='#088395' />;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: getImageUrl(tour?.image) }} style={styles.image} />

                <View style={styles.content}>
                    {/* TIÊU ĐỀ & GIÁ */}
                    <Text style={styles.name}>{tour?.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(tour?.price)} VNĐ</Text>
                        <Button 
                            icon="chat-processing" 
                            mode="outlined" 
                            onPress={handleChatWithProvider}
                            style={styles.chatBtn}
                            labelStyle={{ color: '#088395'}}
                        >
                            Nhắn tin
                        </Button>
                    </View>

                    <View style={styles.highlightBox}>
                        <View style={styles.infoRow}>
                            <Icon source="clock-time-four-outline" size={22} color='#088395' />
                            <Text style={styles.infoText}> Thời lượng: <Text style={styles.bold}>{tour.duration}</Text></Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="map-marker-radius" size={22} color='#088395' />
                            <Text style={styles.infoText}> Điểm hẹn: <Text style={styles.bold}>{tour.meeting_point}</Text></Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="calendar-check" size={22} color='#088395' />
                            <Text style={styles.infoText}> Khởi hành: <Text style={styles.bold}>{new Date(tour.start_date).toLocaleDateString('vi-VN')}</Text></Text>
                        </View>
                    </View>

                    <List.Accordion 
                        title="Lịch trình chi tiết" 
                        titleStyle={styles.accordionTitle}
                        left={props => <List.Icon {...props} icon="calendar-text" color='#088395' />}
                        style={styles.accordion}
                    >
                        <View style={{ paddingHorizontal: 15 }}>
                            <RenderHtml
                                contentWidth={width}
                                source={{ 
                                    html: tour.itinerary 
                                        ? `<div>${formatHtmlContent(tour.itinerary)}</div>` 
                                        : "<div>Đang cập nhật...</div>" 
                                }}
                                tagsStyles={{ p: { color: '#475569', lineHeight: 20 } }}
                            />
                        </View>
                    </List.Accordion>

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: tour.description || "" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15 } }}
                    />

                    <Divider style={styles.divider} />

                    <Rating serviceId={tour.id} type="tours" />

                    <Divider style={styles.divider} />
                    <ReviewSection serviceId={tour.id} type="tours" />

                    <Button 
                        icon="alert-octagon" 
                        mode="text" 
                        textColor="#E53935" 
                        onPress={() => setReportVisible(true)}
                        style={styles.reportBtn}
                    >
                        Báo cáo dịch vụ này
                    </Button>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', { item: tour, type: 'tours' })}
                    style={styles.bookBtn}
                    labelStyle={styles.bookBtnLabel}
                >
                    ĐẶT TOUR NGAY
                </Button>
            </View>

            <CustomerReportModal 
                visible={reportVisible} 
                onDismiss={() => setReportVisible(false)} 
                serviceId={tour.id} 
            />
        </View>
    );
};

export default TourDetail;