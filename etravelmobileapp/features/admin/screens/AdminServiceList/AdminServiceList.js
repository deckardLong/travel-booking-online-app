import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Image, Text, Alert, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar, IconButton, Button, Icon, Chip } from 'react-native-paper';
import styles from './AdminServiceListStyles';
import Apis, { endpoints } from '../../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = '#088395';

const AdminServiceList = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // --- CÁC STATE DÙNG ĐỂ LỌC DỮ LIỆU ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'tours', 'hotels', 'transports', 'combos'
    const [vehicleType, setVehicleType] = useState('ALL'); // 'ALL', 'BUS', 'FLIGHT', 'SHIP'

    // Danh sách cấu hình Tabs
    const mainTabs = [
        { id: 'all', label: 'Tất cả', icon: 'view-dashboard' },
        { id: 'tours', label: 'Tour', icon: 'map-marker-path' },
        { id: 'hotels', label: 'Khách sạn', icon: 'office-building' },
        { id: 'transports', label: 'Phương tiện', icon: 'bus' },
        { id: 'combos', label: 'Combo', icon: 'package-variant' },
    ];

    const transportTabs = [
        { id: 'ALL', label: 'Tất cả PT', icon: 'apps' },
        { id: 'BUS', label: 'Xe khách', icon: 'bus-side' },
        { id: 'FLIGHT', label: 'Máy bay', icon: 'airplane' },
        { id: 'SHIP', label: 'Tàu thủy', icon: 'ferry' },
    ];

    const fetchAllServices = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const headers = { 'Authorization': `Bearer ${token}` };

            const [toursRes, hotelsRes, transportsRes, combosRes] = await Promise.all([
                Apis.get(endpoints['services']('tours'), { headers }),
                Apis.get(endpoints['services']('hotels'), { headers }),
                Apis.get(endpoints['services']('transports'), { headers }),
                Apis.get(endpoints['services']('combos'), { headers }),
            ]);

            const mapWithType = (data, type) => (data.results || data).map(item => ({ ...item, serviceType: type }));

            const allServices = [
                ...mapWithType(toursRes.data, 'tours'),
                ...mapWithType(hotelsRes.data, 'hotels'),
                ...mapWithType(transportsRes.data, 'transports'),
                ...mapWithType(combosRes.data, 'combos')
            ];
            
            // Sắp xếp: Chờ duyệt lên đầu
            allServices.sort((a, b) => (a.active === b.active) ? 0 : a.active ? 1 : -1);
            setServices(allServices);
        } catch (error) {
            console.error("Lỗi lấy danh sách dịch vụ:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAllServices();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllServices();
    }, []);

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };

    const handlePressItem = (item) => {
        let screenName = '';
        switch (item.serviceType) {
            case 'tours': screenName = 'AdminTourDetail'; break;
            case 'hotels': screenName = 'AdminHotelDetail'; break;
            case 'transports': screenName = 'AdminTransportDetail'; break;
            case 'combos': screenName = 'AdminComboDetail'; break;
            default:
                Alert.alert("Lỗi", "Không xác định được loại dịch vụ.");
                return;
        }
        navigation.navigate(screenName, { id: item.id });
    };

    const handleApprove = (item) => {
        Alert.alert(
            "Xác nhận duyệt",
            `Bạn có chắc chắn muốn duyệt dịch vụ "${item.name}" không?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Duyệt ngay",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("access-token");
                            const url = `/${item.serviceType}/${item.id}/`;

                            const formData = new FormData();
                            formData.append('active', 'true');

                            const response = await Apis.patch(url, formData, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            if (response.status === 200 || response.status === 204) {
                                Alert.alert("Thành công", "Đã duyệt dịch vụ!");
                                onRefresh();
                            }
                        } catch (error) {
                            console.error("Lỗi duyệt dịch vụ:", error.response?.data || error.message);
                            Alert.alert("Lỗi", "Không thể duyệt dịch vụ lúc này.");
                        }
                    }
                }
            ]
        );
    };

    // --- LOGIC LỌC DỮ LIỆU ĐA TẦNG ---
    const filteredServices = services.filter(s => {
        // 1. Lọc theo thanh tìm kiếm
        const searchMatch = 
            (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.provider_name || "").toLowerCase().includes(searchQuery.toLowerCase());
        if (!searchMatch) return false;

        // 2. Lọc theo Tab chính
        if (activeTab !== 'all' && s.serviceType !== activeTab) return false;

        // 3. Lọc theo Tab phụ (Phương tiện)
        if (activeTab === 'transports' && vehicleType !== 'ALL') {
            if (s.vehicle_type !== vehicleType) return false;
        }

        return true;
    });

    const renderItem = ({ item }) => {
        const isActive = item.active;
        const statusColor = isActive ? '#10B981' : '#F59E0B';
        const statusText = isActive ? 'Đang hiện' : 'Chờ duyệt';
        const providerName = item.provider_name || 'Hệ thống (Admin)';

        return (
            <TouchableOpacity
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => handlePressItem(item)}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(item.image) }} style={styles.serviceImage} />
                </View>

                <View style={styles.infoContainer}>
                    <View>
                        <View style={styles.headerRow}>
                            <Text style={styles.serviceName} numberOfLines={2}>{item.name}</Text>
                        </View>
                        <Text style={styles.priceText}>{formatPrice(item.price)} VNĐ</Text>
                        <Text style={styles.providerText}>
                            <Icon source="account-tie" size={12} color="#64748B" /> Người đăng: {providerName}
                        </Text>
                    </View>

                    <View style={styles.actionRow}>
                        <View style={[styles.badge, { backgroundColor: statusColor }]}>
                            <Text style={styles.badgeText}>{statusText}</Text>
                        </View>

                        {!isActive ? (
                            <Button
                                mode="contained"
                                style={styles.approveBtn}
                                labelStyle={styles.approveBtnLabel}
                                onPress={() => handleApprove(item)}
                            >
                                DUYỆT
                            </Button>
                        ) : (
                            <IconButton icon="dots-vertical" iconColor="#94A3B8" size={20} style={{ margin: 0 }} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* THANH TÌM KIẾM */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm tên dịch vụ, người đăng..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor={PRIMARY_COLOR}
                    inputStyle={{ fontSize: 15 }}
                />
            </View>

            {/* TAB CHÍNH (All, Tours, Hotels,...) */}
            <View style={{ paddingHorizontal: 15, paddingBottom: 10, paddingTop: 15 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {mainTabs.map(tab => (
                        <Chip
                            key={tab.id}
                            icon={tab.icon}
                            selected={activeTab === tab.id}
                            onPress={() => {
                                setActiveTab(tab.id);
                                setVehicleType('ALL'); // Reset bộ lọc phụ khi chuyển tab chính
                            }}
                            style={{ backgroundColor: activeTab === tab.id ? PRIMARY_COLOR : '#F1F5F9' }}
                            textStyle={{ 
                                color: activeTab === tab.id ? '#FFF' : '#475569',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                            }}
                        >
                            {tab.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            {/* TAB PHỤ DÀNH RIÊNG CHO PHƯƠNG TIỆN */}
            {activeTab === 'transports' && (
                <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {transportTabs.map(tab => (
                            <Chip
                                key={tab.id}
                                icon={tab.icon}
                                mode="outlined"
                                selected={vehicleType === tab.id}
                                onPress={() => setVehicleType(tab.id)}
                                style={{ 
                                    backgroundColor: vehicleType === tab.id ? '#E0F2F1' : '#FFF',
                                    borderColor: vehicleType === tab.id ? PRIMARY_COLOR : '#CBD5E1' 
                                }}
                                textStyle={{ 
                                    color: vehicleType === tab.id ? PRIMARY_COLOR : '#64748B',
                                    fontWeight: vehicleType === tab.id ? 'bold' : 'normal'
                                }}
                            >
                                {tab.label}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* DANH SÁCH DỮ LIỆU */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            ) : filteredServices.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon source="text-box-search-outline" size={60} color="#CBD5E1" />
                    <Text style={styles.emptyText}>Không tìm thấy dịch vụ nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredServices}
                    keyExtractor={(item, index) => item.id ? `${item.serviceType}_${item.id}` : index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} />
                    }
                />
            )}
        </View>
    );
};

export default AdminServiceList;