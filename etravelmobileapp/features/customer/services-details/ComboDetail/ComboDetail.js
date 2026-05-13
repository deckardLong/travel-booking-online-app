import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Alert, useWindowDimensions, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Divider, List, Text, Icon, Surface, Avatar, IconButton } from "react-native-paper";
import RenderHtml from 'react-native-render-html';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerReportModal from "../../../../components/CustomerReportModal/CustomerReportModal";
import Rating from "../../Rating/Rating";
import ComboDetailStyles from "./ComboDetailStyles";
import apis, { endpoints } from "../../../../configs/apis";

const PRIMARY_COLOR = '#088395';

const ComboDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportVisible, setReportVisible] = useState(false);

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
            Alert.alert("Lỗi", "Không thể tải thông tin gói combo này.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadComboDetail(); }, [id]);

    const handleChat = async () => {
        try {
            const providerId = combo?.provider;
            const providerName = combo?.provider_name;
            const providerAvatar = combo?.provider_avatar;
            const token = await AsyncStorage.getItem("access-token");
            if (!token) return navigation.navigate("Login");
            const userStr = await AsyncStorage.getItem("user");
            const currentUser = JSON.parse(userStr);
            if (currentUser?.id === providerId) return Alert.alert("Lưu ý", "Dịch vụ của chính bạn.");

            navigation.navigate('ChatProvider', { 
                currentUser, 
                chatUser: { id: providerId, username: `Tư vấn viên Combo #${providerName}`, avatar: providerAvatar },
                
            });
        } catch (ex) { Alert.alert("Lỗi", "Không thể kết nối."); }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY_COLOR} />;
    if (!combo) return <View style={styles.container}><Text>Không tìm thấy combo.</Text></View>;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageHeader}>
                    <Image source={{ uri: getImageUrl(combo?.image) }} style={styles.image} />
                    <Surface style={styles.comboBadge} elevation={4}>
                        <Icon source="gift-outline" size={18} color="#FFF" />
                        <Text style={styles.comboBadgeText}>COMBO TIẾT KIỆM</Text>
                    </Surface>
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{combo?.name}</Text>
                    
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.priceLabel}>Giá trọn gói</Text>
                            <Text style={styles.priceValue}>{formatCurrency(combo?.price)} VNĐ</Text>
                        </View>
                        <Button icon="message-text-outline" mode="outlined" onPress={handleChat} style={styles.chatBtn}>
                            Tư vấn
                        </Button>
                    </View>

                    <View style={ComboDetailStyles.summaryBox}>
                        <Icon source="information-outline" size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.summaryText}>
                            Gói bao gồm: {combo.tour?.length || 0} Tour, {combo.hotel?.length || 0} Khách sạn, {combo.transport?.length || 0} Chuyến xe.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Danh sách dịch vụ đi kèm</Text>

                    {/* TOURS TRONG COMBO */}
                    {combo.tour?.map(t => (
                        <Surface key={t.id} style={styles.subServiceCard} elevation={1}>
                            <Avatar.Icon size={40} icon="map-marker-path" backgroundColor="#E0F2F1" color={PRIMARY_COLOR} />
                            <View style={styles.subServiceInfo}>
                                <Text style={styles.subServiceName}>{t.name}</Text>
                                <Text style={styles.subServiceDetail}>Thời lượng: {t.duration}</Text>
                            </View>
                            <IconButton icon="chevron-right" onPress={() => navigation.navigate('TourDetail', { id: t.id })} />
                        </Surface>
                    ))}

                    {/* KHÁCH SẠN TRONG COMBO */}
                    {combo.hotel?.map(h => (
                        <Surface key={h.id} style={styles.subServiceCard} elevation={1}>
                            <Avatar.Icon size={40} icon="office-building" backgroundColor="#FFF7ED" color="#EA580C" />
                            <View style={styles.subServiceInfo}>
                                <Text style={styles.subServiceName}>{h.name}</Text>
                                <Text style={styles.subServiceDetail} numberOfLines={1}>{h.address}</Text>
                            </View>
                            <IconButton icon="chevron-right" onPress={() => navigation.navigate('HotelDetail', { id: h.id })} />
                        </Surface>
                    ))}

                    {/* VẬN CHUYỂN TRONG COMBO */}
                    {combo.transport?.map(tr => (
                        <Surface key={tr.id} style={styles.subServiceCard} elevation={1}>
                            <Avatar.Icon size={40} icon="bus-clock" backgroundColor="#EFF6FF" color="#2563EB" />
                            <View style={styles.subServiceInfo}>
                                <Text style={styles.subServiceName}>{tr.name}</Text>
                                <Text style={styles.subServiceDetail}>{tr.from_location} → {tr.to_location}</Text>
                            </View>
                            <IconButton icon="chevron-right" onPress={() => navigation.navigate('TransportDetail', { id: tr.id })} />
                        </Surface>
                    ))}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả gói Combo</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: combo.description || "<div>Thông tin đang được cập nhật...</div>" }}
                        tagsStyles={{ p: { color: '#475569', fontSize: 15, lineHeight: 22 } }}
                    />

                    <Divider style={styles.divider} />
                    <Rating serviceId={combo.id} type="combos" />

                    <Button 
                        icon="alert-circle-outline" 
                        mode="text" 
                        textColor="#94A3B8" 
                        onPress={() => setReportVisible(true)}
                        style={styles.reportBtn}
                    >
                        Báo cáo gói Combo này
                    </Button>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', { item: combo, type: 'combos' })}
                    style={styles.bookBtn}
                    labelStyle={styles.bookBtnLabel}
                >
                    ĐẶT TRỌN GÓI NGAY
                </Button>
            </View>

            <CustomerReportModal 
                visible={reportVisible} 
                onDismiss={() => setReportVisible(false)} 
                serviceId={combo.id} 
            />
        </View>
    );
};

export default ComboDetail;