import React, { useEffect, useState } from "react";
import { Alert, FlatList, View, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Avatar, Button, Card, Divider, Modal, Portal, Text, TextInput, Icon } from "react-native-paper";
import { authApi, endpoints } from "../../../../configs/apis";
import styles from "./ReviewManagerStyles";

const PRIMARY_COLOR = '#088395';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [visible, setVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadReviews = async () => {
        try {
            const token = await AsyncStorage.getItem("access-token");
            const res = await authApi(token).get(endpoints['ratings']);
            setReviews(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể tải danh sách đánh giá!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleReply = (review) => {
        setSelectedReview(review);
        setReplyContent(review.owner_reply || "");
        setVisible(true);
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/150"; 
        
        if (url.startsWith('http')) return url; 
 
        if (url.startsWith('image/upload/')) {
            return `https://res.cloudinary.com/dtavh1b38/${url}`;
        }
        
        return `${HOST}${url.startsWith('/') ? '' : '/'}${url}`; 
    };

    const submitReply = async () => {
        if (!replyContent.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập nội dung phản hồi!");
            return;
        }
        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            const res = await authApi(token).patch(`${endpoints['ratings']}${selectedReview.id}/reply/`, {
                "owner_reply": replyContent
            });

            if (res.status === 200) {
                Alert.alert("Thành công ✨", "Đã cập nhật phản hồi của bạn.");
                setVisible(false);
                loadReviews();
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Gửi phản hồi thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    // Hàm render sao dựa trên điểm số
    const renderStars = (score) => {
        return (
            <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Icon 
                        key={star} 
                        source={star <= score ? "star" : "star-outline"} 
                        size={16} 
                        color={star <= score ? "#FACC15" : "#CBD5E1"} 
                    />
                ))}
            </View>
        );
    };

    const renderItem = ({ item }) => {
        return (
            <Card style={styles.card}>
                <Card.Title
                    // 1. Dùng customer_name trực tiếp từ log
                    title={item.customer_name || "Khách hàng"} 
                    titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    subtitle={
                        <View>
                            {renderStars(item.score)}
                            {/* Hiện tại API chỉ trả về ID service, mình tạm để mã số tour */}
                            <Text style={styles.serviceBadge}>Dịch vụ #{item.service}</Text>
                        </View>
                    }
                    left={(props) => (
                        <Avatar.Image 
                            {...props} 
                            // 2. Dùng customer_avatar trực tiếp vì nó đã là URL Cloudinary
                            source={{ uri: item.customer_avatar || "https://via.placeholder.com/150" }} 
                            size={50}
                            style={{ backgroundColor: '#E2E8F0' }}
                        />
                    )}
                />
                <Card.Content>
                    <Text style={styles.commentText}>"{item.comment}"</Text>

                    {item.owner_reply ? (
                        <View style={styles.replyBox}>
                            <Text style={styles.replyHeader}>Phản hồi từ bạn:</Text>
                            <Text style={styles.replyContent}>{item.owner_reply}</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon source="clock-outline" size={14} color="#94A3B8" />
                            <Text style={styles.noReplyText}> Bạn chưa phản hồi</Text>
                        </View>
                    )}
                </Card.Content> 
                <Card.Actions>
                    <Button
                        mode="text"
                        onPress={() => handleReply(item)}
                        icon={item.owner_reply ? "pencil-outline" : "chat-reply-outline"}
                        textColor={PRIMARY_COLOR}
                    >
                        {item.owner_reply ? "Sửa phản hồi" : "Phản hồi ngay"}
                    </Button>
                </Card.Actions>
            </Card>
        );
    };
    if (loading) return <ActivityIndicator style={styles.loader} size="large" color={PRIMARY_COLOR} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={() => { setRefreshing(true); loadReviews(); }} 
                        colors={[PRIMARY_COLOR]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Icon source="message-draw" size={80} color="#CBD5E1" />
                        <Text style={{ color: '#94A3B8', marginTop: 10 }}>Chưa có đánh giá nào từ khách hàng.</Text>
                    </View>
                }
            />

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Text variant="headlineSmall" style={styles.modalTitle}>Phản hồi khách hàng</Text>
                    <Text style={{ color: '#64748B' }}>Khách hàng: <Text style={{ fontWeight: 'bold' }}>{selectedReview?.customer?.username}</Text></Text>
                    
                    <Divider style={{ marginVertical: 15 }} />

                    <TextInput
                        label="Viết lời cảm ơn hoặc giải đáp..."
                        value={replyContent}
                        onChangeText={setReplyContent}
                        multiline
                        numberOfLines={5}
                        mode="outlined"
                        activeOutlineColor={PRIMARY_COLOR}
                        style={styles.input}
                    />

                    <View style={styles.modalActions}>
                        <Button onPress={() => setVisible(false)} textColor="#64748B" style={{ marginRight: 10 }}>
                            Để sau
                        </Button>
                        <Button
                            mode="contained"
                            onPress={submitReply}
                            loading={submitting}
                            disabled={submitting}
                            style={{ backgroundColor: PRIMARY_COLOR, borderRadius: 12 }}
                        >
                            Gửi phản hồi
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

export default ReviewManager;