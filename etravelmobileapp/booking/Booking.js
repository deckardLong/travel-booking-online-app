import { useEffect, useState } from "react";
import styles from "./Styles";
import moment from 'moment';
import Apis, { authApi, endpoints } from "../configs/Apis";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { Avatar, Button, Card, Divider, RadioButton, TextInput } from "react-native-paper";
import AsyncStorage  from "@react-native-async-storage/async-storage";


const Booking = ({route, navigation}) => {
    const {item, type} = route.params;

    const [bookingDate, setBookingDate] = useState(moment().format('YYYY-MM-DD'));
    const [adultCount, setAdultCount] = useState('1');
    const [childCount, setChildCount] = useState('0');
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(item.price);

    const [paymentMethod, setPaymentMethod] = useState('CASH')
    const paymentMethods = [
        {label: 'Tiền mặt', value: 'CASH', icon: 'cash'},
        {label: 'MoMo', value: 'MOMO', icon: 'wallet'},
        {label: 'ZaloPay', value: 'ZALOPAY', icon: 'credit-card'},
        {label: 'PayPal', value: 'PAYPAL', icon: 'currency-usd'},
        {label: 'Stripe', value: 'STRIPE', icon: 'finance'},
    ]

    useEffect(() => {
        const adults = parseInt(adultCount) || 0;
        const children = parseInt(childCount) || 0;
        const newTotal = (adults * item.price) + (children * item.price * 0.7);
        setTotal(newTotal);
    }, [adultCount, childCount]);

    const handleBooking = async () => {
        const token = await AsyncStorage.getItem("access-token");

        if (!token) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
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
                } else {
                    Alert.alert("Thành công", `Đã xác nhận đơn đặt hàng qua: ${paymentMethod}`);
                    navigation.navigate('Home');
                }
            }
        } catch (ex) {
            console.log("URL:", ex.config?.url);
            console.log("METHOD:", ex.config?.method);
            console.log("DATA:", ex.response?.data);
            console.log("STATUS:", ex.response?.status);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card} mode="elevated">
                <Card.Cover source={{uri: item.image || 'https://via.placeholder.com/400x200'}} />
                <Card.Title
                    title={item.name}
                    subtitle={`Đơn giá: ${item.price?.toLocaleString()} VNĐ`}
                    left={(props) => <Avatar.Icon {...props} icon="calendar-check" />}
                />
            </Card>

            <View style={styles.form}>
                <Text style={styles.label}>Ngày thực hiện dịch vụ (YYYY-MM-DD):</Text> 
                <TextInput
                    mode="outlined"
                    value={bookingDate}
                    onChangeText={setBookingDate}
                    placeholder="2026-05-20"
                    left={<TextInput.Icon icon="calendar-clock" />}
                    style={styles.input}
                />

                <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <Text style={styles.label}>Người lớn</Text>
                        <TextInput
                            mode="outlined"
                            keyboardType="numeric"
                            value={String(adultCount)}
                            onChangeText={setAdultCount}
                        />
                    </View>    
                    <View style={{flex: 1}}>
                        <Text style={styles.label}>Trẻ em</Text>
                        <TextInput
                            mode="outlined"
                            keyboardType="numeric"
                            value={String(childCount)}
                            onChangeText={setChildCount}
                        />
                    </View>    
                </View> 

                <Divider style={styles.divider} />

                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
                    <View style={styles.paymentContainer}>
                        {paymentMethods.map(m => (
                            <View key={m.value} style={styles.paymentOption}>
                                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                                    <Avatar.Icon size={30} icon={m.icon} style={{backgroundColor: '#f8f9fa'}} color="#3b5998" />
                                    <Text style={styles.paymentLabel}>{m.label}</Text>
                                </View>
                                <RadioButton value={m.value} color="#3b5998" />
                            </View>
                    ))}
                    </View>
                </RadioButton.Group>

                <View style={styles.priceSummary}>
                    <Text style={styles.totalLabel}>TỔNG TIỀN TẠM TÍNH</Text>
                    <Text style={styles.totalPrice}>{total.toLocaleString()} VNĐ</Text>
                </View>

                <Button
                    mode='contained'
                    onPress={handleBooking}
                    style={styles.submitBtn}
                    loading={loading}
                    disabled={loading}
                >
                    XÁC NHẬN ĐẶT CHỖ
                </Button>
            </View>
        </ScrollView>
    );
};

export default Booking;