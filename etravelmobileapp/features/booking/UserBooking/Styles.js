import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    card: {
        margin: 15,
        borderRadius: 12,
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 15,
        color: '#555',
    },
    input: {
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        marginTop: 10,
    },
    divider: {
        marginVertical: 30,
    },
    priceSummary: {
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        color: '#888',
    },
    totalPrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3b5998',
        marginTop: 5,
    },
    submitBtn: {
        marginTop: 30,
        paddingVertical: 5,
        backgroundColor: '#3b5998',
    },
    paymentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    paymentOption: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        elevation: 2,
        borderColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 15,
        color: '#2c3e50',
        borderLeftWidth: 4,
        borderLeftColor: '#3b5998',
        paddingLeft: 10,
    },
    paymentLabel: {
        fontSize: 12,
        marginLeft: 8,
        fontWeight: '500',
        color: '#444',
    }
});