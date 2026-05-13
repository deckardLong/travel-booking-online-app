import { StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#088395';
export const ADMIN_DANGER_COLOR = '#EF4444';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 10,
        elevation: 2,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginLeft: 10 },
    imageContainer: { position: 'relative' },
    image: { width: '100%', height: 250, resizeMode: 'cover' },
    adminBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: ADMIN_DANGER_COLOR,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
    },
    adminBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
    comboBadge: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        backgroundColor: '#F59E0B', // Màu cam nổi bật cho Combo
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    comboBadgeText: { marginLeft: 5, fontWeight: 'bold', color: '#FFF', fontSize: 12 },
    content: { padding: 15, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20 },
    
    // Admin Box
    adminInfoBox: {
        backgroundColor: '#FFF1F2',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FECDD3',
    },
    adminBoxTitle: { fontWeight: 'bold', fontSize: 15, color: ADMIN_DANGER_COLOR, marginBottom: 10, textTransform: 'uppercase' },
    adminInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
    adminInfoLabel: { color: '#475569', fontSize: 14 },
    adminInfoValue: { color: '#1E293B', fontSize: 14, fontWeight: 'bold' },
    
    // Info
    name: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 10, lineHeight: 30 },
    priceContainer: { marginBottom: 15 },
    priceLabel: { fontSize: 13, color: '#64748B', marginBottom: 2 },
    priceValue: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_COLOR },
    
    summaryBox: {
        backgroundColor: '#E0F2F1',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryText: { color: PRIMARY_COLOR, fontWeight: 'bold', marginLeft: 8, fontSize: 14, flex: 1 },
    
    // Sub Services List
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
    subServiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    subServiceInfo: { flex: 1, marginLeft: 12 },
    subServiceName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
    subServiceDetail: { fontSize: 13, color: '#64748B' },
    
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 20 },
});