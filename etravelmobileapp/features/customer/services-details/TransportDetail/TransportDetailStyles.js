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
    typeBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeText: {
        marginLeft: 6,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        fontSize: 12,
    },
    content: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
    },
    routeCard: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 20,
    },
    routePoint: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        marginTop: 4,
    },
    locationName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    routeLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    dashLine: {
        width: 20,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    priceSub: {
        fontSize: 12,
        color: '#64748B',
    },
    chatBtn: {
        borderColor: PRIMARY_COLOR,
        borderRadius: 10,
    },
    highlightGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        backgroundColor: '#F0FDFA',
        padding: 15,
        borderRadius: 15,
    },
    gridItem: {
        alignItems: 'center',
        flex: 1,
    },
    gridValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 5,
    },
    gridLabel: {
        fontSize: 11,
        color: '#64748B',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
    },
    divider: {
        marginVertical: 20,
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