import { StyleSheet } from "react-native";
 
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#088395', 
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 35,
    },
    iconCircle: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        marginBottom: 20,
        borderWidth: 2, 
        borderColor: 'rgba(255, 255, 255, 0.8)', 
    },
    welcomeText: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 30,
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    subText: {
        color: '#EBF4F6',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '400',
    },
    surface: {
        padding: 28,
        borderRadius: 24, 
        backgroundColor: '#ffffff',
        elevation: 8, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    input: {
        marginBottom: 18,
        backgroundColor: '#F8FAFC', 
        fontSize: 15,
    },
    loginBtn: {
        marginTop: 15,
        borderRadius: 12,
        backgroundColor: '#088395', 
        elevation: 4,
    },
    loginBtnContent: {
        paddingVertical: 8,
        height: 55,
    },
    loginBtnText: {
        fontSize: 18,
        fontWeight: 'bold', 
        letterSpacing: 1.5,
        color: '#ffffff',
        lineHeight: 18,              
        includeFontPadding: false,
    },
    footerLinks: {
        marginTop: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    linkTexts: {
        color: '#088395',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 5,
    }
});