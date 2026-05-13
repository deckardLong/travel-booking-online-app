import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import styles from '../screens/ServiceForm/ServiceFormStyles';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const TourFields = ({ tourData, setTourData }) => {
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const updateField = (field, value) => {
        setTourData(prev => ({ ...prev, [field]: value }));
    };

    const openDatePicker = (currentDate, fieldName) => {
        DateTimePickerAndroid.open({
            value: currentDate || new Date(),
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    updateField(fieldName, selectedDate);
                }
            },
            mode: 'date',
            is24Hour: true,
        });
    };

    return (
        <View style={styles.subSection}>
            <Text style={styles.sectionLabel}>Chi tiết lịch trình Tour</Text>
            
            <View style={styles.row}>
                <TouchableOpacity 
                    onPress={() => openDatePicker(tourData.startDate, 'startDate')} 
                    style={[styles.datePickerBtn, { flex: 1, marginRight: 10 }]}
                >
                    <Text style={styles.dateLabel}>Ngày bắt đầu</Text>
                    <Text style={styles.dateValue}>
                        {tourData.startDate.toLocaleDateString('vi-VN')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => openDatePicker(tourData.endDate, 'endDate')}
                    style={[styles.datePickerBtn, { flex: 1 }]}
                >
                    <Text style={styles.dateLabel}>Ngày kết thúc</Text>
                    <Text style={styles.dateValue}>
                        {tourData.endDate.toLocaleDateString('vi-VN')}
                    </Text>
                </TouchableOpacity>
            </View>

            {showStart && (
                <DateTimePickerAndroid 
                    value={tourData.startDate} 
                    mode="date" 
                    onChange={(e, d) => { setShowStart(false); if(d) updateField('startDate', d); }} 
                />
            )}
            {showEnd && (
                <DateTimePickerAndroid 
                    value={tourData.endDate} 
                    mode="date" 
                    onChange={(e, d) => { setShowEnd(false); if(d) updateField('endDate', d); }} 
                />
            )}

            <TextInput 
                label="Thời lượng (VD: 3 ngày 2 đêm)" 
                value={tourData.duration} 
                onChangeText={(t) => updateField('duration', t)} 
                mode="outlined" 
                style={styles.input} 
                left={<TextInput.Icon icon="clock-outline" color="#94A3B8" />}
            />
            
            <TextInput 
                label="Điểm hẹn đón khách" 
                value={tourData.meetingPoint} 
                onChangeText={(t) => updateField('meetingPoint', t)} 
                mode="outlined" 
                style={styles.input} 
                left={<TextInput.Icon icon="map-marker-radius" color="#94A3B8" />}
            />

            <TextInput 
                label="Số lượng chỗ trống" 
                value={tourData.availableSlots} 
                onChangeText={(t) => updateField('availableSlots', t)} 
                keyboardType="numeric" 
                mode="outlined" 
                style={styles.input} 
                left={<TextInput.Icon icon="account-group" color="#94A3B8" />}
            />

            <TextInput 
                label="Lịch trình chi tiết (Itinerary)" 
                value={tourData.itinerary} 
                onChangeText={(t) => updateField('itinerary', t)} 
                multiline 
                numberOfLines={6} 
                mode="outlined" 
                style={styles.input} 
                placeholder="Ngày 1: Khởi hành... Ngày 2: Tham quan..."
            />
        </View>
    );
};

export default TourFields;