import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions } from "react-native";
import { ActivityIndicator, Divider, Text, Icon, Surface, Avatar, IconButton } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import styles, { PRIMARY_COLOR } from "./AdminComboDetailReportStyles";
import apis, { endpoints } from "../../../../../configs/apis";

const AdminComboDetailReport = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (value) => {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const loadComboDetail = async () => {
        try {
            let res = await apis.get(`${endpoints['combos']}${id}/`);
            setCombo(res.data);
        } catch (ex) {
            console.error("Lỗi tải Combo:", ex);
            Alert.alert("Lỗi", "Không thể tải thông tin gói combo này. Có thể nó đã bị xóa.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadComboDetail(); }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' }} size="large" color={PRIMARY_COLOR} />;
    
    if (!combo) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon source="alert-circle-outline" size={50} color="#94A3B8" />
            <Text style={{ marginTop: 10, color: '#64748B' }}>Dữ liệu Combo không tồn tại.</Text>
            <IconButton icon="arrow-left" size={30} onPress={() => navigation.goBack()} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} iconColor="#1E293B" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Chi tiết Combo (Kiểm duyệt)</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(combo.image) }} style={styles.image} />
                    
                    <View style={styles.adminBadge}>
                        <Icon source="shield-alert" size={16} color="#FFF" />
                        <Text style={styles.adminBadgeText}>BỊ BÁO CÁO</Text>
                    </View>

                    <Surface style={styles.comboBadge} elevation={4}>
                        <Icon source="gift-outline" size={18} color="#FFF" />
                        <Text style={styles.comboBadgeText}>GÓI COMBO</Text>
                    </Surface>
                </View>

                <View style={styles.content}>
                    {/* THÔNG TIN KIỂM DUYỆT CỦA ADMIN */}
                    <Surface style={styles.adminInfoBox} elevation={1}>
                        <Text style={styles.adminBoxTitle}>Dữ liệu hệ thống</Text>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Mã Combo (ID):</Text>
                            <Text style={styles.adminInfoValue}>#{combo.id}</Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Người tạo (Provider):</Text>
                            <Text style={[styles.adminInfoValue, { color: PRIMARY_COLOR }]}>
                                {combo.provider_name || `Provider #${combo.provider}`}
                            </Text>
                        </View>
                        <View style={styles.adminInfoRow}>
                            <Text style={styles.adminInfoLabel}>Trạng thái gói:</Text>
                            <Text style={[styles.adminInfoValue, { color: combo.active ? '#10B981' : '#EF4444' }]}>
                                {combo.active ? "Đang hoạt động" : "Đã bị ẩn"}
                            </Text>
                        </View>
                    </Surface>

                    <Text style={styles.name}>{combo.name}</Text>
                    
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Giá trọn gói</Text>
                        <Text style={styles.priceValue}>{formatCurrency(combo.price)} VNĐ</Text>
                    </View>

                    <View style={styles.summaryBox}>
                        <Icon source="format-list-checks" size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.summaryText}>
                            Bao gồm: {combo.tour?.length || 0} Tour, {combo.hotel?.length || 0} Khách sạn, {combo.transport?.length || 0} Phương tiện.
                        </Text>
                    </View>

                    <Divider style={styles.divider} />
                    <Text style={styles.sectionTitle}>Các dịch vụ đi kèm</Text>

                    {/* DANH SÁCH TOURS */}
                    {combo.tour && combo.tour.length > 0 ? (
                        combo.tour.map(t => (
                            <Surface key={`tour-${t.id}`} style={styles.subServiceCard} elevation={1}>
                                <Avatar.Icon size={40} icon="map-marker-path" backgroundColor="#E0F2F1" color={PRIMARY_COLOR} />
                                <View style={styles.subServiceInfo}>
                                    <Text style={styles.subServiceName}>{t.name}</Text>
                                    <Text style={styles.subServiceDetail}>ID Dịch vụ: #{t.id}</Text>
                                </View>
                                {/* Admin xem tour con có thể điều hướng sang AdminTourDetail */}
                                <IconButton icon="chevron-right" onPress={() => navigation.navigate('AdminTourDetail', { id: t.id })} />
                            </Surface>
                        ))
                    ) : null}

                    {/* DANH SÁCH KHÁCH SẠN */}
                    {combo.hotel && combo.hotel.length > 0 ? (
                        combo.hotel.map(h => (
                            <Surface key={`hotel-${h.id}`} style={styles.subServiceCard} elevation={1}>
                                <Avatar.Icon size={40} icon="office-building" backgroundColor="#FFF7ED" color="#EA580C" />
                                <View style={styles.subServiceInfo}>
                                    <Text style={styles.subServiceName}>{h.name}</Text>
                                    <Text style={styles.subServiceDetail}>ID Dịch vụ: #{h.id}</Text>
                                </View>
                                <IconButton icon="chevron-right" onPress={() => navigation.navigate('AdminHotelDetail', { id: h.id })} />
                            </Surface>
                        ))
                    ) : null}

                    {/* DANH SÁCH VẬN CHUYỂN */}
                    {combo.transport && combo.transport.length > 0 ? (
                        combo.transport.map(tr => (
                            <Surface key={`transport-${tr.id}`} style={styles.subServiceCard} elevation={1}>
                                <Avatar.Icon size={40} icon="bus-clock" backgroundColor="#EFF6FF" color="#2563EB" />
                                <View style={styles.subServiceInfo}>
                                    <Text style={styles.subServiceName}>{tr.name}</Text>
                                    <Text style={styles.subServiceDetail}>ID Dịch vụ: #{tr.id}</Text>
                                </View>
                                <IconButton icon="chevron-right" onPress={() => navigation.navigate('AdminTransportDetail', { id: tr.id })} />
                            </Surface>
                        ))
                    ) : null}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả gói Combo</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: combo.description || "<div>Không có thông tin mô tả chi tiết.</div>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminComboDetailReport;