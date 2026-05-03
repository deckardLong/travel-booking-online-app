import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { List, Avatar, Searchbar, IconButton, useTheme, Chip } from 'react-native-paper';
import styles from './AdminServiceListStyles';
import Apis, { endpoints } from '../../../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminServiceList = () => {
    const theme = useTheme();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAllServices = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access-token");
            const headers = { 'Authorization': `Bearer ${token}` };

            const [toursRes, hotelsRes, transportsRes, combosRes] = await Promise.all([
                Apis.get(endpoints['services']('tours'), { headers }),
                Apis.get(endpoints['services']('hotels'), { headers }),
                Apis.get(endpoints['services']('transports'), { headers }),
                Apis.get(endpoints['services']('combos'), { headers }),
            ]);

            const tours = toursRes.data.results || toursRes.data;
            const hotels = hotelsRes.data.results || hotelsRes.data;
            const transports = transportsRes.data.results || transportsRes.data;
            const combos = combosRes.data.results || combosRes.data;
            
            const allServices = [...tours, ...hotels, ...transports, ...combos];
            setServices(allServices);
        } catch (error) {
            console.error("Lỗi lấy danh sách dịch vụ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllServices(); }, []);

    const renderItem = ({ item }) => (
        <List.Item
            title={item.name}
            description={`Giá: ${item.price} VND | Chủ: ${item.provider?.username || 'Admin'}`}
            left={props => <Avatar.Image size={45} source={{ uri: item.image }} />}
            right={props => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Chip compact mode="outlined" style={{marginRight: 5}}>
                        {item.active ? "Đang hiện" : "Đang ẩn"}
                    </Chip>
                    <IconButton icon="dots-vertical" onPress={() => {}} />
                </View>
            )}
            style={{ borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}
        />
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Tìm kiếm dịch vụ..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{ margin: 10 }}
            />
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={services}
                    keyExtractor={(item, index) => item.id ? `${item.id}_${index}` : index.toString()} 
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

export default AdminServiceList;