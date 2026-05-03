import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },
    loadingText: {
        marginTop: 10,
        color: '#64748B',
        fontWeight: '500',
    },
    header: {
        backgroundColor: '#1E293B', 
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    revenueCard: {
        backgroundColor: '#0F172A', 
        borderRadius: 20,
        padding: 24,
        marginBottom: 25,
        alignItems: 'center',
    },
    revenueHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    revenueLabel: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    revenueValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '800',
    },
    revenueUnit: {
        fontSize: 20,
        fontWeight: '500',
        color: '#CBD5E1',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#334155', 
        marginBottom: 12,
        marginLeft: 5,
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lineChart: {
        borderRadius: 16,
        marginLeft: -15, 
    },
    listCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 10,
    },
    listItemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1E293B',
    },
    revenueGain: {
        fontWeight: 'bold',
        color: '#10B981', 
        fontSize: 15,
        marginRight: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        padding: 20,
        fontStyle: 'italic',
    }
});

export default styles;