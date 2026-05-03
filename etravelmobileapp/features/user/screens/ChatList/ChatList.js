import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator, Avatar, Searchbar, useTheme } from 'react-native-paper';
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
                            if (lastMsg.senderId != currentUser.id && lastMsg.senderName) {
                                otherName = lastMsg.senderName;
                            } else {
                                otherName = `Khách hàng / Đối tác`; 
                            }
                            const date = new Date(lastMsg.createdAt);
                            const timeString = `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;

                            chatHistory.push({
                                id: otherUserId,
                                name: otherName,
                                lastMessage: lastMsg.text,
                                time: timeString,
                                timestamp: lastMsg.createdAt,
                                avatar: 'https://via.placeholder.com/150',
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
        navigation.navigate('ChatProvider', {
            currentUser: currentUser,
            chatUser: { 
                id: item.id, 
                username: item.name 
            }
        });
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => handleNavigateToChat(item)}
        >
            <View style={styles.avatarContainer}>
                <Avatar.Image size={55} source={{ uri: item.avatar }} />
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
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color="#3b5998" />;
    }

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm hội thoại..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 14 }}
                />
            </View>

            <FlatList
                data={filteredChats} 
                keyExtractor={item => item.id.toString()}
                renderItem={renderChatItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Avatar.Icon size={80} icon="chat-outline" style={{ backgroundColor: '#f0f2f5' }} color="#ccc" />
                        <Text style={styles.emptyText}>Chưa có cuộc hội thoại nào</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ChatList;