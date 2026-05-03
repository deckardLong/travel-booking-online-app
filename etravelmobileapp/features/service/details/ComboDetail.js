import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider, List, Text } from "react-native-paper";
import styles from "./DetailStyles";
import { Image, ScrollView, View } from "react-native";
import apis, { endpoints } from "../../../configs/apis";

const ComboDetail = ({route, navigation}) => {
    const {id} = route.params;
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadComboDetail = async () => {
            try {
                let res = await apis.get(`${endpoints['combos']}${id}/`);
                setCombo(res.data);
            } catch (ex) {
                console.error("Lỗi tải thông tin Combo:", ex);
            } finally {
                setLoading(false);
            }
        };
        loadComboDetail();
    }, [id]);

    if (loading) 
        return <ActivityIndicator style={{flex: 1}} size="large" />;

    if (!combo) 
        return (
            <View style={styles.container}>
                <Text>
                    Không tìm thấy combo
                </Text>
            </View>
        )

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{uri: getImageUrl(combo?.image)}} style={styles.image}/>
                <View style={styles.content}>          
                    <Text style={styles.name}>{combo?.name}</Text>
                    <Text style={styles.price}>Trọn gói: {combo?.price?.toLocaleString()} VNĐ</Text>
       
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Dịch vụ bao gồm:</Text>

                    {combo?.tours?.map(t => (
                        <List.Item key={t.id} title={t.name} description={`${t.duration}`} left={p => <List.Icon {...p} icon="map" />} />
                    ))}

                    {combo?.hotels?.map(h => (
                        <List.Item key={h.id} title={h.name} description={h.address} left={p => <List.Icon {...p} icon="office-building" />} />
                    ))}

                    {combo?.transports?.map(tr => (
                        <List.Item key={tr.id} title={tr.name} description={`${tr.from_location} -> ${tr.to_location}`} left={p => <List.Icon {...p} icon="bus" />} />
                    ))}

                </View>
            </ScrollView>

            <View style={{padding: 15, borderTopWidth: 1, borderColor: '#eee'}}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Booking', {item: combo, type: 'combos'})}
                    style={styles.button}
                >
                    ĐẶT COMBO NGAY
                </Button>
            </View>
        </View>
    );
};

export default ComboDetail;