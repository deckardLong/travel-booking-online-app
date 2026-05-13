import { StyleSheet, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', 
    },
    headerSurface: {
        paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10, 
        paddingBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 5
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#088395',
        marginBottom: 15,
        textAlign: 'center',
    },
    segmentedContainer: {
        backgroundColor: '#F8FAFC',
    },
    listContent: {
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardRow: {
        flexDirection: 'row',
        padding: 12,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 14,
        backgroundColor: '#E2E8F0',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 22,
    },
    priceTag: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#088395', 
        marginTop: 4,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionBtn: {
        margin: 0,
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#94A3B8',
        fontSize: 15,
        lineHeight: 22,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 25,
        backgroundColor: '#088395',
        borderRadius: 16,
        elevation: 8,
    },
    loader: {
        marginTop: 60,
    }
});