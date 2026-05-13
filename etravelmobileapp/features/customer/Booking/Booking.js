import React, { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, View, TouchableOpacity } from "react-native";
import { Avatar, Button, Card, Divider, RadioButton, TextInput, Text, Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import { authApi, endpoints } from "../../../configs/apis";
import BookingStyles from "./BookingStyles";

const PRIMARY_COLOR = '#088395';

const Booking = ({ route, navigation }) => {
    const { item, type } = route.params;

    const [bookingDate, setBookingDate] = useState(moment().format('YYYY-MM-DD'));
    const [adultCount, setAdultCount] = useState('1');
    const [childCount, setChildCount] = useState('0');
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(item.price);
    const [paymentMethod, setPaymentMethod] = useState('CASH');

    const paymentMethods = [
        { label: 'Tiền mặt', value: 'CASH', icon: 'cash' },
        { label: 'MoMo', value: 'MOMO', icon: 'wallet' },
        { label: 'ZaloPay', value: 'ZALOPAY', icon: 'credit-card' },
        { label: 'PayPal', value: 'PAYPAL', icon: 'currency-usd' },
        { label: 'Stripe', value: 'STRIPE', icon: 'finance' },
    ];

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    useEffect(() => {
        const adults = Math.max(0, parseInt(adultCount) || 0);
        const children = Math.max(0, parseInt(childCount) || 0);
        // Logic: Trẻ em giảm 30% so với người lớn
        const newTotal = (adults * item.price) + (children * item.price * 0.7);
        setTotal(newTotal);
    }, [adultCount, childCount]);

    const handleBooking = async () => {
        const token = await AsyncStorage.getItem("access-token");
        if (!token) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để thực hiện đặt chỗ.");
            navigation.navigate("Login");
            return;
        }

        if (parseInt(adultCount) <= 0 && parseInt(childCount) <= 0) {
            Alert.alert("Lỗi", "Số lượng khách không hợp lệ.");
            return;
        }

        setLoading(true);
        try {
            const formData = {
                service: item.id,
                booking_date: bookingDate,
                adult_count: parseInt(adultCount),
                child_count: parseInt(childCount),
                unit_price: item.price,
                total_amount: total
            };

            let res = await authApi(token).post(endpoints['bookings'], formData);

            if (res.status === 201) {
                const bookingId = res.data.id;
                let payRes = await authApi(token).post(endpoints['pay'](bookingId), {
                    method_type: paymentMethod
                });

                if (payRes.data.payment_url) {
                    Linking.openURL(payRes.data.payment_url);
                    navigation.navigate('Home'); // Chuyển hướng sau khi mở link thanh toán
                } else {
                    Alert.alert("Thành công 🎉", `Đã xác nhận đơn đặt hàng của bạn.`);
                    navigation.navigate('Home');
                }
            }
        } catch (ex) {
            console.error(ex.response?.data);
            Alert.alert("Lỗi", "Quá trình đặt chỗ thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={BookingStyles.container} showsVerticalScrollIndicator={false}>
            {/* THÔNG TIN DỊCH VỤ */}
            <Card style={styles.card} mode="elevated">
                <Card.Cover source={{ uri: getImageUrl(item.image) }} />
                <Card.Title
                    title={item.name}
                    titleStyle={styles.cardTitle}
                    subtitle={`Đơn giá: ${item.price?.toLocaleString()} VNĐ`}
                    subtitleStyle={styles.priceSubtitle}
                    left={(props) => <Avatar.Icon {...props} icon="tag-outline" backgroundColor={PRIMARY_COLOR} />}
                />
            </Card>

            <View style={styles.form}>
                {/* CHỌN NGÀY */}
                <Text style={styles.sectionTitle}>Thông tin lịch trình</Text>
                <TextInput
                    label="Ngày thực hiện (YYYY-MM-DD)"
                    mode="outlined"
                    value={bookingDate}
                    onChangeText={setBookingDate}
                    placeholder="VD: 2026-05-20"
                    activeOutlineColor={PRIMARY_COLOR}
                    left={<TextInput.Icon icon="calendar-month" color={PRIMARY_COLOR} />}
                    style={styles.input}
                />

                {/* SỐ LƯỢNG KHÁCH */}
                <View style={styles.row}>
                    <View style={[styles.counterContainer, { marginRight: 10 }]}>
                        <Text style={styles.label}>Người lớn</Text>
                        <TextInput
                            mode="flat"
                            keyboardType="numeric"
                            value={String(adultCount)}
                            onChangeText={setAdultCount}
                            activeUnderlineColor={PRIMARY_COLOR}
                            style={{ backgroundColor: 'transparent', height: 40 }}
                        />
                    </View>
                    <View style={styles.counterContainer}>
                        <Text style={styles.label}>Trẻ em (Dưới 12t)</Text>
                        <TextInput
                            mode="flat"
                            keyboardType="numeric"
                            value={String(childCount)}
                            onChangeText={setChildCount}
                            activeUnderlineColor={PRIMARY_COLOR}
                            style={{ backgroundColor: 'transparent', height: 40 }}
                        />
                    </View>
                </View>

                <Divider style={{ marginVertical: 10 }} />

                {/* PHƯƠNG THỨC THANH TOÁN */}
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                {paymentMethods.map((m) => (
                    <TouchableOpacity 
                        key={m.value} 
                        style={[
                            styles.paymentOption, 
                            paymentMethod === m.value && styles.paymentOptionSelected
                        ]}
                        onPress={() => setPaymentMethod(m.value)}
                    >
                        <Icon source={m.icon} size={24} color={paymentMethod === m.value ? PRIMARY_COLOR : "#64748B"} />
                        <Text style={[
                            styles.paymentLabel,
                            paymentMethod === m.value && { color: PRIMARY_COLOR, fontWeight: '700' }
                        ]}>
                            {m.label}
                        </Text>
                        <RadioButton 
                            value={m.value} 
                            status={paymentMethod === m.value ? 'checked' : 'unchecked'}
                            onPress={() => setPaymentMethod(m.value)}
                            color={PRIMARY_COLOR} 
                        />
                    </TouchableOpacity>
                ))}

                {/* TỔNG TIỀN */}
                <View style={styles.priceSummary}>
                    <Text style={styles.totalLabel}>TỔNG TIỀN THANH TOÁN</Text>
                    <Text style={styles.totalPrice}>{total.toLocaleString()} VNĐ</Text>
                    <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>
                        (Đã bao gồm thuế và phí dịch vụ)
                    </Text>
                </View>

                <Button
                    mode='contained'
                    onPress={handleBooking}
                    style={styles.submitBtn}
                    labelStyle={styles.submitLabel}
                    loading={loading}
                    disabled={loading}
                    icon="check-circle"
                >
                    XÁC NHẬN ĐẶT CHỖ
                </Button>
            </View>
        </ScrollView>
    );
};

export default Booking;