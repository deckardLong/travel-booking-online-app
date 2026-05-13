import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Text, SegmentedButtons } from 'react-native-paper';
import styles from '../screens/ServiceForm/ServiceFormStyles';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const TransportFields = ({ transportData, setTransportData }) => {

    const updateField = (field, value) => {
        setTransportData(prev => ({ ...prev, [field]: value }));
    };

    // Hàm chọn DateTime (Chọn Ngày xong sẽ hiện chọn Giờ)
    const openDateTimePicker = (currentDate, fieldName) => {
        DateTimePickerAndroid.open({
            value: currentDate || new Date(),
            onChange: (event, date) => {
                if (event.type === 'set' && date) {
                    // Sau khi chọn ngày, tiếp tục mở chọn giờ
                    DateTimePickerAndroid.open({
                        value: date,
                        onChange: (e, dateTime) => {
                            if (e.type === 'set' && dateTime) {
                                updateField(fieldName, dateTime);
                            }
                        },
                        mode: 'time',
                        is24Hour: true,
                    });
                }
            },
            mode: 'date',
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "Chưa chọn";
        return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <View style={styles.subSection}>
            <Text style={styles.sectionLabel}>Thông tin Vận chuyển</Text>

            <Text style={[styles.dateLabel, { marginBottom: 8, marginTop: 5 }]}>Loại phương tiện</Text>
            <SegmentedButtons
                value={transportData.vehicleType}
                onValueChange={(v) => updateField('vehicleType', v)}
                buttons={[
                    { value: 'BUS', label: 'Xe khách', icon: 'bus' },
                    { value: 'FLIGHT', label: 'Máy bay', icon: 'airplane' },
                    { value: 'SHIP', label: 'Tàu thủy', icon: 'ferry' },
                ]}
                style={{ marginBottom: 15 }}
                theme={{ colors: { secondaryContainer: '#E0F2F1' } }}
            />

            <View style={styles.row}>
                <TextInput 
                    label="Điểm đi" 
                    value={transportData.fromLocation} 
                    onChangeText={(t) => updateField('fromLocation', t)} 
                    mode="outlined" 
                    style={[styles.input, { flex: 1, marginRight: 10 }]} 
                    left={<TextInput.Icon icon="map-marker-up" color="#94A3B8" />}
                />
                <TextInput 
                    label="Điểm đến" 
                    value={transportData.toLocation} 
                    onChangeText={(t) => updateField('toLocation', t)} 
                    mode="outlined" 
                    style={[styles.input, { flex: 1, marginRight: 10 }]} 
                    left={<TextInput.Icon icon="map-marker-check" color="#088395" />}
                />
            </View>

            <View style={styles.row}>
                <TouchableOpacity 
                    onPress={() => openDateTimePicker(transportData.departureTime, 'departureTime')} 
                    style={[styles.datePickerBtn, { flex: 1, marginRight: 10 }]}
                >
                    <Text style={styles.dateLabel}>Thời gian đi</Text>
                    <Text style={styles.dateValue}>{formatDateTime(transportData.departureTime)}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => openDateTimePicker(transportData.arrivalTime, 'arrivalTime')}
                    style={[styles.datePickerBtn, { flex: 1 }]}
                >
                    <Text style={styles.dateLabel}>Thời gian đến</Text>
                    <Text style={styles.dateValue}>{formatDateTime(transportData.arrivalTime)}</Text>
                </TouchableOpacity>
            </View>

            <TextInput 
                label="Số lượng chỗ (Ghế/Giường)" 
                value={transportData.seatCapacity} 
                onChangeText={(t) => updateField('seatCapacity', t)} 
                keyboardType="numeric" 
                mode="outlined" 
                style={styles.input} 
                left={<TextInput.Icon icon="car-seat" color="#94A3B8" />}
            />
        </View>
    );
};

export default TransportFields;