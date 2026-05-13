import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#088395';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 280,
    },
    starBadge: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    starText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 12,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#FFFFFF',
        marginTop: -20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    addressText: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 5,
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 15,
    },
    priceLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E53935',
    },
    chatBtn: {
        borderColor: PRIMARY_COLOR,
        borderRadius: 10,
    },
    highlightBox: {
        flexDirection: 'row',
        backgroundColor: '#F0FDFA',
        padding: 20,
        borderRadius: 15,
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#CCFBF1',
    },
    infoCol: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#B2F5EA',
        height: '100%',
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 15,
        marginBottom: 10,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    amenityChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#F1F5F9',
    },
    amenityText: {
        fontSize: 12,
        color: '#475569',
    },
    accordion: {
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        marginTop: 10,
    },
    accordionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1E293B',
    },
    accordionContent: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#F8FAFC',
    },
    divider: {
        marginVertical: 20,
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    reportBtn: {
        marginTop: 10,
        marginBottom: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        elevation: 10,
    },
    bookBtn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 12,
        paddingVertical: 5,
    },
    bookBtnLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});