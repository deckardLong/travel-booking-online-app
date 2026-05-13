import React from "react";
import { ScrollView, View } from "react-native";
import { Button, DataTable, IconButton, Modal, Portal, Text, Avatar } from "react-native-paper";
import styles, { PRIMARY_COLOR, CRITERIA_WIDTH, COLUMN_WIDTH } from "./CompareModalStyles";

const CompareModal = ({ visible, hideModal, compareList, activeTab }) => {
    // Tính toán độ rộng tổng thể dựa trên số lượng item
    const totalWidth = (compareList.length * COLUMN_WIDTH) + CRITERIA_WIDTH;

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
            >
                {/* Header Modal */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleWrapper}>
                        <Avatar.Icon size={36} icon="compare" backgroundColor={PRIMARY_COLOR} color="white" />
                        <Text style={styles.headerTitleText}>
                            So sánh {activeTab === 'tours' ? 'Tour' : 'Dịch vụ'}
                        </Text>
                    </View>
                    <IconButton icon="close-circle" iconColor="#94A3B8" size={28} onPress={hideModal} />
                </View>

                {/* Bảng so sánh */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true} persistentScrollbar={true}>
                    <View>
                        <DataTable style={{ width: totalWidth }}>
                            
                            {/* Hàng Header: Tên dịch vụ */}
                            <DataTable.Header style={styles.headerRow}>
                                <DataTable.Title style={styles.criteriaTitle}>
                                    <Text style={styles.criteriaTitleText}>TIÊU CHÍ</Text>
                                </DataTable.Title>
                                {compareList.map(item => (
                                    <DataTable.Title key={item.id} style={styles.valueTitle}>
                                        <Text numberOfLines={1} style={styles.valueTitleText}>
                                            {(item.name || item.title)?.toUpperCase()}
                                        </Text>
                                    </DataTable.Title>
                                ))}
                            </DataTable.Header>

                            {/* Hàng 2: Hạng sao */}
                            <DataTable.Row>
                                <DataTable.Cell style={styles.criteriaCell}>Hạng</DataTable.Cell>
                                {compareList.map(item => (
                                    <DataTable.Cell key={item.id} style={styles.valueCell}>
                                        <View style={styles.starWrapper}>
                                            <Avatar.Icon icon="star" size={16} backgroundColor="transparent" color="#F59E0B" />
                                            <Text style={styles.starText}>
                                                {item.star_rating ? `${item.star_rating}` : 'Std'}
                                            </Text>
                                        </View>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            {/* Hàng 3: Giá tiền */}
                            <DataTable.Row>
                                <DataTable.Cell style={styles.criteriaCell}>Giá vé</DataTable.Cell>
                                {compareList.map(item => (
                                    <DataTable.Cell key={item.id} style={styles.valueCell}>
                                        <Text style={styles.priceText}>
                                            {item.price ? `${item.price.toLocaleString()}đ` : 'Liên hệ'}
                                        </Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            {/* Hàng 4: Đánh giá trung bình */}
                            <DataTable.Row>
                                <DataTable.Cell style={styles.criteriaCell}>Đánh giá</DataTable.Cell>
                                {compareList.map(item => (
                                    <DataTable.Cell key={item.id} style={styles.valueCell}>
                                        <View style={styles.ratingBadge}>
                                            <Text style={styles.ratingText}>
                                                ⭐ {item.average_rating || 'N/A'}
                                            </Text>
                                        </View>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            {/* Hàng 5: Thời gian/Đặc điểm */}
                            <DataTable.Row style={styles.lastRow}>
                                <DataTable.Cell style={styles.criteriaCell}>Thời gian</DataTable.Cell>
                                {compareList.map(item => (
                                    <DataTable.Cell key={item.id} style={styles.valueCell}>
                                        <Text style={styles.durationText}>
                                            {item.duration || 'Linh hoạt'}
                                        </Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                        </DataTable>
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <Button
                    mode="contained"
                    onPress={hideModal}
                    style={styles.footerButton}
                    labelStyle={styles.footerButtonLabel}
                    icon="arrow-left-circle"
                >
                    QUAY LẠI DANH SÁCH
                </Button>
            </Modal>
        </Portal>
    );
};

export default CompareModal;