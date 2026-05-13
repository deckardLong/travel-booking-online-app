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
    typeBadge: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeText: { marginLeft: 5, fontWeight: 'bold', color: PRIMARY_COLOR, fontSize: 12 },
    content: { padding: 15, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20 },
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
    name: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 15, lineHeight: 30 },
    
    // Route Card
    routeCard: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
    routePoint: { flex: 1 },
    locationLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold', marginTop: 4 },
    locationName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginTop: 2 },
    routeLineContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
    dashLine: { flex: 1, height: 1, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', marginHorizontal: 4 },
    
    // Price
    priceContainer: { marginBottom: 15 },
    priceValue: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_COLOR },
    priceSub: { fontSize: 13, color: '#64748B' },
    
    // Highlight Grid
    highlightGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F5F9', padding: 15, borderRadius: 12, marginBottom: 15 },
    gridItem: { alignItems: 'center', flex: 1 },
    gridValue: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
    gridLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
    
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
});