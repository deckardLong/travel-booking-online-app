import { StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#088395';
export const CRITERIA_WIDTH = 110;
export const COLUMN_WIDTH = 150;

export default StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 15,
        borderRadius: 20,
        maxHeight: '85%',
        elevation: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 10,
    },
    // DataTable
    headerRow: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    criteriaTitle: {
        width: CRITERIA_WIDTH,
    },
    criteriaTitleText: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    valueTitle: {
        width: COLUMN_WIDTH,
        justifyContent: 'center',
    },
    valueTitleText: {
        fontWeight: 'bold',
        color: '#1E293B',
    },
    // Rows
    criteriaCell: {
        width: CRITERIA_WIDTH,
    },
    valueCell: {
        width: COLUMN_WIDTH,
        justifyContent: 'center',
    },
    // Specific cell content
    starWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starText: {
        color: '#F59E0B',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    priceText: {
        color: '#EF4444',
        fontWeight: 'bold',
    },
    ratingBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#475569',
    },
    durationText: {
        fontSize: 13,
        color: '#64748B',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    // Footer
    footerButton: {
        marginTop: 25,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 12,
        paddingVertical: 4,
    },
    footerButtonLabel: {
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});