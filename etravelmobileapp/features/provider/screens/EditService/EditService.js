import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Button, TextInput, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../../../configs/apis";
import styles from "./EditServiceStyles";
import { decode } from 'html-entities';
import TourFields from "../../services-fields/TourFields"; 
import HotelFields from "../../services-fields/HotelFields";
import TransportFields from "../../services-fields/TransportFields";
import ComboFields from "../../services-fields/ComboFields";

const EditService = ({ route, navigation }) => {
    const { item, type } = route.params || {};

    React.useEffect(() => {
        alert(`Kiểm tra Type: "${type}"`);
    }, [type]);

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    };

    const parseTimeToDate = (timeStr) => {
        if (!timeStr) return new Date();
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0);
        return date;
    };

    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price.toString());
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const cleanText = (text) => {
       if (!text) return "";

        let processedText = text;

        processedText = processedText.replace(/<br\s*\/?>/gi, '\n'); 
        processedText = processedText.replace(/<\/p>/gi, '\n');
        processedText = processedText.replace(/<\/li>/gi, '\n');
        processedText = processedText.replace(/<div>/gi, '\n');

        processedText = processedText.replace(/<[^>]*>?/gm, '');

        return decode(processedText).trim();
    };
    const [description, setDescription] = useState(cleanText(item.description));

    const [tourData, setTourData] = useState({
        startDate: item.start_date ? new Date(item.start_date) : new Date(),
        endDate: item.end_date ? new Date(item.end_date) : new Date(),
        duration: item.duration || '',
        meetingPoint: item.meeting_point || '',
        availableSlots: item.available_slots?.toString() || '0',
        itinerary: cleanText(item.itinerary)
    });

    const [hotelData, setHotelData] = useState({
        starRating: item.star_rating || 3,
        address: item.address || '',
        amenities: cleanText(item.amenities),
        checkinTime: parseTimeToDate(item.checkin_time),
        checkoutTime: parseTimeToDate(item.checkout_time),
        policy: cleanText(item.policy)
    });

    const [transportData, setTransportData] = useState({
        vehicleType: item.vehicle_type || 'BUS',
        fromLocation: item.from_location || '',
        toLocation: item.to_location || '',
        departureTime: item.departure_time ? new Date(item.departure_time) : new Date(),
        arrivalTime: item.arrival_time ? new Date(item.arrival_time) : new Date(),
        seatCapacity: item.seat_capacity?.toString() || '1'
    });

    const [comboData, setComboData] = useState({
        tour: item.tour ? item.tour.map(t => t.id) : [],
        hotel: item.hotel ? item.hotel.map(h => h.id) : [],
        transport: item.transport ? item.transport.map(tr => tr.id) : []
    });

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/400";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });
        if (!result.canceled) setImage(result.assets[0]);
    };

    const handleUpdate = async () => {
        if (!name || !price) {
            Alert.alert("Lưu ý", "Vui lòng nhập tên và giá dịch vụ.");
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
                const fileType = match ? `image/${match[1]}` : `image`;
                form.append('image', { uri: image.uri, name: filename, type: fileType });
            }

            if (type === 'tours') {
                form.append('start_date', tourData.startDate.toISOString());
                form.append('end_date', tourData.endDate.toISOString());
                form.append('duration', tourData.duration);
                form.append('meeting_point', tourData.meetingPoint);
                form.append('available_slots', tourData.availableSlots);
                form.append('itinerary', tourData.itinerary);
            }

            if (type === 'hotels') {
                form.append('star_rating', hotelData.starRating);
                form.append('address', hotelData.address);
                form.append('amenities', hotelData.amenities);
                // Format ngược lại thành string HH:mm để Django hiểu
                form.append('checkin_time', hotelData.checkinTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                form.append('checkout_time', hotelData.checkoutTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                form.append('policy', hotelData.policy);
            }

            if (type === 'transports') {
                form.append('vehicle_type', transportData.vehicleType);
                form.append('from_location', transportData.fromLocation);
                form.append('to_location', transportData.toLocation);
                form.append('departure_time', transportData.departureTime.toISOString());
                form.append('arrival_time', transportData.arrivalTime.toISOString());
                form.append('seat_capacity', transportData.seatCapacity);
            }

            if (type === 'combos') {
                comboData.tour.forEach(id => form.append('tour', id));
                comboData.hotel.forEach(id => form.append('hotel', id));
                comboData.transport.forEach(id => form.append('transport', id));
            }

            const url = `${endpoints.create(type)}${item.id}/`;
            const res = await authApi(token).patch(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
                Alert.alert("Thành công", "Thông tin đã được cập nhật.");
                navigation.navigate('ServiceList');
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể lưu thay đổi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Chỉnh sửa {type === 'tours' ? 'Tour' : 'Dịch vụ'}</Text>
                <IconButton icon="dots-vertical" disabled />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <Text style={styles.sectionLabel}>Thông tin cơ bản</Text>
                
                <TextInput
                    label="Tên dịch vụ"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    activeOutlineColor="#088395"
                    style={styles.input}
                    left={<TextInput.Icon icon="pencil-outline" />}
                />

                <TextInput
                    label="Giá (VNĐ)"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    mode="outlined"
                    activeOutlineColor="#088395"
                    style={styles.input}
                    left={<TextInput.Icon icon="cash-multiple" />}
                />

                {/* FIELDS CHO TOUR */}
                {type === 'tours' && (
                    <TourFields tourData={tourData} setTourData={setTourData} />
                )}

                {type === 'hotels' && (
                    <HotelFields hotelData={hotelData} setHotelData={setHotelData} />
                )}

                {type === 'transports' && (
                    <TransportFields transportData={transportData} setTransportData={setTransportData} />
                )}

                {type === 'combos' && (
                    <ComboFields comboData={comboData} setComboData={setComboData} />
                )}

                <Text style={styles.sectionLabel}>Mô tả chung</Text>
                <TextInput
                    label="Mô tả"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    mode="outlined"
                    activeOutlineColor="#088395"
                    style={styles.input}
                />

                <Text style={styles.sectionLabel}>Hình ảnh dịch vụ</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imageBox} activeOpacity={0.8}>
                    <Image 
                        source={image ? { uri: image.uri } : { uri: getImageUrl(item.image) }} 
                        style={styles.img} 
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlap}>
                        <Text style={styles.imageText}>CHẠM ĐỂ THAY ĐỔI ẢNH</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.buttonGroup}>
                    <Button
                        mode="contained"
                        onPress={handleUpdate}
                        loading={loading}
                        disabled={loading}
                        style={styles.btnSave}
                        labelStyle={styles.btnLabelWhite}
                        icon="content-save-check"
                    >
                        LƯU THAY ĐỔI
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.btnCancel}
                        labelStyle={styles.btnLabelGrey}
                    >
                        HỦY BỎ
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditService;