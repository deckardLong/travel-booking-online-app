import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { Text, Avatar, TextInput, Button, Divider, Surface, Icon, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis, { endpoints } from '../../configs/apis';
import styles from './ReviewSectionStyles';

const PRIMARY_COLOR = '#088395';

const ReviewSection = ({ serviceId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Form đăng đánh giá mới
    const [myScore, setMyScore] = useState(5);
    const [myComment, setMyComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const initData = async () => {
            await fetchCurrentUser();
            await fetchReviews();
        };
        initData();
    }, [serviceId]);

    const fetchCurrentUser = async () => {
        try {
            const userStr = await AsyncStorage.getItem("user");
            if (userStr) setCurrentUser(JSON.parse(userStr));
        } catch (ex) {
            console.error("Lỗi lấy thông tin user:", ex);
        }
    };

    const fetchReviews = async () => {
        try {
            // Lọc rating theo ID của service (Django FilterBackend)
            let res = await apis.get(`${endpoints['ratings']}?service=${serviceId}`);
            setReviews(res.data.results || res.data);
        } catch (ex) {
            console.error("Lỗi tải đánh giá:", ex);
        } finally {
            setLoading(false);
        }
    };

    const handlePostReview = async () => {
        if (!myComment.trim()) return Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá.");
        if (!currentUser) return Alert.alert("Yêu cầu", "Vui lòng đăng nhập để đánh giá.");

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem("access-token");
            
            // Payload khớp với model Rating của bạn
            const payload = {
                service: serviceId,
                score: myScore,
                comment: myComment
            };

            const res = await apis.post(endpoints['ratings'], payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Cập nhật giao diện: Thêm review mới lên đầu
            setReviews([res.data, ...reviews]);
            setMyComment('');
            setMyScore(5);
            Alert.alert("Thành công", "Cảm ơn bạn đã để lại đánh giá!");
        } catch (ex) {
            console.error("Lỗi đăng đánh giá:", ex);
            Alert.alert("Lỗi", "Bạn đã đánh giá dịch vụ này rồi hoặc có lỗi xảy ra.");
        } finally {
            setSubmitting(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return "https://api.dicebear.com/7.x/initials/png?seed=User&backgroundColor=088395";
        if (url.startsWith('http')) return url;
        return `https://res.cloudinary.com/dtavh1b38/${url}`;
    };

    // Component nhỏ để render dãy sao (1-5)
    const StarRating = ({ score, size = 16 }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <Icon 
                        key={star} 
                        source={star <= score ? "star" : "star-outline"} 
                        color="#F59E0B" 
                        size={size} 
                    />
                ))}
            </View>
        );
    };

    // Kiểm tra xem user hiện tại đã review chưa (dựa vào unique_together)
    const hasReviewed = currentUser && reviews.some(r => r.customer?.id === currentUser.id || r.customer === currentUser.id);

    if (loading) return <ActivityIndicator size="small" color={PRIMARY_COLOR} style={styles.loader} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đánh giá & Nhận xét ({reviews.length})</Text>

            {/* Form đăng đánh giá (Chỉ hiện nếu user chưa từng đánh giá) */}
            {!hasReviewed && currentUser ? (
                <Surface style={styles.reviewForm} elevation={1}>
                    <Text style={styles.formTitle}>Trải nghiệm của bạn thế nào?</Text>
                    
                    {/* Chấm điểm (Chọn sao) */}
                    <View style={styles.starSelector}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <IconButton
                                key={star}
                                icon={star <= myScore ? "star" : "star-outline"}
                                iconColor="#F59E0B"
                                size={30}
                                onPress={() => setMyScore(star)}
                                style={{ margin: 0 }}
                            />
                        ))}
                    </View>

                    <TextInput
                        mode="outlined"
                        placeholder="Chia sẻ cảm nhận của bạn về dịch vụ..."
                        value={myComment}
                        onChangeText={setMyComment}
                        style={styles.input}
                        outlineColor="#E2E8F0"
                        activeOutlineColor={PRIMARY_COLOR}
                        multiline
                        numberOfLines={3}
                    />
                    <Button 
                        mode="contained" 
                        onPress={handlePostReview} 
                        loading={submitting}
                        disabled={submitting}
                        buttonColor={PRIMARY_COLOR}
                        style={{ marginTop: 10, alignSelf: 'flex-end' }}
                    >
                        Gửi đánh giá
                    </Button>
                </Surface>
            ) : null}

            <Divider style={styles.divider} />

            {/* Danh sách các bài đánh giá */}
            {reviews.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm!</Text>
            ) : (
                reviews.map((item, index) => {
                    // Lấy dữ liệu từ trường tùy chỉnh mà Django trả về
                    const avatarPath = item.customer_avatar || null;
                    const reviewerName = item.customer_name || 'Khách hàng';

                    return (
                        <View key={item.id || index} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                {/* Đã sửa: Truyền avatarPath vào đây */}
                                <Avatar.Image 
                                    size={40} 
                                    source={{ uri: getImageUrl(avatarPath) }} 
                                />
                                <View style={styles.headerText}>
                                    {/* Đã sửa: Truyền reviewerName vào đây */}
                                    <Text style={styles.userName}>
                                        {reviewerName}
                                    </Text>
                                    <StarRating score={item.score} />
                                </View>
                                {/* Format ngày nếu có */}
                                {item.created_date && (
                                    <Text style={styles.date}>
                                        {new Date(item.created_date).toLocaleDateString('vi-VN')}
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.commentText}>{item.comment}</Text>

                            {/* Hiển thị ảnh kèm theo nếu khách có đăng ảnh */}
                            {item.image && (
                                <Image source={{ uri: getImageUrl(item.image) }} style={styles.reviewImage} />
                            )}

                            {/* HIỂN THỊ PHẢN HỒI CỦA NHÀ CUNG CẤP (owner_reply) */}
                            {item.owner_reply && (
                                <View style={styles.replyBox}>
                                    <View style={styles.replyHeader}>
                                        <Icon source="reply-circle" color={PRIMARY_COLOR} size={18} />
                                        <Text style={styles.replyTitle}>Phản hồi từ Nhà cung cấp</Text>
                                    </View>
                                    <Text style={styles.replyText}>{item.owner_reply}</Text>
                                    {item.reply_date && (
                                        <Text style={styles.replyDate}>
                                            Trả lời lúc: {new Date(item.reply_date).toLocaleDateString('vi-VN')}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })
            )}
        </View>
    );
};

export default ReviewSection;