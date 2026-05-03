import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#3b5998',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    name: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 10,
    },
    email: {
        color: '#dae0ee',
        marginBottom: 10,
    },
    form: {
        padding: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    btnSave: {
        margin: 10,
        paddingVertical: 5,
    },
    btnLogout: {
        marginTop: 20,
        borderColor: '#ff4d4d',
    },
    listItem: {
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 10,
        elevation: 2,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingHorizontal: 10,
    }
})