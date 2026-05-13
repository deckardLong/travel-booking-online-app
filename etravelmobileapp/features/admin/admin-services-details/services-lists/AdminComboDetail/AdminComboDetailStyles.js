import { StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#088395';
export const ADMIN_DANGER_COLOR = '#EF4444';
export const SUCCESS_COLOR = '#10B981';
export const COMBO_COLOR = '#F59E0B'; // Màu cam đặc trưng cho Combo

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 10,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    comboBadge: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        backgroundColor: COMBO_COLOR,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },
    comboBadgeText: {
        marginLeft: 6,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 12,
    },
    content: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
    // Khu vực hiển thị thông tin trạng thái dành cho Admin
    adminInfoBox: {
        backgroundColor: '#F1F5F9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    adminBoxTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#64748B',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    adminInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    adminInfoLabel: {
        color: '#475569',
        fontSize: 13,
    },
    adminInfoValue: {
        color: '#1E293B',
        fontSize: 13,
        fontWeight: 'bold',
    },
    // Tiêu đề & Giá
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
        lineHeight: 30,
    },
    priceContainer: {
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    // Hộp tóm tắt số lượng dịch vụ
    summaryBox: {
        backgroundColor: '#E0F2F1',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryText: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
    // Danh sách dịch vụ con
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    subServiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    subServiceInfo: {
        flex: 1,
        marginLeft: 12,
    },
    subServiceName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    subServiceDetail: {
        fontSize: 13,
        color: '#64748B',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 20,
    },
});