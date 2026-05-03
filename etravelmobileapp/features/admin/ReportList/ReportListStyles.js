import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        paddingBottom: 15,
        paddingHorizontal: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    providerCard: {
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    typeChip: {
        height: 30,
        alignSelf: 'center',
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    searchBar: {
        marginBottom: 15,
        elevation: 2,
        borderRadius: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    cardContent: {
        paddingVertical: 10,
    },
    header: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    }
});