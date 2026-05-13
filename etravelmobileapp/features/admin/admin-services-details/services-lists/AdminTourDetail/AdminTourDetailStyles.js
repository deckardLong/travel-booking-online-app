import { StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#088395';
export const SUCCESS_COLOR = '#10B981';
export const INFO_COLOR = '#3B82F6';

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
        zIndex: 10,
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
        backgroundColor: '#E2E8F0',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
    // Khu vực hiển thị thông tin trạng thái dành cho Admin
    adminStatusSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#F1F5F9',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Thông tin cơ bản
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
        lineHeight: 30,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 20,
    },
    // Lưới thông tin đặc thù của Tour
    infoGrid: {
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    infoText: {
        fontSize: 15,
        color: '#475569',
        marginLeft: 12,
    },
    boldValue: {
        fontWeight: 'bold',
        color: '#1E293B',
    },
    // Thành phần accordion và mô tả
    accordion: {
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 15,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 20,
    },
    footerPadding: {
        height: 50,
    }
});