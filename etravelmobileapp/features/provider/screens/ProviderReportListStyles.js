import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f8f9fa',
    },
    searchBar: {
        margin: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    loader: {
        marginTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 10,
        borderRadius: 10,
        elevation: 2,
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        alignItems: 'flex-start', 
    },
    serviceName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        flex: 1, 
        marginRight: 10, 
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    reasonText: {
        color: '#E53935',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    contentText: {
        fontSize: 13,
        color: '#555',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 10,
    },
    notePending: {
        fontSize: 12,
        color: '#FF9800',
        fontStyle: 'italic',
    },
    noteResolved: {
        fontSize: 12,
        color: '#E53935',
        fontWeight: 'bold',
    },
    noteDismissed: {
        fontSize: 12,
        color: '#4CAF50',
        fontStyle: 'italic',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    }
});
