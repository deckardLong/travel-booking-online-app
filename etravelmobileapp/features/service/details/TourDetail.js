import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider, List } from "react-native-paper";
import styles from "./DetailStyles";
import { Image, ScrollView, View, Text, Alert } from "react-native";
import Rating from '../Rating/Rating';
import apis, { authApi, endpoints } from "../../../configs/apis";
import CustomerReportModal from "../../../components/CustomerReportModal";
import AsyncStorage from "@react-native-async-storage/async-storage";


const TourDetail = ({route, navigation}) => {
    const {id} = route.params;
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportVisible, setReportVisible] = useState(false);

    const handleChatWithProvider = async () => {
        try {
            const providerId = tour?.provider; 

            if (!providerId) {
                Alert.alert("Thông báo", "Không tìm thấy mã nhà cung cấp cho tour này!");
                return;
            }

            const token = await AsyncStorage.getItem("access-token");
            
            if (!token) {
                Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để nhắn tin.", [
                    { text: "Hủy", style: "cancel" },
                    { text: "Đăng nhập ngay", onPress: () => navigation.navigate("Login") }
                ]);
                return;
            }

            let currentUser = null;
            const userStr = await AsyncStorage.getItem("user");

            if (userStr) {
                currentUser = JSON.parse(userStr);
            } else {
                const res = await authApi(token).get(endpoints['current-user']);
                currentUser = res.data;
    
                await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            }
            if (currentUser && currentUser.id === providerId) {
                Alert.alert("Thông báo", "Đây là tour do bạn đăng, không thể tự nhắn tin!");
                return;
            }
            navigation.navigate('ChatProvider', { 
                currentUser: currentUser, 
                chatUser: { 
                    id: providerId, 
                    username: `Nhà cung cấp #${providerId}` 
                }
            });

        } catch (ex) {
            console.error("Lỗi Chat:", ex);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy thông tin người dùng.");
        }
    };

    const getImageUrl = (url) => {
        if (!url) 
            return "https://via.placeholder.com/400"; 
        if (url.startsWith('http')) 
            return url; 

        if (url.startsWith('image/upload/')) {
            return `https://res.cloudinary.com/dtavh1b38/${url}`;            
        }
        return `${HOST}${url.startsWith('/') ? '' : '/'}${url}`; 
    };

    useEffect(() => {
        const loadTourDetail = async () => {
            try {
                let res = await apis.get(`${endpoints['tours']}${id}/`);
                setTour(res.data);
                console.log("URL Ảnh Thực Tế:", getImageUrl(tour?.image));
            } catch (ex) {
                console.error("Lỗi tải Tour:", ex);
            } finally {
                setLoading(false);
            }
        };
        loadTourDetail();
    }, [id]);

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} size="large" />;

    if (!tour) 
        return
        <View style={styles.container}>
            <Text>
                Không tìm thấy tour
            </Text>
        </View>;

    console.log(tour.image)

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{uri: getImageUrl(tour?.image)}} style={styles.image} resizeMode="cover" />
                <View style={styles.content}>          
                    <Text style={styles.name}>{tour?.name}</Text>
                    <Text style={styles.price}>{tour?.price?.toLocaleString()} VNĐ</Text>
                    <Button 
                        icon="chat-outline" 
                        mode="outlined" 
                        onPress={handleChatWithProvider}
                        style={{ borderColor: '#3b5998', marginLeft: 10 }}
                        labelStyle={{ color: '#3b5998', fontSize: 18 }}
                        compact
                    >
                        Nhắn tin
                    </Button>    
                    <View style={styles.infoBox}>
                        <Text>**Thời lượng:** {tour.duration}</Text>
                        <Text>**Điểm hẹn:**{tour.meeting_point}</Text> 
                        <Text>**Ngày khởi hành**: {new Date(tour.start_date).toLocaleDateString()}</Text>
                    </View>
                    
                    <Divider style={{marginVertical: 10}} />
                    <List.Accordion title="Lịch trình chi tiết" left={props => <List.Icon {...props} icon="calendar-text" />}>
                        <Text style={{padding: 10}}>{tour.itinerary || "Đang cập nhật"}</Text>
                    </List.Accordion>

                    <Text style={styles.description}>{tour.description}</Text>
                    <Divider style={{marginVertical: 15}} />
                    <Rating serviceId={tour.id} type="tours" />

                    <Divider style={{marginVertical: 15}} />
                    <Button 
                        icon="alert-octagon" 
                        mode="text" 
                        textColor="#E53935" 
                        onPress={() => setReportVisible(true)}
                        style={{ alignSelf: 'center', marginBottom: 20 }}
                    >
                        Báo cáo dịch vụ này
                    </Button>
                </View>
            </ScrollView>

            <View style={{padding: 15, borderTopWidth: 1, borderColor: '#eee'}}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', {item: tour, type: 'tours'})}
                    style={styles.button}
                >
                    ĐẶT TOUR NGAY
                </Button>
            </View>

            <CustomerReportModal 
                visible={reportVisible} 
                onDismiss={() => setReportVisible(false)} 
                serviceId={tour.id} 
            />
        </View>
    );
};

export default TourDetail;