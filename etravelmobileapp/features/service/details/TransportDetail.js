import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider, List, Text } from "react-native-paper";
import styles from "./DetailStyles";
import { Image, ScrollView, View } from "react-native";
import apis, { endpoints } from "../../../configs/apis";


const TransportDetail = ({route, navigation}) => {
    const {id} = route.params;
    const [transport, setTransport] = useState(null);
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
        const loadTransportDetail = async () => {
            try {
                let res = await apis.get(`${endpoints['transports']}${id}/`);
                setTransport(res.data);
            } catch (ex) {
                console.error("Lỗi tải chi tiết phương tiện:", ex);
            } finally {
                setLoading(false);
            }
        };
        loadTransportDetail();
    }, [id]);

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} size="large" />;

    if (!transport) 
        return (
            <View style={styles.container}>
                <Text>
                    Không tìm thấy phương tiện
                </Text>
            </View>
        )

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{uri: getImageUrl(transport?.image)}} style={styles.image} />
                <View style={styles.content}>
                    <Text style={styles.name}>{transport?.name}</Text>
                    <View style={styles.routeBox}>
                        <Text style={styles.location}>{transport?.from_location}</Text>
                        <List.Icon icon="arrow-right" />
                        <Text style={styles.location}>{transport?.to_location}</Text>
                    </View>

                    <Text style={styles.price}>{transport?.price?.toLocaleString()} VNĐ</Text>

                    <View style={styles.infoBox}>
                        <Text>**Loại phương tiện:** {transport?.vehicle_type}</Text>
                        <Text>**Số chỗ:** {transport?.seat_capacity}</Text>
                        <Text>**Khởi hành:** {new Date(transport?.departure_time).toLocaleString()}</Text> 
                    </View>
                </View>
            </ScrollView>

            <View style={{padding: 15, borderTopWidth: 1, borderColor: '#eee'}}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', {item: transport, type: 'transports'})}
                    style={styles.button}
                >
                    ĐẶT PHƯƠNG TIỆN NGAY
                </Button>
            </View>
        </View>
    );
};

export default TransportDetail;