import { StyleSheet } from "react-native";

const PRIMARY_COLOR = '#088395';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    // --- SERVICE CARD ---
    card: {
        margin: 15,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#1E293B',
    },
    priceSubtitle: {
        color: PRIMARY_COLOR,
        fontWeight: '700',
        fontSize: 15,
    },
    // --- FORM ---
    form: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 12,
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    counterContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    label: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 5,
        fontWeight: '600',
    },
    // --- PAYMENT ---
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    paymentOptionSelected: {
        borderColor: PRIMARY_COLOR,
        backgroundColor: '#F0FDFA',
    },
    paymentLabel: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#475569',
        fontWeight: '500',
    },
    // --- SUMMARY ---
    priceSummary: {
        backgroundColor: '#F1F5F9',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    totalPrice: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1E293B',
        marginTop: 5,
    },
    submitBtn: {
        marginTop: 25,
        paddingVertical: 8,
        borderRadius: 15,
        backgroundColor: PRIMARY_COLOR,
    },
    submitLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});