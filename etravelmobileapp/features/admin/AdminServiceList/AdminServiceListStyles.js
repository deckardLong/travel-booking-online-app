import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        margin: 12,
        elevation: 3,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    listItem: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 10,
        paddingVertical: 4,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusChip: {
        height: 28,
        justifyContent: 'center',
        marginRight: 8,
    },
    priceText: {
        fontWeight: 'bold',
        color: '#2196F3',
        marginTop: 4,
    },
    providerName: {
        fontSize: 12,
        color: '#757575',
        fontStyle: 'italic',
    }
});