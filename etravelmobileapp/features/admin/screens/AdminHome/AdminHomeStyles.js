import { StyleSheet, Platform } from 'react-native';

const PRIMARY_COLOR = '#088395'; // Tropical Ocean
const BACKGROUND_COLOR = '#F8FAFC';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    // --- HEADER SECTION ---
    headerContainer: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        borderColor: '#E0F2F1',
    },
    textInfo: {
        marginLeft: 15,
    },
    greeting: {
        color: '#E0F2F1',
        fontSize: 20,
        fontWeight: '500',
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 2,
    },
    // --- STATS GRID ---
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: -25, // Đẩy grid lên đè vào phần bo góc của Header
    },
    gridItem: {
        width: '48%',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statCount: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
    },
    statTitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 2,
    },
    // --- MENU SECTION ---
    section: {
        paddingHorizontal: 20,
        marginTop: 10,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    // --- LOGOUT BUTTON ---
    logoutBtn: {
        marginHorizontal: 20,
        marginVertical: 30,
        paddingVertical: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#EF4444',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    avatarBorder: {
        padding: 3, 
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)', 
    },

});