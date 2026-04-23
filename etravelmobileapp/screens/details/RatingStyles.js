import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    starButton: {
        margin: 0,
    },
    scoreText: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: "#666",
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    btn: {
        borderRadius: 5,
    }
})