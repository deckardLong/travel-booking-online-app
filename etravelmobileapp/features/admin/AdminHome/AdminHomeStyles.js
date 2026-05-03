import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f4f7f9' ,
    },
    header: {
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    userInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    textInfo: { 
        marginLeft: 15, 
    },
    boldText: { 
        fontWeight: 'bold', 
    },
    grid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        padding: 10, 
        justifyContent: 'space-between', 
    },
    gridItem: { 
        width: '48%', 
        marginVertical: 8, 
    },
    statCard: { 
        borderRadius: 15, 
        elevation: 2,
    },
    cardContent: { 
        alignItems: 'center', 
        padding: 10, 
    },
    statTitle: { 
        color: '#666', 
        marginTop: 5, 
    },
    section: { 
        padding: 20, 
    },
    sectionTitle: { 
        marginBottom: 15, 
        fontWeight: 'bold', 
        color: '#333', 
    },
    menuCard: { 
        borderRadius: 15, 
        backgroundColor: '#fff', 
        overflow: 'hidden',
    },
    logoutBtn: { 
        margin: 20, 
        padding: 15, 
        alignItems: 'center', 
        borderRadius: 15, 
        borderWidth: 1, 
        borderColor: '#F44336', 
    },
    logoutText: { 
        color: '#F44336', 
        fontWeight: 'bold' 
    }
});