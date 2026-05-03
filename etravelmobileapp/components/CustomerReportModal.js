import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis, { endpoints } from '../configs/apis';
import styles from './CustomerReportModalStyles';

const CustomerReportModal = ({ visible, onDismiss, serviceId }) => {
    const [reason, setReason] = useState('OTHER');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const submitReport = async () => {
        if (!content.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập nội dung chi tiết báo cáo.");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");

            const data = {
                service: serviceId,
                reason: reason,
                content: content
            };
            console.log("=== DỮ LIỆU CHUẨN BỊ GỬI LÊN ===", data);

            await apis.post(endpoints['customer-report'], data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            Alert.alert("Thành công", "Báo cáo của bạn đã được gửi tới Admin. Cảm ơn bạn đã phản hồi!");

            setContent('');
            setReason('OTHER');
            onDismiss();

        } catch (error) {
            console.error("Lỗi gửi báo cáo:", error);
            Alert.alert("Lỗi", "Không thể gửi báo cáo lúc này. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Text style={styles.title}>Báo cáo dịch vụ này</Text>
                
                <Text style={styles.label}>Lý do báo cáo:</Text>
                <RadioButton.Group onValueChange={newValue => setReason(newValue)} value={reason}>
                    <RadioButton.Item label="Dấu hiệu lừa đảo" value="SCAM" labelStyle={{ fontSize: 14 }} />
                    <RadioButton.Item label="Thông tin sai sự thật" value="INCORRECT_INFO" labelStyle={{ fontSize: 14 }} />
                    <RadioButton.Item label="Chất lượng dịch vụ kém" value="BAD_SERVICE" labelStyle={{ fontSize: 14 }} />
                    <RadioButton.Item label="Lý do khác" value="OTHER" labelStyle={{ fontSize: 14 }} />
                </RadioButton.Group>

                <TextInput
                    label="Chi tiết sự việc..."
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                />

                <View style={styles.buttonGroup}>
                    <Button mode="text" onPress={onDismiss} disabled={loading} style={{ marginRight: 10 }}>
                        Hủy
                    </Button>
                    <Button mode="contained" onPress={submitReport} loading={loading} disabled={loading} buttonColor="#E53935">
                        Gửi báo cáo
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default CustomerReportModal;