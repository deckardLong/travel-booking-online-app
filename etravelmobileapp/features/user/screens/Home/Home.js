import React, { act, useEffect, useState } from 'react';
import { View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Searchbar, Chip, Surface, Avatar, List, Button, FAB } from 'react-native-paper';
import FilterBar from '../../../../components/FilterBar';
import CompareModal from '../../../../components/CompareModal';
import apis, { authApi, endpoints } from '../../../../configs/apis';
import styles from './HomeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('tours');
    const [filterParams, setFilterParams] = useState({});

    const [compareList, setCompareList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("access-token");
                if (!token) return; 

                let userStr = await AsyncStorage.getItem("user");
                
                if (userStr) {
                    setUser(JSON.parse(userStr));
                } else {
                    const res = await authApi(token).get(endpoints['current-user']);
                    setUser(res.data);

                    await AsyncStorage.setItem("user", JSON.stringify(res.data));
                }
            } catch (ex) {
                console.error("Lỗi tải thông tin user ở Home:", ex);
            }
        };
        
        fetchUser();
    }, []);

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

    const getAvatarUri = () => {
        if (!user?.avatar) return 'https://via.placeholder.com/150';
        if (user.avatar.startsWith('http')) return user.avatar;
        return `https://res.cloudinary.com/dtavh1b38/${user.avatar}`; 
    };

    const handleContactProvider = () => {
        const currentUser = { 
            id: 10, 
            username: 'customer01',
            avatar: 'https://i.pravatar.cc/150?img=11' 
        }; 

        const providerUser = { 
            id: 6, 
            username: 'provider06',
            avatar: 'https://i.pravatar.cc/150?img=12'
        };

        navigation.navigate('ChatProvider', {
            currentUser: currentUser,
            chatUser: providerUser
        });
    };

    const toggleCompare = (item) => {
        setCompareList(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists)
                return prev.filter(i => i.id !== item.id);
            
            if (prev.length >= 3) {
                alert("Chỉ so sánh tối đa 3 mục!");
                return prev;
            }
            return [...prev, item];
        });
    };

    const fetchTabItems = async () => {
        if (!hasNextPage) return;

        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            let queryParts = Object.keys(filterParams)
                .filter(key => filterParams[key] !== '' && filterParams[key] !== null)
                .map(key => `${key}=${filterParams[key]}`);

            queryParts.push(`page=${page}`);
            if (searchQuery) queryParts.push(`q=${searchQuery}`); 

            let queryString = queryParts.join('&');
            let url = `${endpoints[activeTab]}?${queryString}`;

            console.log("[API CALL] Đang gọi URL: ", url);
            let res = await apis.get(url);

            const newItems = res.data.results || [];

            if (page === 1) {
                setData(newItems); 
            } else {
                setData(prev => [...prev, ...newItems]); 
            }

            if (res.data.next === null) {
                setHasNextPage(false);
            }
        } catch (ex) {
            console.error(`Lỗi tải dữ liệu ${activeTab}:`, ex);
            if (page === 1) setData([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const tabs = [
        {id: 'tours', name: 'Tour du lịch', icon: 'map-marker-path'},
        {id: 'hotels', name: 'Khách sạn', icon: 'bed'},
        {id: 'transports', name: 'Phương tiện', icon: 'bus'},
        {id: 'combos', name: 'Combo du lịch', icon: 'package-variant'},
    ];

    const loadData = async (tabId, params = {}) => {
        setLoading(true);
        setData([]);
        setActiveTab(tabId);
        try {
            let query = Object.keys(params).map(key => params[key] ? `${key}=${params[key]}` : '').filter(item => item !== '').join('&');
            let url = query ? `${endpoints[tabId]}?${query}` : endpoints[tabId];

            console.log("Đang gọi API URL: ", url);
            let res = await apis.get(url);
            setData(res.data.results);
        } catch (ex) {
            console.error(`Lỗi tải dữ liệu ${tabId}:`, ex);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasNextPage(true);
    }, [activeTab, JSON.stringify(filterParams), searchQuery]);

    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0) {
                fetchTabItems();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [activeTab, JSON.stringify(filterParams), searchQuery, page]);

    const handleLoadMore = () => {
        console.log("--- PHÁT HIỆN HÀNH ĐỘNG KÉO XUỐNG ĐÁY ---");
        console.log("1. Đang tải trang 1? (loading):", loading);
        console.log("2. Đang tải thêm? (loadingMore):", loadingMore);
        console.log("3. Server còn trang không? (hasNextPage):", hasNextPage);
        console.log("4. Số lượng item trên màn hình:", data.length);

        if (!loading && !loadingMore && hasNextPage && data.length > 0) {
            console.log("=> ĐỦ ĐIỀU KIỆN! Chuẩn bị nhảy lên page:", page + 1);
            setPage(prev => prev + 1);
        } else {
            console.log("=> BỊ CHẶN LẠI! Hãy nhìn các dòng phía trên xem biến nào đang ngăn cản.");
        }
    };

    const handleTabChange = (tabId) => {
        if (activeTab !== tabId) {
            setActiveTab(tabId);
            setFilterParams({}); 
            setSearchQuery('');  
        }
    };

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
                source={{uri: getImageUrl(item.image) || 'https://via.placeholder.com/400x200'}} 
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
            <Card.Actions>
                <Button
                    icon={compareList.find(i => i.id === item.id) ? "check-circle" : "scale-balance"}
                    mode={compareList.find(i => i.id === item.id) ? "contained" : "outlined"}
                    onPress={() => toggleCompare(item)}
                    style={{borderRadius: 8}}
                    buttonColor={compareList.find(i => i.id === item.id) ? "#4CAF50" : undefined}
                >
                    {compareList.find(i => i.id === item.id) ? "Đã chọn" : "So sánh"}
                </Button>
            </Card.Actions>
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
                        <Text style={styles.userName}>
                            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Khách'}
                        </Text>
                    </View>
                    {user?.avatar ? (
                        <Avatar.Image size={58} source={{ uri: getAvatarUri() }} />
                    ) : (
                        <Avatar.Icon size={58} icon="account-circle" color="#3b5998" style={{backgroundColor: '#fff'}} />
                    )}
                </View>
                <FilterBar onSearch={(params) => setFilterParams(params)} />
            </Surface>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map(tab => (
                        <Chip
                            key={tab.id}
                            icon={tab.icon}
                            selected={activeTab == tab.id}
                            onPress={() => handleTabChange(tab.id)}
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
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}

                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}

                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không tìm thấy kết quả nào</Text> 
                    }
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#3b5998" style={{marginVertical: 20}} /> : null}
                />
            )}
            <FAB
                icon="compare"
                label={`So sánh (${compareList.length})`}
                style={{position: 'absolute', margin: 16, right: 0, bottom: 20}}
                onPress={() => setModalVisible(true)}
                color='#fff'
                backgroundColor='#3b5998'
            />

            <CompareModal
                visible={modalVisible}
                hideModal={() => setModalVisible(false)}
                compareList={compareList}
                activeTab={activeTab}
            />

            <Button 
                icon="chat" 
                mode="contained" 
                onPress={handleContactProvider}
                style={{ margin: 10 }}
            >
                Nhắn tin với nhà cung cấp
            </Button>

        </View>
    );
};

export default Home;