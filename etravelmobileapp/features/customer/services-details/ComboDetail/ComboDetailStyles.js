import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#088395';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageHeader: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 250,
    },
    comboBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    comboBadgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 11,
        marginLeft: 5,
    },
    content: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    chatBtn: {
        borderColor: PRIMARY_COLOR,
        borderRadius: 10,
    },
    summaryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDFA',
        padding: 12,
        borderRadius: 10,
        marginBottom: 25,
    },
    summaryText: {
        marginLeft: 10,
        color: PRIMARY_COLOR,
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    subServiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    subServiceInfo: {
        flex: 1,
        marginLeft: 15,
    },
    subServiceName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    subServiceDetail: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    divider: {
        marginVertical: 25,
    },
    reportBtn: {
        marginTop: 10,
        marginBottom: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 10,
    },
    bookBtn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 12,
        paddingVertical: 5,
    },
    bookBtnLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});