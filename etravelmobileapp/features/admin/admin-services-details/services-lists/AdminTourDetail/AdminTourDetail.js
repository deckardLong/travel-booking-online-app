import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, List, Text, Icon, IconButton } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR, SUCCESS_COLOR } from "./AdminTourDetailStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminTourDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadTourDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['tours']}${id}/`);
            setTour(res.data);
        } catch (ex) {
            console.error("Lỗi tải Tour:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin chi tiết của Tour này.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTourDetail(); }, [id]);

    const formatHtmlContent = (html) => {
        if (!html) return "";
        return html.replace(/\n/g, '<br/>');
    };

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={PRIMARY_COLOR} />;

    if (!tour) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dữ liệu không tồn tại.</Text>
            <Button onPress={() => navigation.goBack()}>Quay lại</Button>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Thanh điều hướng nội bộ */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(tour.image) }} style={styles.image} />
                </View>

                <View style={styles.content}>
                    {/* Bảng trạng thái dành cho Admin */}
                    <View style={styles.adminStatusSection}>
                        <View>
                            <Text style={styles.statusLabel}>Trạng thái hiển thị</Text>
                            <Text style={[styles.statusValue, { color: tour.active ? SUCCESS_COLOR : '#EF4444' }]}>
                                {tour.active ? "Đang hoạt động" : "Đang ẩn"}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.statusLabel}>Mã Tour (ID)</Text>
                            <Text style={styles.statusValue}>#{tour.id}</Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{tour.name}</Text>
                    <Text style={styles.price}>{formatPrice(tour.price)} VNĐ</Text>

                    {/* Lưới thông tin chi tiết */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Icon source="clock-outline" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}>
                                Thời lượng: <Text style={styles.boldValue}>{tour.duration}</Text>
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="map-marker-outline" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}>
                                Điểm hẹn: <Text style={styles.boldValue}>{tour.meeting_point}</Text>
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="calendar-range" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}>
                                Khởi hành: <Text style={styles.boldValue}>
                                    {tour.start_date ? new Date(tour.start_date).toLocaleDateString('vi-VN') : 'Liên hệ'}
                                </Text>
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="account-tie-outline" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}>
                                Người đăng: <Text style={styles.boldValue}>{tour.provider_name || "Hệ thống"}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Lịch trình chi tiết */}
                    {tour.itinerary ? (
                        <List.Accordion
                            title="Lịch trình chi tiết"
                            left={props => <List.Icon {...props} icon="calendar-text-outline" color={PRIMARY_COLOR} />}
                            style={styles.accordion}
                            titleStyle={{ fontWeight: 'bold' }}
                        >
                            <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: `<div>${formatHtmlContent(tour.itinerary)}</div>` }}
                                    tagsStyles={{ p: { color: '#475569', lineHeight: 22 } }}
                                />
                            </View>
                        </List.Accordion>
                    ) : null}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
                    <RenderHtml
                        contentWidth={width - 30}
                        source={{ html: tour.description || "<p>Chưa có mô tả.</p>" }}
                        tagsStyles={{ 
                            p: { color: '#475569', fontSize: 15, lineHeight: 22 },
                            div: { color: '#475569' }
                        }}
                    />

                    <View style={styles.footerPadding} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminTourDetail;