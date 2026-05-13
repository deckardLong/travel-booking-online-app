import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { marginTop: 10, paddingBottom: 20 },
    loader: { marginVertical: 20 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
    
    // Form Styles
    reviewForm: { padding: 15, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 15 },
    formTitle: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 5, textAlign: 'center' },
    starSelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
    input: { backgroundColor: '#F8FAFC', fontSize: 14 },
    divider: { backgroundColor: '#E2E8F0', marginBottom: 20 },
    emptyText: { color: '#64748B', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
    
    // Review Card Styles
    reviewCard: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    headerText: { flex: 1, marginLeft: 12 },
    userName: { fontWeight: 'bold', color: '#334155', fontSize: 15, marginBottom: 2 },
    date: { color: '#94A3B8', fontSize: 12 },
    commentText: { color: '#475569', fontSize: 15, lineHeight: 22, marginBottom: 10 },
    reviewImage: { width: 100, height: 100, borderRadius: 8, marginTop: 5, marginBottom: 10 },
    
    // Reply Box Styles
    replyBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#088395', marginTop: 5 },
    replyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    replyTitle: { fontWeight: 'bold', color: '#088395', fontSize: 13, marginLeft: 6 },
    replyText: { color: '#475569', fontSize: 14, lineHeight: 20 },
    replyDate: { color: '#94A3B8', fontSize: 11, marginTop: 5, fontStyle: 'italic' },
})