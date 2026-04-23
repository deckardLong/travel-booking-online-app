import { Dimensions, StyleSheet } from "react-native";

const {width} = Dimensions.get('window') 

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: width,
        height: 250,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    price: {
        fontSize: 22,
        color: '#e91e63',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    infoBox: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginVertical: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#3b5998',
    },
    description: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        textAlign: 'justify',
    },
    button: {
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#3b5998',
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        justifyContent: 'space-around',
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3b5998',
    }
});