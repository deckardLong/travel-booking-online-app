import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: { width: '100%', height: 280 },
    content: { padding: 20 },
    
    name: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    
    priceContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20 
    },
    price: { fontSize: 20, fontWeight: 'bold', color: '#E53935' },
    chatBtn: { borderColor: '#088395', borderRadius: 10 },

    highlightBox: {
        backgroundColor: '#F1F5F9',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#475569', marginLeft: 10 },
    bold: { fontWeight: 'bold', color: '#1E293B' },

    accordion: { backgroundColor: '#fff', paddingHorizontal: 0 },
    accordionTitle: { fontWeight: 'bold', color: '#1E293B' },
    
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    divider: { marginVertical: 20, backgroundColor: '#E2E8F0' },

    reportBtn: { alignSelf: 'center', marginTop: 10, marginBottom: 30 },

    footer: { 
        padding: 15, 
        borderTopWidth: 1, 
        borderColor: '#F1F5F9',
        backgroundColor: '#fff'
    },
    bookBtn: { backgroundColor: '#088395', borderRadius: 12, paddingVertical: 5 },
    bookBtnLabel: { fontSize: 16, fontWeight: 'bold' }
});