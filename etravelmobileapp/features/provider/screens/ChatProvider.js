import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Text, Surface, Avatar } from 'react-native-paper';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { db } from '../../../configs/firebase';

const ChatProvider = ({ route }) => {
    const { currentUser, chatUser } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

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
        });
        return () => unsubscribe();
    }, [chatId]);

    const sendMessage = () => {
        if (inputText.trim() === '') return;
        const chatRef = ref(db, `chats/${chatId}/messages`);
        push(chatRef, {
            text: inputText,
            senderId: currentUser.id,
            senderName: currentUser.username,
            createdAt: serverTimestamp(),
        });
        setInputText('');
    };

    const renderItem = ({ item }) => {
        const isMine = item.senderId === currentUser.id;
        return (
            <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
                <Surface style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={{ color: isMine ? '#fff' : '#000' }}>{item.text}</Text>
                </Surface>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                inverted 
                contentContainerStyle={{ padding: 10 }}
            />
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Nhập tin nhắn..."
                />
                <Button mode="contained" onPress={sendMessage} style={styles.sendBtn}>Gửi</Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    msgContainer: { marginVertical: 5, flexDirection: 'row' },
    myMsg: { justifyContent: 'flex-end' },
    theirMsg: { justifyContent: 'flex-start' },
    bubble: { padding: 10, borderRadius: 15, maxWidth: '80%', elevation: 2 },
    myBubble: { backgroundColor: '#6200ee', borderBottomRightRadius: 2 },
    theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
    inputArea: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
    input: { flex: 1, height: 40, borderBackgroundColor: '#eee', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
    sendBtn: { borderRadius: 20 }
});

export default ChatProvider;