import { ScrollView, View } from "react-native";
import { Button, DataTable, IconButton, Modal, Portal, Text } from "react-native-paper";

const CompareModal = ({visible, hideModal, compareList, activeTab}) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    padding: 20,
                    margin: 20,
                    borderRadius: 15,
                    maxHeight: '80%'
                }}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#3b5998'}}>
                        So sánh dịch vụ
                    </Text>
                    <IconButton icon="close" onPress={hideModal} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <DataTable style={{width: compareList.length * 160 + 100}}>
                        <DataTable.Header>
                            <DataTable.Title style={{width: 100}}>Tiêu chí</DataTable.Title>
                            {compareList.map(item => (
                                <DataTable.Title key={item.id} style={{width: 160}}>
                                    {item.name || item.title}
                                </DataTable.Title>
                            ))}
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTable.Cell style={{width: 100}}>Hạng dịch vụ</DataTable.Cell>
                            {compareList.map(item => (
                                <DataTable.Cell key={item.id} style={{width: 160}}>
                                    <Text style={{color: '#ff9800', fontWeight: 'bold'}}>
                                        {item.star_rating ? `${item.star_rating} Sao` : 'Tiêu chuẩn'}
                                    </Text>
                                </DataTable.Cell>
                            ))}
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Giá</DataTable.Cell>
                            {compareList.map(item => (
                                <DataTable.Cell key={item.id}>
                                    <Text style={{color: '#d32f2f', fontWeight: 'bold'}}>
                                        {item.price ? `${item.price.toLocaleString()} đ` : 'Liên hệ'}
                                    </Text>
                                </DataTable.Cell>
                            ))}
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Đánh giá</DataTable.Cell>
                            {compareList.map(item => (
                                <DataTable.Cell key={item.id}>
                                    {item.average_rating || 'N/A'}
                                </DataTable.Cell>
                            ))}
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Loại</DataTable.Cell>
                            {compareList.map(item => (
                                <DataTable.Cell key={item.id}>{activeTab}</DataTable.Cell>
                            ))}
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell style={{width: 100}}>Thời gian</DataTable.Cell>
                            {compareList.map(item => (
                                <DataTable.Cell key={item.id} style={{width: 160}}>
                                    {item.duration || 'N/A'}
                                </DataTable.Cell>
                            ))}
                        </DataTable.Row>
                    </DataTable>
                </ScrollView>

                <Button
                    mode="contained"
                    onPress={hideModal}
                    style={{marginTop: 20, backgroundColor: '#3b5998'}}
                >
                    Quay lại danh sách
                </Button>
            </Modal>
        </Portal>
    )
}

export default CompareModal;