import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Chip, IconButton, Divider, Modal, Portal, Searchbar, Checkbox, Button, ActivityIndicator } from 'react-native-paper';
import { authApi, endpoints } from "../../../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../screens/ServiceForm/ServiceFormStyles';

const PRIMARY_COLOR = '#088395';

const ComboFields = ({ comboData, setComboData }) => {
    const [visible, setVisible] = useState(false);
    const [pickingType, setPickingType] = useState(null); // 'tour', 'hotel', hoặc 'transport'
    const [listItems, setListItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Mở Modal chọn
    const openPicker = async (type) => {
        setPickingType(type);
        setVisible(true);
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            // API endpoints thường là 'tours', 'hotels', 'transports'
            const apiEndpoint = type === 'tour' ? 'tours' : type === 'hotel' ? 'hotels' : 'transports';
            const res = await authApi(token).get(endpoints.create(apiEndpoint));
            setListItems(res.data.results || res.data);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (id) => {
        const currentSelection = comboData[pickingType];
        const isSelected = currentSelection.includes(id);
        
        const newSelection = isSelected 
            ? currentSelection.filter(itemId => itemId !== id)
            : [...currentSelection, id];

        setComboData(prev => ({ ...prev, [pickingType]: newSelection }));
    };

    const removeId = (field, id) => {
        setComboData(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item !== id)
        }));
    };

    const filteredItems = listItems.filter(item => 
        (item.name || item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSection = (title, data, field, icon) => (
        <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{title}</Text>
                <Button 
                    mode="text" 
                    compact 
                    onPress={() => openPicker(field)}
                    textColor={PRIMARY_COLOR}
                    icon="plus-circle-outline"
                >
                    Thêm
                </Button>
            </View>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                {data.length > 0 ? data.map((id) => (
                    <Chip 
                        key={id} 
                        icon={icon}
                        onClose={() => removeId(field, id)}
                        style={{ marginRight: 6, marginBottom: 6, backgroundColor: '#E0F2F1' }}
                    >
                        ID: {id}
                    </Chip>
                )) : (
                    <Text style={{ fontStyle: 'italic', color: '#94A3B8', fontSize: 12 }}>Chưa có {title.toLowerCase()}</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.subSection}>
            <Text style={styles.sectionLabel}>Thành phần Combo</Text>
            
            {renderSection("Tours", comboData.tour, 'tour', 'map-marker-path')}
            {renderSection("Khách sạn", comboData.hotel, 'hotel', 'office-building')}
            {renderSection("Vận chuyển", comboData.transport, 'transport', 'car-multiple')}

            {/* MODAL CHỌN DỊCH VỤ */}
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 15,
                        height: '70%'
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: PRIMARY_COLOR }}>
                        Chọn {pickingType?.toUpperCase()}
                    </Text>
                    
                    <Searchbar
                        placeholder="Tìm kiếm tên..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={{ marginBottom: 15, backgroundColor: '#F1F5F9' }}
                    />

                    {loading ? (
                        <ActivityIndicator color={PRIMARY_COLOR} style={{ flex: 1 }} />
                    ) : (
                        <ScrollView>
                            {filteredItems.map(item => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    onPress={() => toggleSelection(item.id)}
                                    style={{ 
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        paddingVertical: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#F1F5F9'
                                    }}
                                >
                                    <Checkbox 
                                        status={comboData[pickingType]?.includes(item.id) ? 'checked' : 'unchecked'} 
                                        color={PRIMARY_COLOR}
                                    />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={{ fontWeight: '500' }}>{item.name || item.title}</Text>
                                        <Text style={{ fontSize: 12, color: '#64748B' }}>ID: {item.id} - {item.price?.toLocaleString()}đ</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <Button 
                        mode="contained" 
                        onPress={() => setVisible(false)}
                        style={{ marginTop: 20, backgroundColor: PRIMARY_COLOR }}
                    >
                        Xong
                    </Button>
                </Modal>
            </Portal>
        </View>
    );
};

export default ComboFields;