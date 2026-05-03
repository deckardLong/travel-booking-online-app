import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    header: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInfo: {
        marginLeft: 15
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between'
    },
    gridItem: {
        width: '48%',
        marginVertical: 8
    },
    statCard: {
        borderRadius: 15,
        elevation: 2
    },
    cardContent: {
        alignItems: 'center',
        padding: 10
    },

    searchBar: {
        marginBottom: 10,
        borderRadius: 10,
    },
    providerCard: {
        marginVertical: 8,
        borderRadius: 12,
    },
    typeChip: {
        marginRight: 10,
        height: 28,
        backgroundColor: '#e3f2fd',
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingRight: 10
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
        opacity: 0.5,
    },

    menuCard: {
        borderRadius: 15,
        overflow: 'hidden'
    },
    logoutBtn: {
        margin: 20,
        padding: 15,
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
    },
    logoutText: {
        fontWeight: 'bold'
    }
});