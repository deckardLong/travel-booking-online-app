import { StyleSheet, Platform } from 'react-native';

const PRIMARY_COLOR = '#088395';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Màu nền xám cực nhẹ hiện đại
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 50 : 25, // Đẩy xuống để tránh tai thỏ
        paddingBottom: 10,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    onlineStatus: {
        position: 'absolute',
        bottom: 2,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ADE80', 
        borderColor: '#FFFFFF',
    },
    headerInfo: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    headerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    headerStatus: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    msgWrapper: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMsgWrapper: {
        justifyContent: 'flex-end',
    },
    theirMsgWrapper: {
        justifyContent: 'flex-start',
    },
    avatarSpace: {
        width: 35,
        marginRight: 8,
    },
    bubbleContainer: {
        maxWidth: '75%',
    },
    myBubbleContainer: {
        alignItems: 'flex-end',
    },
    theirBubbleContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: PRIMARY_COLOR,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    msgText: {
        fontSize: 15,
        lineHeight: 20,
    },
    timeText: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 4,
        marginHorizontal: 4,
    },
    inputArea: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: '#F1F5F9',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 15,
        color: '#1E293B',
    },
    sendBtn: {
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    }
});