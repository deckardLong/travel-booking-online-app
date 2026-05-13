import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    listContent: {
        padding: 12,
        paddingBottom: 30,
    },
    // --- REVIEW CARD ---
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    serviceBadge: {
        fontSize: 12,
        color: '#088395',
        fontWeight: 'bold',
        backgroundColor: '#E0F2F1',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    commentText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#334155',
        fontStyle: 'italic',
        marginTop: 8,
    },
    // --- REPLY BOX ---
    replyBox: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#088395',
    },
    replyHeader: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#088395',
        marginBottom: 4,
    },
    replyContent: {
        fontSize: 14,
        color: '#475569',
    },
    noReplyText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 10,
    },
    // --- MODAL ---
    modalContainer: {
        backgroundColor: 'white',
        padding: 24,
        margin: 20,
        borderRadius: 25,
        elevation: 10,
    },
    modalTitle: {
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        marginTop: 15,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    // --- LOADER & EMPTY ---
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    }
});