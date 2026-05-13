import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    filterSection: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        marginBottom: 10,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    summarySection: {
        padding: 15,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
        marginLeft: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryCard: {
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 5,
        elevation: 2,
    },
    cardPending: {
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FFEDD5',
    },
    cardActive: {
        backgroundColor: '#F0FDF4', 
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    labelSmall: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 5,
    },
    valueLarge: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    chartBox: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 15,
        borderRadius: 20,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
    },
    listSection: {
        padding: 15,
        paddingBottom: 40,
    },
    serviceCard: {
        marginBottom: 12,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderLeftWidth: 5,
        borderLeftColor: '#088395',
    },
    revenueText: {
        fontWeight: 'bold',
        color: '#27ae60',
        fontSize: 15,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});