import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, Chip, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './FilterBarStyles';

const PRIMARY_COLOR = '#088395';

const FilterBar = ({ onSearch }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // States cho bộ lọc
    const [kw, setKw] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [ordering, setOrdering] = useState('');
    
    // States cho ngày khởi hành
    const [departureDate, setDepartureDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const sortOptions = [
        { label: 'Mới nhất', value: '-created_date' },
        { label: 'Giá tăng dần', value: 'price' },
        { label: 'Giá giảm dần', value: '-price' },
        { label: 'Đánh giá cao', value: '-average_rating' },
        { label: 'Đánh giá thấp', value: 'average_rating' }, 
        { label: 'Nhiều người xem', value: '-view_count' },
        { label: 'Ít người xem', value: 'view_count' },
    ];

    // Xử lý khi chọn ngày
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || departureDate;
        setShowDatePicker(Platform.OS === 'ios'); // iOS giữ nguyên picker, Android tự đóng
        setDepartureDate(currentDate);
    };

    // Format ngày hiển thị (DD/MM/YYYY)
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    // Format ngày gửi API (YYYY-MM-DD)
    const formatApiDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    };

    const handleSearch = () => {
        onSearch({
            search: kw,
            min_price: minPrice,
            max_price: maxPrice,
            ordering: ordering,
            start_date: formatApiDate(departureDate), // Gửi ngày khởi hành cho API
        });
        setIsExpanded(false); 
    };

    const clearFilters = () => {
        setKw('');
        setMinPrice('');
        setMaxPrice('');
        setOrdering('');
        setDepartureDate(null);
        // Tùy chọn: tự động gọi lại search ngay khi xóa lọc
        // onSearch({ search: '', min_price: '', max_price: '', ordering: '', start_date: '' });
    };

    return (
        <Surface style={styles.container} elevation={2}>
            {/* Thanh tìm kiếm chính */}
            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Tìm tên tour, địa điểm..."
                    value={kw}
                    onChangeText={setKw}
                    mode="outlined"
                    outlineColor="#E2E8F0"
                    activeOutlineColor={PRIMARY_COLOR}
                    style={styles.searchInput}
                    left={<TextInput.Icon icon="magnify" color="#64748B" />}
                    onSubmitEditing={handleSearch}
                    dense // Giúp ô input thon gọn hơn
                />
                
                <IconButton
                    icon={isExpanded ? "chevron-up" : "tune-variant"} 
                    iconColor={isExpanded ? PRIMARY_COLOR : "#64748B"}
                    size={24}
                    onPress={() => setIsExpanded(!isExpanded)}
                    style={styles.filterBtn}
                />
            </View>

            {/* Khu vực bộ lọc mở rộng */}
            {isExpanded && (
                <View style={styles.advancedFilters}>
                    
                    {/* Hàng 1: Ngày khởi hành */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                        <View pointerEvents="none">
                            <TextInput
                                label="Ngày khởi hành"
                                value={formatDate(departureDate)}
                                mode="outlined"
                                outlineColor="#E2E8F0"
                                activeOutlineColor={PRIMARY_COLOR}
                                style={styles.inputField}
                                right={<TextInput.Icon icon="calendar-month-outline" color={PRIMARY_COLOR} />}
                                placeholder="Chọn ngày..."
                                dense
                            />
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={departureDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={new Date()} // Không cho chọn ngày trong quá khứ
                        />
                    )}

                    {/* Hàng 2: Khoảng giá */}
                    <View style={styles.row}>
                        <TextInput
                            label="Giá từ tối thiểu"
                            mode="outlined"
                            value={minPrice}
                            onChangeText={setMinPrice}
                            keyboardType="numeric"
                            style={[styles.inputField, { flex: 1, marginRight: 8 }]}
                            outlineColor="#E2E8F0"
                            activeOutlineColor={PRIMARY_COLOR}
                            right={<TextInput.Affix text="đ" />}
                            dense 
                        />
                        <TextInput
                            label="Giá đến tối đa"
                            mode="outlined"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                            keyboardType="numeric"
                            style={[styles.inputField, { flex: 1, marginLeft: 8 }]}
                            outlineColor="#E2E8F0"
                            activeOutlineColor={PRIMARY_COLOR}
                            right={<TextInput.Affix text="đ" />}
                            dense
                        />
                    </View>

                    {/* Hàng 3: Sắp xếp */}
                    <View style={styles.sortSection}>
                        <Text style={styles.sectionTitle}>Sắp xếp theo:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
                            {sortOptions.map(opt => (
                                <Chip
                                    key={opt.value}
                                    selected={ordering === opt.value}
                                    onPress={() => setOrdering(ordering === opt.value ? '' : opt.value)} // Bấm lại để bỏ chọn
                                    style={[styles.sortChip, ordering === opt.value && { backgroundColor: PRIMARY_COLOR }]}
                                    textStyle={{ 
                                        color: ordering === opt.value ? '#fff' : '#475569', 
                                        fontSize: 13, 
                                        fontWeight: ordering === opt.value ? 'bold' : '500' 
                                    }}
                                    showSelectedOverlay={true}
                                >
                                    {opt.label}
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Hàng 4: Các nút hành động */}
                    <View style={styles.actionRow}>
                        <Button
                            mode="outlined"
                            onPress={clearFilters}
                            style={[styles.actionBtn, { borderColor: '#CBD5E1' }]}
                            textColor="#64748B"
                        >
                            Xóa lọc
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSearch}
                            style={[styles.actionBtn, { marginLeft: 10 }]}
                            buttonColor={PRIMARY_COLOR}
                        >
                            Áp dụng
                        </Button>
                    </View>
                </View>
            )}
        </Surface>
    );
};

export default FilterBar;