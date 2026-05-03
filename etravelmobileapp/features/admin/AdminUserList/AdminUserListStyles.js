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
        borderRadius: 12,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
        fontSize: 15,
    },
    listItem: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 8,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 5,
        elevation: 1, 
        borderWidth: 0.5,
        borderColor: '#f0f0f0',
    },
    titleStyle: {
        fontWeight: 'bold', 
        fontSize: 16,
        color: '#2c3e50',
    },

    avatar: {
        alignSelf: 'center',
        marginLeft: 5,
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 5,
    },
    roleChip: {
        marginBottom: 6,
        height: 24,
    },
    roleChipText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusTextActive: {
        fontSize: 12,
        color: '#4CAF50', 
        fontStyle: 'italic',
        fontWeight: '500',
    },
    statusTextInactive: {
        fontSize: 12,
        color: '#F44336', 
        fontStyle: 'italic',
        fontWeight: '500',
    },
    listContent: {
        paddingBottom: 30,
        paddingTop: 5,
    },
    roleBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12, 
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
});