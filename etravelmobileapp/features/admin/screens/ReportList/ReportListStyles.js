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
        paddingTop: 40,
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
    content: {
        flex: 1,
        padding: 15,
    },
    segmentedContainer: {
        marginBottom: 20,
    },
    // --- CARD STYLES ---
    reportCard: {
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
        marginBottom: 12,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    reasonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    targetInfo: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#475569',
    },
    value: {
        fontSize: 13,
        color: '#1E293B',
        flex: 1,
    },
    reportContent: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
        marginVertical: 8,
    },
    // --- ACTIONS ---
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    statusChip: {
        height: 28,
        alignSelf: 'flex-start',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    btnApprove: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        marginLeft: 10,
    },
    // --- UTILS ---
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 16,
        marginTop: 10,
    }
});