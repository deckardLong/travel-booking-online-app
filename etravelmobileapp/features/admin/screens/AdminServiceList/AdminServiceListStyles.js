import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#088395';
const BACKGROUND_COLOR = '#F8FAFC';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    // --- SEARCH BAR ---
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1,
    },
    searchBar: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        elevation: 0,
        height: 50,
    },
    // --- LIST & CARDS ---
    listContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 40,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 15,
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
        marginRight: 12,
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    // --- INFO SECTION ---
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '800',
        color: PRIMARY_COLOR,
        marginTop: 4,
    },
    providerText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    // --- ACTIONS & BADGES ---
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    approveBtn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
    },
    approveBtnLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 6,
        marginHorizontal: 12,
    },
    // --- UTILS ---
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 15,
        marginTop: 10,
        fontStyle: 'italic',
    }
});