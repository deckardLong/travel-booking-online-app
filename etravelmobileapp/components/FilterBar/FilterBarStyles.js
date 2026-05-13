import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 5,
        borderRadius: 12,
        overflow: 'hidden',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        height: 45, // Giới hạn chiều cao cho gọn
    },
    filterBtn: {
        margin: 0,
        marginLeft: 5,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    advancedFilters: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    inputField: {
        backgroundColor: '#FFFFFF',
        fontSize: 14,
    },
    sortSection: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 8,
    },
    sortScroll: {
        paddingBottom: 5,
        gap: 8,
    },
    sortChip: {
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
    actionBtn: {
        flex: 1,
        borderRadius: 8,
    }
});

export default styles;