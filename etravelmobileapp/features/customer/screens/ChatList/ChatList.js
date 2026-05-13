import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator, Avatar, Searchbar } from 'react-native-paper';
import styles from './ChatListStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import { db } from '../../../../configs/firebase';
import { authApi, endpoints } from '../../../../configs/apis';

const ChatList = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("access-token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                let userStr = await AsyncStorage.getItem("user");
                let user = null;

                if (userStr) {
                    user = JSON.parse(userStr);
                } else {
                    const res = await authApi(token).get(endpoints['current-user']);
                    user = res.data;
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                }
                setCurrentUser(user);
            } catch (ex) {
                console.error("Lỗi lấy thông tin user:", ex);
            } finally {
                if (!currentUser) setLoading(false); 
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const chatsRef = ref(db, 'chats');
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatHistory = [];

                Object.keys(data).forEach(chatId => {
                    if (chatId.includes(`${currentUser.id}_`) || chatId.includes(`_${currentUser.id}`)) {
                        const ids = chatId.split('_');
                        const otherUserId = ids[0] == currentUser.id ? ids[1] : ids[0];

                        const messagesObj = data[chatId].messages;
                        if (messagesObj) {
                            const msgKeys = Object.keys(messagesObj);
                            const lastMsgKey = msgKeys[msgKeys.length - 1];
                            const lastMsg = messagesObj[lastMsgKey];

                            let otherName = `Người dùng #${otherUserId}`;
                            let otherAvatarPath = null;

                            for (let i = msgKeys.length - 1; i >= 0; i--) {
                                const msg = messagesObj[msgKeys[i]];
                                if (msg.senderId != currentUser.id) { 
                                    if (msg.senderName) otherName = msg.senderName;
                                    if (msg.senderAvatar) otherAvatarPath = msg.senderAvatar;
                                    break; 
                                }
                            }
                            const date = new Date(lastMsg.createdAt);
                            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                            const timeString = `${date.getHours()}:${minutes}`;

                            chatHistory.push({
                                id: otherUserId,
                                name: otherName,
                                lastMessage: lastMsg.text,
                                time: timeString,
                                timestamp: lastMsg.createdAt,
                                avatar: getChatAvatar(otherAvatarPath), 
                                unread: 0, 
                                online: true,
                            });
                        }
                    }
                });

                chatHistory.sort((a, b) => b.timestamp - a.timestamp);
                setChats(chatHistory);
            } else {
                setChats([]); 
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleNavigateToChat = (item) => {
        if (!item || !currentUser) return;

        // 2. Vì dữ liệu trong renderChatItem của bạn đã được "làm phẳng" (flatten),
        // nên ta lấy trực tiếp thông tin từ item.
        // Giả sử item.id lúc này chính là ID của người kia (không phải ID phòng chat).
        
        navigation.navigate('ChatProvider', {
            currentUser: currentUser,
            chatUser: { 
                id: item.id,            // ID của khách hàng
                username: item.name,    // Tên khách hàng
                avatar: item.avatar     // Ảnh khách hàng (đã xử lý getChatAvatar từ trước)
            }
        });
    };

    const getChatAvatar = (avatarPath) => {
        if (!avatarPath) return null; 
        if (avatarPath.startsWith('http')) return avatarPath;
        
        const cloudName = 'dtavh1b38'; 
        return `https://res.cloudinary.com/${cloudName}/${avatarPath}`;
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => handleNavigateToChat(item)}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Avatar.Image size={55} source={{ uri: item.avatar }} />
                ) : (
                    <Avatar.Icon size={55} icon="account" style={{ backgroundColor: '#088395' }} color="#fff" />
                )}
                {item.online && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.lastMessageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC' }} size="large" color="#088395" />;
    }

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
                <Text style={styles.headerSubtitle}>Kết nối và trò chuyện với đối tác</Text>
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm hội thoại..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 15, color: '#1E293B' }}
                    iconColor="#088395" 
                    placeholderTextColor="#94A3B8"
                    elevation={3} 
                />
            </View>

            <FlatList
                data={filteredChats} 
                keyExtractor={item => item.id.toString()}
                renderItem={renderChatItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Avatar.Icon size={80} icon="chat-processing-outline" style={{ backgroundColor: '#EBF4F6' }} color="#088395" />
                        </View>
                        <Text style={styles.emptyText}>Chưa có cuộc hội thoại nào</Text>
                        <Text style={styles.emptySubText}>Khi bạn nhắn tin với nhà cung cấp, cuộc trò chuyện sẽ xuất hiện ở đây.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ChatList;