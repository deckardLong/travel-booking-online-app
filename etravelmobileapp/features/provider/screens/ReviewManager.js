import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../../configs/apis";
import { Alert, FlatList, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Divider, Modal, Portal, Text, TextInput } from "react-native-paper";

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
            const res = await authApi(token).get(endpoints['ratings'])
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
                Alert.alert("Thành công", "Đã gửi phản hồi của bạn.");
                setVisible(false);
                loadReviews();
            }
        } catch (ex) {
            Alert.alert("Lỗi", "Gửi phản hồi thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderItem = ({item}) => (
        <Card style={{margin: 10, elevation: 3}}>
            <Card.Title
                title={item.customer?.username || "Khách hàng"}
                subtitle={`${item.score} - ${item.serivce?.name}`}
                left={(props) => <Avatar.Image {...props} source={{uri: item.customer?.avatar}} />}
            />
            <Card.Content>
                <Text variant="bodyMedium" style={{fontStyle: 'italic', color: '#555'}}>
                    "{item.comment}"
                </Text>

                {item.owner_reply ? (
                    <View style={{marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5}}>
                        <Text style={{fontWeight: 'bold', color: '#6200ee'}}>Phản hồi của bạn:</Text>
                        <Text>{item.owner_reply}</Text>
                    </View>
                ) : (
                    <Text style={{marginTop: 10, color: 'orange', fontSize: 12}}>Chưa có phản hồi</Text>
                )}
            </Card.Content> 
            <Card.Actions>
                <Button
                    mode="contained-tonal"
                    onPress={() => handleReply(item)}
                    icon="reply"
                >
                    {item.owner_reply ? "Sửa phản hồi": "Trả lời khách"}
                </Button>
            </Card.Actions>
        </Card>
    );

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} />;

    return (
        <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onRefresh={() => {
                    setRefreshing(true);
                    loadReviews();
                }}
                refreshing={refreshing}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Chưa có đánh giá nào.</Text>}
            />

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10}}>
                    <Text variant="titleLarge" style={{marginBottom: 10}}>Phản hồi khách hàng</Text>
                    <Divider style={{marginBottom: 15}} />

                    <Text style={{marginBottom: 5, color: '#666'}}>Đang trả lời cho: {selectedReview?.customer?.username}</Text>

                    <TextInput
                        label="Nội dung phản hồi"
                        value={replyContent}
                        onChangeText={setReplyContent}
                        multiline
                        numberOfLines={4}
                        mode="outlined"
                        style={{marginBottom: 15}}
                    />

                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button onPress={() => setVisible(false)} style={{marginRight: 10}}>Hủy</Button>
                        <Button
                            mode="contained"
                            onPress={submitReply}
                            loading={submitting}
                            disabled={submitting}
                        >
                            Gửi
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
};

export default ReviewManager;