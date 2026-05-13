import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#088395';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 45, // Tùy chỉnh theo notch màn hình
        paddingBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 10,
    },
    searchContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
    },
    listContent: {
        padding: 15,
        paddingBottom: 30,
    },
    // --- CARD STYLES ---
    providerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBorder: {
        padding: 2,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    emailText: {
        fontSize: 13,
        color: '#64748B',
    },
    typeChip: {
        height: 26,
        backgroundColor: '#E0F2F1',
    },
    typeChipText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    // --- ACTIONS ---
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    btnReject: {
        marginRight: 8,
    },
    btnApprove: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
    },
    btnLabel: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    // --- EMPTY STATE ---
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 16,
        marginTop: 15,
        fontWeight: '500',
    }
});