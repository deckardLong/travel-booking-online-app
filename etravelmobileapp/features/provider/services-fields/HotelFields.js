import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import styles from '../screens/ServiceForm/ServiceFormStyles';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const HotelFields = ({ hotelData, setHotelData }) => {

    const updateField = (field, value) => {
        setHotelData(prev => ({ ...prev, [field]: value }));
    };

    // Hàm mở trình chọn giờ (Check-in/Check-out)
    const openTimePicker = (currentTime, fieldName) => {
        DateTimePickerAndroid.open({
            value: currentTime || new Date(),
            onChange: (event, selectedTime) => {
                if (event.type === 'set' && selectedTime) {
                    updateField(fieldName, selectedTime);
                }
            },
            mode: 'time',
            is24Hour: true,
        });
    };

    // Hàm format hiển thị giờ HH:mm
    const formatTime = (time) => {
        if (!time) return "Chưa chọn";
        return time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.subSection}>
            <Text style={styles.sectionLabel}>Thông tin chi tiết Khách sạn</Text>
            
            <TextInput 
                label="Địa chỉ chi tiết" 
                value={hotelData.address} 
                onChangeText={(t) => updateField('address', t)} 
                mode="outlined" 
                style={styles.input} 
                left={<TextInput.Icon icon="map-marker" color="#94A3B8" />}
            />

            <View style={styles.row}>
                <TextInput 
                    label="Hạng sao (1-5)" 
                    value={hotelData.starRating?.toString()} 
                    onChangeText={(t) => updateField('starRating', t)} 
                    keyboardType="numeric"
                    mode="outlined" 
                    style={[styles.input, { flex: 1, marginRight: 10 }]} 
                    left={<TextInput.Icon icon="star" color="#F59E0B" />}
                />
                
                {/* Để trống hoặc thêm field khác nếu cần cân đối UI */}
                <View style={{ flex: 1 }} /> 
            </View>

            <View style={styles.row}>
                <TouchableOpacity 
                    onPress={() => openTimePicker(hotelData.checkinTime, 'checkinTime')} 
                    style={[styles.datePickerBtn, { flex: 1, marginRight: 10 }]}
                >
                    <Text style={styles.dateLabel}>Giờ Check-in</Text>
                    <Text style={styles.dateValue}>
                        {formatTime(hotelData.checkinTime)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => openTimePicker(hotelData.checkoutTime, 'checkoutTime')}
                    style={[styles.datePickerBtn, { flex: 1 }]}
                >
                    <Text style={styles.dateLabel}>Giờ Check-out</Text>
                    <Text style={styles.dateValue}>
                        {formatTime(hotelData.checkoutTime)}
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput 
                label="Tiện nghi (Wifi, Hồ bơi, Ăn sáng...)" 
                value={hotelData.amenities} 
                onChangeText={(t) => updateField('amenities', t)} 
                multiline 
                numberOfLines={3} 
                mode="outlined" 
                style={styles.input} 
                placeholder="Nhập các tiện ích cách nhau bằng dấu phẩy"
                left={<TextInput.Icon icon="room-service-outline" color="#94A3B8" />}
            />

            <TextInput 
                label="Chính sách khách sạn" 
                value={hotelData.policy} 
                onChangeText={(t) => updateField('policy', t)} 
                multiline 
                numberOfLines={5} 
                mode="outlined" 
                style={styles.input} 
                placeholder="Quy định về trẻ em, thú cưng, hủy phòng..."
            />
        </View>
    );
};

export default HotelFields;