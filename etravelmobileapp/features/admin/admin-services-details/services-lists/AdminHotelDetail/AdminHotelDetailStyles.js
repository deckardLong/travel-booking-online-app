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
    starBadge: {
        position: 'absolute',
        bottom: 40,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    starText: {
        color: '#FFD700',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    content: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
    },
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
        marginBottom: 5,
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
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 20,
    },
    highlightBox: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoCol: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E2E8F0',
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    amenityChip: {
        backgroundColor: '#E2E8F0',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
    },
    accordion: {
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 20,
    }
});