import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react"
import { authApi, endpoints } from "../../../configs/apis";
import { ActivityIndicator, Alert, FlatList, Image, View } from "react-native";
import { Card, IconButton, SegmentedButtons, Surface, Text } from "react-native-paper";

const ServiceList = ({navigation}) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceType, setServiceType] = useState('tours');

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

    const loadServices = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).get(endpoints.create(serviceType));

            setServices(res.data.results || res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices(); 
    }, [serviceType]);

    const confirmDelete = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa dịch vụ này không?", [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Xóa", 
                style: "destructive", 
                onPress: () => handleDelete(id) 
            }
        ]);
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem('access-token');
            const url = `${endpoints.create(serviceType)}${id}/`;
            const res = await authApi(token).delete(url);
            
            if (res.status === 204 || res.status === 200) {
                Alert.alert("Thành công", "Đã xóa dịch vụ");
                loadServices(); 
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Xóa không thành công!");
        }
    };

    const renderServiceItem = ({item}) => (
        <Card style={{marginBottom: 15, marginHorizontal: 10}}>
            <View style={{flexDirection: 'row', padding: 10}}>
                <Image
                    source={{uri: getImageUrl(item.image)}}
                    style={{width: 100, height: 100, borderRadius: 8}}
                />
                <View style={{flex: 1, marginLeft: 15, justifyContent: 'space-between', }}>
                    <View>
                        <Text variant="titleMedium" numberOfLines={1} style={{fontWeight: 'bold'}}>
                            {item.name}
                        </Text>
                        <Text variant="bodyMedium" style={{color: '#e91e63', fontWeight: 'bold'}}>
                            {item.price?.toLocaleString()} VNĐ
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <IconButton
                            icon="pencil"
                            mode="contained-tonal"
                            size={20}
                            onPress={() => navigation.navigate('EditService', {item, type: serviceType})}
                        />
                        <IconButton
                            icon="delete"
                            mode="contained-tonal"
                            iconColor="red"
                            size={20}
                            onPress={() => confirmDelete(item.id)}
                        />
                    </View>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <Surface style={{padding: 15, elevation: 2}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>Dịch vụ của tôi</Text>
                <SegmentedButtons
                    value={serviceType}
                    onValueChange={setServiceType}
                    buttons={[
                        {value: 'tours', label: 'Tour'},
                        {value: 'hotels', label: 'Khách sạn'},
                        {value: 'transports', label: 'Phương tiện'},
                        {value: 'combos', label: 'Combo'},
                    ]}
                />
            </Surface>

            {loading ? (
                <ActivityIndicator style={{marginTop: 50}} size="large" />
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderServiceItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{paddingVertical: 15}}
                    ListEmptyComponent={
                        <Text style={{textAlign: 'center', marginTop: 50, color: '#666'}}>
                            Bạn chưa đăng dịch vụ nào trong mục này.
                        </Text>
                    }
                    onRefresh={loadServices}
                    refreshing={loading}
                />
            )}

            <IconButton
                icon="plus"
                mode="contained"
                containerColor="#3b5998"
                iconColor="white"
                size={30}
                style={{position: 'absolute', right: 20, bottom: 20}}
                onPress={() => navigation.navigate('ServiceForm')}
            />
        </View>
    )
};

export default ServiceList;