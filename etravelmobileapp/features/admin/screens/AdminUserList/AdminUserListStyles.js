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
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1,
        paddingVertical: 15,
    },
    searchBar: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        elevation: 0,
        height: 50,
    },
    // --- LIST CONTENT ---
    listContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 30,
    },
    // --- USER CARD ---
    userCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    avatarContainer: {
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    contactText: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 2,
    },
    // --- RIGHT ACTIONS (BADGES) ---
    rightAction: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    // --- EMPTY & LOADER ---
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 15,
        marginTop: 10,
    }
});