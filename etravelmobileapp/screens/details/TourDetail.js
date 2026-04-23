import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, Button, Chip, Divider, List } from "react-native-paper";
import styles from "./DetailStyles";
import { Image, ScrollView, View, Text } from "react-native";
import Rating from './Rating';


const TourDetail = ({route, navigation}) => {
    const {id} = route.params;
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTourDetail = async () => {
            try {
                let res = await Apis.get(`${endpoints['tours']}${id}/`);
                setTour(res.data);
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

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{uri: tour?.image}} style={styles.image} />
                <View style={styles.content}>          
                    <Text style={styles.name}>{tour?.name}</Text>
                    <Text style={styles.price}>{tour?.price?.toLocaleString()} VNĐ</Text>
       
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
        </View>
    );
};

export default TourDetail;