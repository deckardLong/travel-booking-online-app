import { StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#088395';
export const ADMIN_DANGER_COLOR = '#EF4444';
export const SUCCESS_COLOR = '#10B981';

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
    typeBadge: {
        position: 'absolute',
        bottom: 40,
        right: 15,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    typeText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        fontSize: 12,
    },
    content: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
    // Admin Info Box
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
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    // Tuyến đường (Route)
    routeCard: {
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    routePoint: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: 'bold',
        marginTop: 4,
    },
    locationName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 2,
    },
    routeLineContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dashLine: {
        flex: 1,
        height: 1,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        marginHorizontal: 4,
    },
    // Giá tiền
    priceContainer: {
        marginBottom: 20,
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    priceSub: {
        fontSize: 13,
        color: '#64748B',
    },
    // Lưới thông tin vận hành
    highlightGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F1F5F9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    gridItem: {
        alignItems: 'center',
        flex: 1,
    },
    gridValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 4,
    },
    gridLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
    },
});