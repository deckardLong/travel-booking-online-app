import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        paddingHorizontal: 22,
        paddingBottom: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingBottom: 15,
        paddingHorizontal: 22,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
        marginTop: 25,
        marginBottom: 12,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
        textAlignVertical: 'top',
    },
    imageBox: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
        marginBottom: 30,
        position: 'relative',
        borderWidth: 2,
        borderColor: '#088395', 
        borderStyle: 'solid',
    },
    img: {
        width: '100%',
        height: '100%',
    },
    imageOverlap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
        alignItems: 'center',
    },
    imageText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    buttonGroup: {
        marginTop: 10,
    },
    btnSave: {
        height: 55,
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#088395',
        marginBottom: 15,
    },
    btnCancel: {
        height: 55,
        justifyContent: 'center',
        borderRadius: 16,
        borderColor: '#CBD5E1',
    },
    btnLabelWhite: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    btnLabelGrey: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748B',
    }
});