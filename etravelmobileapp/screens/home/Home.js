import React, { act, useEffect, useState } from 'react';
import { View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Searchbar, Chip, Surface, Avatar, List } from 'react-native-paper';
import Apis, { endpoints } from '../../configs/Apis';
import styles from './Styles';


const Home = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('tours');

    const tabs = [
        {id: 'tours', name: 'Tour du lịch', icon: 'map-marker-path'},
        {id: 'hotels', name: 'Khách sạn', icon: 'bed'},
        {id: 'transports', name: 'Phương tiện', icon: 'bus'},
        {id: 'combos', name: 'Combo du lịch', icon: 'package-variant'},
    ];

    const loadData = async (tabId) => {
        setLoading(true);
        setData([]);
        setActiveTab(tabId);
        try {
            let res = await Apis.get(endpoints[tabId]);
            setData(res.data.results);
        } catch (ex) {
            console.error(`Lỗi tải dữ liệu ${tabId}:`, ex);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData('tours');
    }, []);

    const getScreenName = (tab) => {
        switch (tab) {
            case 'tours': return 'TourDetail';
            case 'hotels': return 'HotelDetail';
            case 'transports': return 'TransportDetail';
            case 'combos': return 'ComboDetail';
            default: return 'TourDetail';
        }
    }

    const renderItem = ({item}) => (
        <Card
            style={styles.card}
            onPress={() => navigation.navigate(getScreenName(activeTab), {
                id: item.id,
                type: activeTab
            })}
        >
            <Card.Cover 
                source={{uri: item.image || 'https://via.placeholder.com/400x200'}} 
                style={styles.cardCover}
            />
            <Card.Content style={styles.cardContent}>
                <Text style={styles.itemName} numberOfLines={1}>
                    {item.name || item.title}
                </Text>

                {activeTab === 'transports' && item.from_location && (
                    <Text style={{color: '#666', fontSize: 13, marginBottom: 5}}>
                        {item.from_location} <List.Icon icon="arrow-right" /> {item.to_location}
                    </Text>
                )}

                <View style={styles.itemFooter}>
                    <Text style={styles.itemSub}>
                        {item.average_rating || (activeTab === 'hotels' ? item.star_rating : "Chưa có đánh giá")}
                    </Text>
                    <Text style={styles.itemPrice}>
                        {item.price ? `${item.price.toLocaleString()} VNĐ`: 'Liên hệ'}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    const filteredData = data.filter(item => 
        (item.name || item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Surface style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.welcomeText}>Xin chào,</Text>
                        <Text style={styles.userName}>Deckard Long</Text>
                    </View>
                    <Avatar.Icon size={48} icon="account-circle" color="#3b5998" style={{backgroundColor: '#fff'}} />
                </View>
                <Searchbar
                    placeholder={`Tìm kiếm ${activeTab}...`}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#3b5998"
                />
            </Surface>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map(tab => (
                        <Chip
                            key={tab.id}
                            icon={tab.icon}
                            selected={activeTab == tab.id}
                            onPress={() => loadData(tab.id)}
                            style={styles.chipItem}
                            selectedColor='#fff'
                            backgroundColor={activeTab === tab.id ? '#3b5998' : '#e0e0e0'}
                            textStyle={{color: activeTab === tab.id ? '#fff' : '#666'}}
                        >
                            {tab.name}
                        </Chip>
                    ))}
                </ScrollView>
            </View>
        
            {loading ? (
                <ActivityIndicator style={styles.loader} color="#3b5998" size="large" />
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không tìm thấy kết quả nào</Text> 
                    }
                />
            )}
        </View>
    );
};

export default Home;