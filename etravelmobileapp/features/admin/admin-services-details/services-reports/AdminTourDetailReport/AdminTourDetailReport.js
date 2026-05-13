import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, List, Text, Icon, Surface, IconButton } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR } from "./AdminTourDetailReportStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminTourDetailReport = ({ route, navigation }) => {
    const { id } = route.params; 
    const { width } = useWindowDimensions();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

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
            Alert.alert("Lỗi", "Không thể tải thông tin tour này. Có thể nhà cung cấp đã xóa nó.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTourDetail(); }, [id]);

    const formatHtmlContent = (html) => {
        if (!html) return "";
        return html.replace(/\n/g, '<br/>');
    };

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' }} size="large" color={PRIMARY_COLOR} />;

    if (!tour) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon source="alert-circle-outline" size={50} color="#94A3B8" />
            <Text style={{ marginTop: 10, color: '#64748B' }}>Dữ liệu tour không tồn tại.</Text>
            <IconButton icon="arrow-left" size={30} onPress={() => navigation.goBack()} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(tour.image) }} style={styles.image} />
                    <View style={styles.adminBadge}>
                        <Icon source="shield-alert" size={16} color="#FFF" />
                        <Text style={styles.adminBadgeText}>BỊ BÁO CÁO</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Surface style={styles.adminInfoBox} elevation={1}>
                        <Text style={styles.adminBoxTitle}>Dữ liệu hệ thống</Text>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Mã Tour (ID):</Text>
                            <Text style={styles.adminInfoValue}>#{tour.id}</Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Nhà cung cấp:</Text>
                            <Text style={[styles.adminInfoValue, { color: PRIMARY_COLOR }]}>
                                {tour.provider_name || `Provider #${tour.provider}`}
                            </Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Trạng thái Tour:</Text>
                            <Text style={[styles.adminInfoValue, { color: tour.active ? '#10B981' : '#EF4444' }]}>
                                {tour.active ? "Đang hoạt động" : "Đã bị ẩn"}
                            </Text>
                        </View>
                    </Surface>

                    <Text style={styles.name}>{tour.name}</Text>
                    <Text style={styles.price}>{formatPrice(tour.price)} VNĐ</Text>

                    <View style={styles.highlightBox}>
                        <View style={styles.infoRow}>
                            <Icon source="clock-time-four-outline" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}> Thời lượng: <Text style={styles.bold}>{tour.duration}</Text></Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="map-marker-radius" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}> Điểm hẹn: <Text style={styles.bold}>{tour.meeting_point}</Text></Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon source="calendar-check" size={22} color={PRIMARY_COLOR} />
                            <Text style={styles.infoText}> Khởi hành: <Text style={styles.bold}>{new Date(tour.start_date).toLocaleDateString('vi-VN')}</Text></Text>
                        </View>
                    </View>

                    {tour.itinerary ? (
                        <List.Accordion 
                            title="Lịch trình chi tiết" 
                            titleStyle={styles.accordionTitle}
                            left={props => <List.Icon {...props} icon="calendar-text" color={PRIMARY_COLOR} />}
                            style={styles.accordion}
                        >
                            <View style={{ paddingHorizontal: 15 }}>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: `<div>${formatHtmlContent(tour.itinerary)}</div>` }}
                                    tagsStyles={{ p: { color: '#475569', lineHeight: 20 } }}
                                />
                            </View>
                        </List.Accordion>
                    ) : null}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: tour.description || "<p>Chưa có mô tả.</p>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />
                    
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminTourDetailReport;