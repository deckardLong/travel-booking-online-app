import { StyleSheet, Platform, StatusBar } from 'react-native';

const PRIMARY_COLOR = '#088395'; // Tropical Ocean
const DANGER_COLOR = '#EF4444';
const WARNING_COLOR = '#F59E0B';
const SUCCESS_COLOR = '#10B981';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    // --- SEARCH SECTION ---
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20, 
        paddingVertical: 15,   
        justifyContent: 'center',  
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchBar: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        elevation: 0,
    },
    // --- LIST CONTENT ---
    listContent: {
        padding: 15,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
        marginRight: 10,
    },
    // --- BADGES ---
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
    },
    // --- TEXT CONTENT ---
    reasonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 6,
    },
    contentText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
        fontStyle: 'italic',
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 8,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: '#F1F5F9',
    },
    // --- STATUS NOTES (ALERT BOXES) ---
    noteBox: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    noteText: {
        fontSize: 12,
        flex: 1,
        marginLeft: 8,
        lineHeight: 18,
    },
    // --- EMPTY & LOADER ---
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#94A3B8',
        fontSize: 15,
        lineHeight: 22,
    }
});