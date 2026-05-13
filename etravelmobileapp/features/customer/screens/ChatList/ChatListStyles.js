import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#088395', 
    },
    searchContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    searchBar: {
        backgroundColor: '#f0f2f5',
        borderRadius: 12,
        elevation: 0,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    chatInfo: {
        flex: 1,
        marginLeft: 15,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1c1e21',
    },
    timeText: {
        fontSize: 12,
        color: '#8e8e8e',
    },
    lastMessageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: '#65676b',
        flex: 1,
        marginRight: 10,
    },
    unreadBadge: {
        backgroundColor: '#3b5998',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#8e8e8e',
        marginTop: 10,
        fontSize: 16,
    }
});