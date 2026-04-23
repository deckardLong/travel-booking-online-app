import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    welcomeText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subText: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    surface: {
        padding: 25,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    loginBtn: {
        marginTop: 10,
        borderRadius: 10,
    },
    loginBtnContent: {
        paddingVertical: 8,
    },
    footerLinks: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkTexts: {
        color: '#3b5998',
        fontWeight: '500',
    }
});