import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styles from "../styles";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../../configs/apis";

const EditService = ({route, navigation}) => {
    const {item, type} = route.params || {};
    
    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price.toString());
    const [description, setDescription] = useState(item.description);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });
            
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleUpdate = async () => {
        if (!name || !price) {
            Alert.alert("Lỗi", "Tên và giá không được để trống!");
            return;
        }
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("access-token");
            const form = new FormData();
            form.append('name', name);
            form.append('price', price);
            form.append('description', description);

            if (image) {
                const filename = image.uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const fileType = match ? `image/${match[1]}` : `image`;
                form.append('image', { uri: image.uri, name: filename, type: fileType });
            }

            const url = `${endpoints.create(type)}${item.id}/`;
            const res = await authApi(token).patch(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
                Alert.alert("Thành công", "Đã cập nhật thông tin dịch vụ!");
                navigation.navigate('ServiceList');
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Chỉnh sửa {type.toUpperCase()}</Text>

            <TextInput
                label="Tên dịch vụ"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Giá (VNĐ)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Mô tả"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                mode="outlined"
                style={styles.input}
            />

            <Text style={{marginVertical: 10, fontWeight: 'bold'}}>Hình ảnh dịch vụ:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                {image ? (
                    <Image source={{uri: image.uri}} style={styles.img} />
                ) : (
                    <Image source={{ uri: getImageUrl(item.image) }} style={styles.img} />
                )}
                <View style={styles.imageOverlap}>
                    <Text style={{color: '#fff'}}>Chạm để đổi ảnh</Text>
                </View>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleUpdate}
                loading={loading}
                disabled={loading}
                style={[styles.btn, {marginTop: 20}]}
            >
                LƯU THAY ĐỔI
            </Button>

            <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={{marginBottom: 30}}
            >
                HỦY BỎ
            </Button>
        </ScrollView>
    );
};

export default EditService;