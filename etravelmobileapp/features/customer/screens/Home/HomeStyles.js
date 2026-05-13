import { Dimensions, StyleSheet, Platform } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#F2F8F9',
    },
    header: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        backgroundColor: '#088395',
        borderBottomLeftRadius: 35, 
        borderBottomRightRadius: 35,
        elevation: 8,
        shadowColor: '#088395',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25, 
    },
   welcomeText: {
        color: 'rgba(255, 255, 255, 0.85)', 
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5, 
        marginBottom: 4,
    },
    userName: {
        color: '#ffffff',
        fontSize: 22, 
        fontWeight: '700', 
        letterSpacing: 0.3,
    },
    avatarBorder: {
        padding: 3, 
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    searchBar: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabContainer: {
        marginVertical: 20,
        paddingLeft: 16,
    },
    chipItem: {
        marginRight: 12,
        paddingHorizontal: 8,
        height: 42, 
        borderRadius: 25, 
    },
    listContent: {
        paddingBottom: 100, 
    },
    card: {
        marginBottom: 20,
        marginHorizontal: 16,
        borderRadius: 20, 
        elevation: 4,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardCover: {
        height: 200, 
    },
    cardContent: {
        padding: 16,
    },
    itemName: {
        fontWeight: '800',
        fontSize: 19,
        color: '#1E293B',
        marginBottom: 4,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    itemPrice: {
        color: '#F77F00', 
        fontWeight: '900',
        fontSize: 18,
    },
    itemSub: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
    loader: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#94A3B8',
        fontSize: 15,
        fontStyle: 'italic',
    }
});