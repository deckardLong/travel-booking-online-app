import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider } from "react-native-paper";
import styles from "./DetailStyles";
import { Image, ScrollView, Text, View } from "react-native";
import apis, { endpoints } from "../../../configs/apis";


const HotelDetail = ({route, navigation}) => {
    const {id} = route.params;
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const loadHotelDetail = async () => {
            try {
                let res = await apis.get(`${endpoints['hotels']}${id}/`);
                setHotel(res.data);
            } catch (ex) {
                console.error("Lỗi tải khách sạn:", ex);
            } finally {
                setLoading(false);
            }
        };
        loadHotelDetail();
    }, [id]);

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} size="large" />;

    if (!hotel) 
        return (
            <View style={styles.container}>
                <Text>
                    Không tìm thấy khách sạn
                </Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{uri: getImageUrl(hotel?.image)}} style={styles.image} />
                <View style={styles.content}>          
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.name}>{hotel?.name}</Text>
                        <Text style={{color: '#FFD700', marginLeft: 10}}>{hotel?.star_rating}</Text>
                    </View>

                    <Text style={styles.address}>{hotel?.address}</Text>
                    <Text style={styles.price}>{hotel?.price?.toLocaleString()} VNĐ/đêm</Text>
       
                    <View style={styles.infoBox}>
                        <Text>**Nhận phòng** {hotel?.checkin_time}</Text>
                        <Text>**Trả phòng** {hotel?.checkout_time}</Text>
                    </View>

                    <Text style={{fontWeight: 'bold', marginTop: 15}}>Chính sách khách sạn:</Text>
                    <Text style={styles.description}>{hotel?.policy}</Text>
                </View>
            </ScrollView>

            <View style={{padding: 15, borderTopWidth: 1, borderColor: '#eee'}}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', {item: hotel, type: 'hotels'})}
                    style={styles.button}
                >
                    ĐẶT PHÒNG NGAY
                </Button>
            </View>
        </View>
    );
};

export default HotelDetail;