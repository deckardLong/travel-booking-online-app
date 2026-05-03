import { StyleSheet } from "react-native";

export default StyleSheet.create({
    // Dashboard
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
       padding: 30,
       paddingTop: 60,
       borderBottomLeftRadius: 40,
       borderBottomRightRadius: 40
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerInfo: {
        marginLeft: 15,
    },
    welcome: {
        color: '#e0e0e0',
        fontSize: 14,
    },
    name: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    summaryContainer: {
        alignItems: 'center',
        marginTop: -35,
    },
    totalCard: {
        backgroundColor: '#ffffff',
        width: '90%',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    totalLabel: {
        color: '#7f8c8d',
        fontSize: 14,
        marginBottom: 5,
    },
    totalValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 20,
    },
    gridItem: {
        backgroundColor: '#fff',
        width: '47%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderColor: '#eee',
    },
    gridValue: {
        color: '#3b5998',
        fontSize: 20,
        fontWeight: 'bold'
    },
    gridLabel: {
        fontSize: 11,
        marginTop: 5,
        color: '#7f8c8d',
        fontWeight: '600'
    },
    menuSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
    },
    menuCard: {
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    redDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ff1744',
        borderWidth: 2,
        borderColor: '#fff'
    },

    // ServiceForm
    margin: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    imageBox: {
        height: 200,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        overflow: 'hidden',
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    btn: {
        marginTop: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    deleteBtn: {
        marginTop: 15,
        borderColor: 'red',
        borderWidth: 1.5,
        marginBottom: 40,
    },

    // EditService
    imageOverlap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 5,
        alignItems: 'center',
    }
})