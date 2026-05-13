import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react"
import { Alert, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import styles from "./RatingStyles";
import { authApi, endpoints } from "../../../configs/apis";

const Rating = ({serviceId, type}) => {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSendRating = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access-token");

            if (!token) {
                Alert.alert("Thông báo", "Vui lòng đăng nhập để thực hiện đánh giá!");
                setLoading(false);
                return;
            }
            const params = new URLSearchParams();
            params.append('score', score);
            params.append('comment', comment);
            
            const res = await authApi(token).post(endpoints['rating'](type, serviceId), 
                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );

            if (res.status === 201 || res.status === 200) {
                Alert.alert("Thành công", "Cảm ơn bạn đã gửi đánh giá!");
                setComment("");
            } 
        } catch (ex) {
            console.log("RATING ERROR:", ex.response?.data);
            Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng kiểm tra lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.title}>Đánh giá dịch vụ này</Text>

                <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <IconButton
                            key={s}
                            icon={s <= score ? "star" : "star-outline"}
                            iconColor="#FFD700"
                            size={30}
                            onPress={() => setScore(s)}
                            style={styles.starButton}
                        />
                    ))}
                    <Text style={styles.scoreText}>{score}/5</Text>
                </View>

                <TextInput
                    label="Nhận xét của bạn..."
                    value={comment}
                    onChangeText={setComment}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    placeholder="Dịch vụ này rất tuyệt vời..."
                />

                <Button
                    mode="contained"
                    onPress={handleSendRating}
                    loading={loading}
                    disabled={loading}
                    style={styles.btn}
                    contentStyle={{height: 45}}
                >
                    GỬI ĐÁNH GIÁ
                </Button>
            </Card.Content>
        </Card>
    );
};

export default Rating;