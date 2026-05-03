import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../../configs/apis";
import styles from "../styles";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

const ServiceForm = ({navigation}) => {  
    const [serviceType, setServiceType] = useState('tours');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleAdd = async () => {
        if (!name || !price || !image) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
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
                const type = match ? `image/${match[1]}` : `image`;
                form.append('image', {uri: image.uri, name: filename, type}); 
            }

            let url = endpoints.create(serviceType);
            const res = await authApi(token).post(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200 || res.status === 201) {
                Alert.alert("Thành công", "Đã thêm dịch vụ mới!");
                navigation.goBack();
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể thêm dịch vụ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Đăng dịch vụ mới</Text>     
                <SegmentedButtons
                    value={serviceType}
                    onValueChange={setServiceType}
                    buttons={[
                        {value: 'tours', label: 'Tour'},
                        {value: 'hotels', label: 'Khách sạn'},
                        {value: 'transports', label: 'Phương tiện'},
                        {value: 'combos', label: 'Combo'},
                    ]}
                    style={styles.margin}
                />
      

            <TextInput label="Tên" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
            <TextInput label="Giá" value={price} onChangeText={setPrice} keyboardType="numeric" mode="outlined" style={styles.input} />
            <TextInput label="Mô tả" value={description} onChangeText={setDescription} multiline numberOfLines={4} mode="outlined" style={styles.input} />

            <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
                {image ? (
                    <Image source={{uri: image.uri}} style={styles.img} />
                ) : (
                    <Text>Chọn hình ảnh</Text>
                )}
            </TouchableOpacity>

            <Button mode="contained" onPress={handleAdd} loading={loading} style={styles.btn}>
                ĐĂNG TẢI
            </Button>
        </ScrollView>
    )
};

export default ServiceForm;