import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40, 
        paddingHorizontal: 22,
        paddingBottom: 50,
    },
    sectionLabel: {
        fontSize: 20, 
        fontWeight: 'bold',
        color: '#1E293B', 
        marginTop: 20,  
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    segmentedContainer: {
        marginBottom: 25,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 18,
        backgroundColor: '#fff',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        marginBottom: 30,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        color: '#64748B',
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
    },
    btn: {
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#088395',
        elevation: 4,
        shadowColor: '#088395',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    btnLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 40, 
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    datePickerBtn: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    dateValue: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: 'bold',
    },
    subSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    }
});