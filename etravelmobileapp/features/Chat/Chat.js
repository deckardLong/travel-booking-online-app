import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { Text, Surface, Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { db } from '../../configs/firebase';
import styles from './ChatStyles';

const PRIMARY_COLOR = '#088395';

const ChatProvider = ({ route, navigation }) => {
    const { currentUser, chatUser } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);

    const chatId = currentUser.id > chatUser.id 
        ? `${currentUser.id}_${chatUser.id}` 
        : `${chatUser.id}_${currentUser.id}`;

    useEffect(() => {
        const chatRef = ref(db, `chats/${chatId}/messages`);
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setMessages(parsed.sort((a, b) => b.createdAt - a.createdAt));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [chatId]);

    const getImageUrl = (url) => {
        if (!url) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const chatRef = ref(db, `chats/${chatId}/messages`);
        push(chatRef, {
            text: inputText,
            senderId: currentUser.id,
            senderName: currentUser.username,
            senderAvatar: currentUser.avatar,
            createdAt: serverTimestamp(),
        });
        setInputText('');
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item, index }) => {
        const isMine = item.senderId === currentUser.id;
        const showAvatar = !isMine && (index === 0 || messages[index - 1].senderId !== item.senderId);

        return (
            <View style={[styles.msgWrapper, isMine ? styles.myMsgWrapper : styles.theirMsgWrapper]}>
                {!isMine && (
                    <View style={styles.avatarSpace}>
                        {showAvatar && (
                            <Avatar.Image 
                                size={32} 
                                source={{ uri: getImageUrl(item.senderAvatar) }} 
                            />
                        )}
                    </View>
                )}
                
                <View style={[styles.bubbleContainer, isMine ? styles.myBubbleContainer : styles.theirBubbleContainer]}>
                    <Surface style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                        <Text style={[styles.msgText, { color: isMine ? '#fff' : '#1E293B' }]}>
                            {item.text}
                        </Text>
                    </Surface>
                    <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    console.log("=== DEBUG HEADER AVATAR ===");
    console.log("1. Full chatUser object:", JSON.stringify(chatUser, null, 2));
    console.log("2. chatUser.avatar value:", chatUser.avatar);
    console.log("3. Final URL from getImageUrl:", getImageUrl(chatUser.avatar));
    console.log("============================");

    console.log(getImageUrl(chatUser.avatar));

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.container}
        >
            {/* Header tùy chỉnh */}
            <Surface style={styles.header} elevation={3}>
                <View style={styles.headerLeft}>
                    <IconButton 
                        icon="arrow-left" 
                        onPress={() => navigation.goBack()} 
                        size={24}
                    />
                    <View style={styles.avatarWrapper}>
                        <Avatar.Image 
                            size={42} 
                            source={{ uri: getImageUrl(chatUser.avatar) }} 
                        />
                        <View style={styles.onlineStatus} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName} numberOfLines={1}>
                            {chatUser.username || "Khách hàng"}
                        </Text>
                        <Text style={styles.headerStatusText}>Đang trực tuyến</Text>
                    </View>
                </View>
                <IconButton icon="phone-outline" iconColor={PRIMARY_COLOR} onPress={() => {}} />
            </Surface>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color={PRIMARY_COLOR} />
            ) : (
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    inverted 
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Surface style={styles.inputArea} elevation={4}>
                <IconButton icon="plus" iconColor="#64748B" />
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor="#94A3B8"
                    multiline
                />
                <TouchableOpacity 
                    onPress={sendMessage} 
                    style={[styles.sendBtn, { backgroundColor: inputText.trim() ? PRIMARY_COLOR : '#E2E8F0' }]}
                    disabled={!inputText.trim()}
                >
                    <IconButton icon="send" iconColor="#fff" size={20} />
                </TouchableOpacity>
            </Surface>
        </KeyboardAvoidingView>
    );
};

export default ChatProvider;