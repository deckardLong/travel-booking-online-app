import React, { useState } from "react";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, SegmentedButtons, Text, TextInput, IconButton, useTheme } from "react-native-paper";
import { authApi, endpoints } from "../../../../configs/apis";
import TourFields from "../../services-fields/TourFields";
import styles from "./ServiceFormStyles";
import HotelFields from "../../services-fields/HotelFields";
import TransportFields from "../../services-fields/TransportFields";
import ComboFields from "../../services-fields/ComboFields";

const ServiceForm = ({ navigation }) => {
    const [serviceType, setServiceType] = useState('tours');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tourData, setTourData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        duration: '',
        meetingPoint: '',
        availableSlots: '0',
        itinerary: ''
    });
    const [hotelData, setHotelData] = useState({
        starRating: 3,
        address: '',
        amenities: '',
        checkinTime: new Date(new Date().setHours(14, 0, 0)),
        checkoutTime: new Date(new Date().setHours(12, 0, 0)),
        policy: ''
    });

    const [transportData, setTransportData] = useState({
        vehicleType: 'BUS',
        fromLocation: '',
        toLocation: '',
        departureTime: new Date(),
        arrivalTime: new Date(),
        seatCapacity: '1'
    });

    const [comboData, setComboData] = useState({
        tour: [],
        hotel: [],
        transport: []
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9], 
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleAdd = async () => {
        if (!name || !price || !image) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tên, giá và chọn một tấm ảnh thật đẹp!");
            return;
        }
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("access-token");
            const form = new FormData();
            form.append('name', name);
            form.append('price', price);
            form.append('description', description);

            if (image) {
                const filename = image.uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                form.append('image', { uri: image.uri, name: filename, type });
            }

            if (serviceType === 'tours') {
                form.append('start_date', tourData.startDate.toISOString());
                form.append('end_date', tourData.endDate.toISOString());
                form.append('duration', tourData.duration);
                form.append('meeting_point', tourData.meetingPoint);
                form.append('available_slots', tourData.availableSlots);
                form.append('itinerary', tourData.itinerary);
            }
            else if (serviceType === 'hotels') {
                form.append('star_rating', hotelData.starRating);
                form.append('address', hotelData.address);
                form.append('amenities', hotelData.amenities);
                form.append('checkin_time', hotelData.checkinTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                form.append('checkout_time', hotelData.checkoutTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                form.append('policy', hotelData.policy);
            } 
            else if (serviceType === 'transports') {
                form.append('vehicle_type', transportData.vehicleType);
                form.append('from_location', transportData.fromLocation);
                form.append('to_location', transportData.toLocation);
                form.append('departure_time', transportData.departureTime.toISOString());
                form.append('arrival_time', transportData.arrivalTime.toISOString());
                form.append('seat_capacity', transportData.seatCapacity);
            } 
            else if (serviceType === 'combos') {
                comboData.tour.forEach(id => form.append('tour', id));
                comboData.hotel.forEach(id => form.append('hotel', id));
                comboData.transport.forEach(id => form.append('transport', id));
            }

            let url = endpoints.create(serviceType);
            const res = await authApi(token).post(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200 || res.status === 201) {
                Alert.alert("Thành công", "Dịch vụ của bạn đã được đăng tải!");
                navigation.goBack();
            }
        } catch (ex) {
            if (ex.response) {
                // Server có phản hồi, nhưng mã lỗi là 4xx, 5xx
                console.log("=== SERVER ERROR DATA ===");
                console.log(JSON.stringify(ex.response.data, null, 2)); // ĐÂY LÀ CHÌA KHÓA
                console.log("STATUS CODE:", ex.response.status);
                console.log("==========================");
                
                // Hiện thông báo chi tiết cho bạn dễ nhìn trên điện thoại
                Alert.alert("Lỗi từ Server", JSON.stringify(ex.response.data));
            } else {
                // Lỗi kết nối hoặc lỗi code
                console.log("ERROR MESSAGE:", ex.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const serviceDetails = {
        tours: {
            label: "Tên dịch vụ / Tour",
            placeholder: "Ví dụ: Tour Đà Nẵng 3 ngày 2 đêm"
        },
        hotels: {
            label: "Tên dịch vụ / Phòng",
            placeholder: "Ví dụ: Khách sạn Mường Thanh - Phòng Deluxe"
        },
        transports: {
            label: "Tên dịch vụ / Xe",
            placeholder: "Ví dụ: Cho thuê xe 16 chỗ đón tiễn sân bay"
        },
        combos: {
            label: "Tên dịch vụ / Combo",
            placeholder: "Ví dụ: Combo Vé máy bay & Khách sạn 4 sao"
        }
    };

    const currentDetail = serviceDetails[serviceType] || serviceDetails.tours;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                
                <View style={styles.topBar}>
                    <Text style={[styles.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>
                        Loại dịch vụ
                    </Text>
                    <IconButton 
                        icon="logout-variant" 
                        iconColor="#64748B" 
                        size={28} 
                        onPress={() => navigation.goBack()} 
                    />
                </View>
                <SegmentedButtons
                    value={serviceType}
                    onValueChange={setServiceType}
                    buttons={[
                        { value: 'tours', label: 'Tour', icon: 'map-outline' },
                        { value: 'hotels', label: 'Phòng', icon: 'bed-outline' },
                        { value: 'transports', label: 'Xe', icon: 'car-outline' },
                        { value: 'combos', label: 'Combo', icon: 'gift-outline' },
                    ]}
                    style={styles.segmentedContainer}
                    theme={{ colors: { secondaryContainer: '#E0F2F1', onSecondaryContainer: '#088395' } }}
                />

                <Text style={styles.sectionLabel}>Thông tin chi tiết</Text>
                <TextInput
                    label={currentDetail.label}
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    outlineColor="#CBD5E1"
                    activeOutlineColor="#088395"
                    style={styles.input}
                    placeholder="Ví dụ: Tour Đà Nẵng 3 ngày 2 đêm"
                />

                <TextInput
                    label="Giá dự kiến (VNĐ)"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    mode="outlined"
                    outlineColor="#CBD5E1"
                    activeOutlineColor="#088395"
                    style={styles.input}
                    left={<TextInput.Icon icon="cash" color="#94A3B8" />}
                />

                {serviceType === 'tours' && (
                    <TourFields tourData={tourData} setTourData={setTourData} />
                )}
                {serviceType === 'hotels' && (
                    <HotelFields hotelData={hotelData} setHotelData={setHotelData} />
                )}
                {serviceType === 'transports' && (
                    <TransportFields transportData={transportData} setTransportData={setTransportData} />
                )}
                {serviceType === 'combos' && (
                    <ComboFields comboData={comboData} setComboData={setComboData} />
                )}

                <TextInput
                    label="Mô tả dịch vụ"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    mode="outlined"
                    outlineColor="#CBD5E1"
                    activeOutlineColor="#088395"
                    style={styles.input}
                    placeholder="Hãy mô tả những điểm hấp dẫn nhất của dịch vụ..."
                />

                <Text style={styles.sectionLabel}>Hình ảnh đại diện</Text>
                <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, image && {borderStyle: 'solid', borderColor: '#088395'}]}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <IconButton icon="camera-plus" size={40} iconColor="#088395" />
                            <Text style={styles.placeholderText}>Nhấn để tải ảnh lên</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Button 
                    mode="contained" 
                    onPress={handleAdd} 
                    loading={loading} 
                    style={styles.btn}
                    labelStyle={styles.btnLabel}
                    icon="cloud-upload"
                >
                    XÁC NHẬN ĐĂNG TẢI
                </Button>
            </View>
        </ScrollView>
    );
};

export default ServiceForm;