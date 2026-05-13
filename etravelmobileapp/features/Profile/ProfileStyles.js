import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 60,
        alignItems: 'center',
        backgroundColor: '#088395',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 100,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    cameraIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
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
        fontSize: 24,
        letterSpacing: 0.5,
    },
    email: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 15,
        marginBottom: 15,
    },
    editProfileBtn: {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderRadius: 20,
    },
    form: {
        padding: 20,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: -40,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#F8FAFC',
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingHorizontal: 10,
    }
})