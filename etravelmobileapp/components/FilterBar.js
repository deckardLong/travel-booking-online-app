import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Chip, Icon, Surface, Text, TextInput } from "react-native-paper";

const FilterBar = ({onSearch}) => {
    const [kw, setKw] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [ordering, setOrdering] = useState('');

    const sortOptions = [
        {label: 'Giá tăng', value: 'price'},
        {label: 'Giá giảm', value: '-price'},
        {label: 'Chất lượng giảm', value: '-average_rating'},
        {label: 'Chất lượng tăng', value: 'average_rating'},
        {label: 'Độ phổ biến tăng', value: 'view_count'},
        {label: 'Độ phổ biến giảm', value: '-view_count'},
        {label: 'Mới nhất', value: '-created_date'},
    ]

    const handleSearch = () => {
        onSearch({
            search: kw,
            min_price: minPrice,
            max_price: maxPrice,
            ordering: ordering,
        });
    };

    return (
        <Surface style={{padding: 15, margin: 10, borderRadius: 12, elevation: 4, backgroundColor: '#fff'}}>
            <TextInput
                label="Tìm kiếm tên, địa điểm..."
                value={kw}
                onChangeText={setKw}
                mode="outlined"
                outlineColor="#ccc"
                activeOutlineColor="#3b5998"
                style={{backgroundColor: '#fff', marginBottom: 15}}
                left={<TextInput.Icon icon="magnify" />}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: '100%'}}>
                <View style={{width: '47%'}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 4}}>Giá từ:</Text>
                    <TextInput
                        value={minPrice}
                        onChangeText={setMinPrice}
                        mode="outlined"
                        keyboardType="numeric"
                        right={<TextInput.Affix text="VNĐ" />}
                        style={{height: 45, backgroundColor: '#fff'}}
                    />
                </View>
                <View style={{width: '47%'}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 4}}>Đến giá:</Text>
                    <TextInput
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                        mode="outlined"
                        keyboardType="numeric"
                        right={<TextInput.Affix text="VNĐ" />}
                        style={{height: 45, backgroundColor: '#fff'}}
                    />
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                    <Text style={{marginRight: 10, fontWeight: 'bold', color: '#333'}}>
                        Sắp xếp theo:
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{flex: 1}}
                        contentContainerStyle={{alignItems: 'center'}}
                    >
                        {sortOptions.map(opt => (
                            <Chip 
                                key={opt.value}
                                selected={ordering === opt.value}
                                onPress={() => setOrdering(opt.value)}
                                style={{
                                    marginRight: 6,
                                    backgroundColor: ordering === opt.value ? '#3b5998' : '#f0f0f0'
                                }}
                                selectedColor="#fff"
                                textStyle={{color: ordering === opt.value ? '#fff' : '#444', fontSize: 13}}
                            >
                                {opt.label}
                            </Chip>
                        ))}
                    </ScrollView>
            </View>
            <Button
                mode="contained"
                onPress={handleSearch}
                style={{borderRadius: 25, paddingVertical: 4, backgroundColor: '#3b5998'}}
                labelStyle={{fontSize: 16, fontWeight: 'bold'}}
            >
                Áp dụng bộ lọc
            </Button>
        </Surface>
    );
};

export default FilterBar;