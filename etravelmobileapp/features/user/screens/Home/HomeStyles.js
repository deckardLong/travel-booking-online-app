import { Dimensions, StyleSheet } from "react-native";

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#3b5998',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    welcomeText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
    },
    userName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    searchBar: {
        borderRadius: 15,
        elevation: 2,
        backgroundColor: '#fff',
    },
    tabContainer: {
        marginVertical: 15,
        paddingLeft: 15,
    },
    chipItem: {
        marginRight: 10,
        paddingHorizontal: 5,
        height: 40,
        borderRadius: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    cardCover: {
        height: 180,
    },
    cardContent: {
        padding: 12,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    itemPrice: {
        color: '#e91e63',
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemSub: {
        color: '#777',
        fontSize: 13,
    },
    loader: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#999',
    }
});