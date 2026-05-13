import { StyleSheet, Platform } from 'react-native';

const PRIMARY_COLOR = '#088395'; 
const BACKGROUND_COLOR = '#F1F5F9'; // Nền xám xanh cực nhạt giúp các Card trắng nổi bật hơn

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
    },
    // --- REVENUE CARD (Thẻ Doanh Thu Siêu Cấp) ---
    revenueCard: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 24, // Bo góc lớn hiện đại
        padding: 24,
        marginBottom: 30,
        elevation: 8,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    revenueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    revenueLabel: {
        color: '#CCFBF1', // Xanh mint nhạt
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 12,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    revenueValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    revenueUnit: {
        fontSize: 18,
        fontWeight: '600',
        color: '#99F6E4',
    },
    // --- SECTION HEADERS ---
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingLeft: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginLeft: 8,
    },
    // --- CHARTS & LISTS CARDS ---
    baseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    chartCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    // --- LISTS ---
    listCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingVertical: 10,
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    revenueGain: {
        fontSize: 15,
        fontWeight: '800',
        color: PRIMARY_COLOR,
    },
    // --- EMPTY STATES ---
    emptyStateBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 12,
        textAlign: 'center',
    },
    // --- UTILS ---
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    loadingText: {
        marginTop: 16,
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    exportBtn: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 1.5,
        borderRadius: 12,
    },
    exportBtnLabel: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});