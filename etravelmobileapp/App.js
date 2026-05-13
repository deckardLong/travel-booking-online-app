import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, PaperProvider } from "react-native-paper";

// --- IMPORTS AUTH ---
import Login from "./features/auth/screens/Login.js";
import Register from "./features/auth/screens/Register.js";

// --- IMPORTS CHUNG ---
import Profile from "./features/Profile/Profile.js";
import ChatProvider from "./features/Chat/Chat.js";

// --- IMPORTS CUSTOMER ---
import Home from "./features/customer/screens/Home/Home.js";
import ChatList from "./features/customer/screens/ChatList/ChatList.js";
import MyBookings from "./features/customer/screens/MyBookings/MyBookings.js";
import Booking from "./features/customer/Booking/Booking.js";
import TourDetail from "./features/customer/services-details/TourDetail/TourDetail.js";
import HotelDetail from "./features/customer/services-details/HotelDetail/HotelDetail.js";
import TransportDetail from "./features/customer/services-details/TransportDetail/TransportDetail.js";
import ComboDetail from "./features/customer/services-details/ComboDetail/ComboDetail.js";

// --- IMPORTS PROVIDER ---
import Dashboard from "./features/provider/screens/Dashboard/Dashboard.js";
import ServiceList from "./features/provider/screens/ServiceList/ServiceList.js";
import ServiceForm from "./features/provider/screens/ServiceForm/ServiceForm.js";
import EditService from "./features/provider/screens/EditService/EditService.js";
import ReviewManager from "./features/provider/screens/ReviewManager/ReviewManager.js";
import Statistics from "./features/provider/screens/Statistics/Statistics.js";
import ProviderReportList from "./features/provider/screens/ProviderReportList/ProviderReportList.js";

// --- IMPORTS ADMIN ---
import AdminHome from "./features/admin/screens/AdminHome/AdminHome.js";
import AdminUserList from "./features/admin/screens/AdminUserList/AdminUserList.js";
import ReportList from "./features/admin/screens/ReportList/ReportList.js";
import AdminServiceList from "./features/admin/screens/AdminServiceList/AdminServiceList.js";
import AdminStatistics from "./features/admin/screens/AdminStatistics/AdminStatistics.js";
import ApproveProvider from "./features/admin/screens/ApproveProvider/ApproveProvider.js";
import AdminTourDetail from "./features/admin/admin-services-details/services-lists/AdminTourDetail/AdminTourDetail.js";
import AdminHotelDetail from "./features/admin/admin-services-details/services-lists/AdminHotelDetail/AdminHotelDetail.js";
import AdminTransportDetail from "./features/admin/admin-services-details/services-lists/AdminTransportDetail/AdminTransportDetail.js";
import AdminComboDetail from "./features/admin/admin-services-details/services-lists/AdminComboDetail/AdminComboDetail.js";
import AdminTourDetailReport from "./features/admin/admin-services-details/services-reports/AdminTourDetailReport/AdminTourDetailReport.js";
import AdminHotelDetailReport from "./features/admin/admin-services-details/services-reports/AdminHotelDetailReport/AdminHotelDetailReport.js";
import AdminTransportDetailReport from "./features/admin/admin-services-details/services-reports/AdminTransportDetailReport/AdminTransportDetailReport.js";
import AdminComboDetailReport from "./features/admin/admin-services-details/services-reports/AdminComboDetailReport/AdminComboDetailReport.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// 1. CẤU HÌNH CÁC BOTTOM TABS
// ==========================================

const CustomerTabs = () => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#3b5998', tabBarInactiveTintColor: 'gray', headerShown: false }}>
    <Tab.Screen name="HomeTab" component={Home} options={{ tabBarLabel: 'Trang chủ', tabBarIcon: ({color, size}) => <Icon source="home" color={color} size={size} /> }} />
    <Tab.Screen name="BookingsTab" component={MyBookings} options={{ tabBarLabel: 'Đơn hàng', tabBarIcon: ({color, size}) => <Icon source="clipboard-text-clock" color={color} size={size} /> }} />
    <Tab.Screen name="ChatTab" component={ChatList} options={{ tabBarLabel: 'Tin nhắn', tabBarIcon: ({color, size}) => <Icon source="chat-processing" color={color} size={size} /> }} />
    <Tab.Screen name="ProfileTab" component={Profile} options={{ tabBarLabel: 'Cá nhân', tabBarIcon: ({color, size}) => <Icon source="account" color={color} size={size} /> }} />
  </Tab.Navigator>
);

const ProviderTabs = () => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#0F766E', tabBarInactiveTintColor: 'gray', headerShown: false }}>
    <Tab.Screen name="DashboardTab" component={Dashboard} options={{ tabBarLabel: 'Tổng quan', tabBarIcon: ({color, size}) => <Icon source="view-dashboard" color={color} size={size} /> }} />
    <Tab.Screen name="ServiceListTab" component={ServiceList} options={{ tabBarLabel: 'Dịch vụ', tabBarIcon: ({color, size}) => <Icon source="format-list-bulleted" color={color} size={size} /> }} />
    <Tab.Screen name="ChatTab" component={ChatList} options={{ tabBarLabel: 'Tin nhắn', tabBarIcon: ({color, size}) => <Icon source="chat" color={color} size={size} /> }} />
    <Tab.Screen name="ProfileTab" component={Profile} options={{ tabBarLabel: 'Cá nhân', tabBarIcon: ({color, size}) => <Icon source="account" color={color} size={size} /> }} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#1E293B', tabBarInactiveTintColor: 'gray', headerShown: false }}>
    <Tab.Screen name="AdminHomeTab" component={AdminHome} options={{ tabBarLabel: 'Quản trị', tabBarIcon: ({color, size}) => <Icon source="shield-account" color={color} size={size} /> }} />
    {/* ROUTE TAB ĐÁY: Đã thêm chữ "Tab" vào name để không trùng với Stack */}
    <Tab.Screen name="AdminUserListTab" component={AdminUserList} options={{ tabBarLabel: 'Người dùng', tabBarIcon: ({color, size}) => <Icon source="account-group" color={color} size={size} /> }} />
    <Tab.Screen name="ReportListTab" component={ReportList} options={{ tabBarLabel: 'Báo cáo', tabBarIcon: ({color, size}) => <Icon source="alert-decagram" color={color} size={size} /> }} />
    <Tab.Screen name="ProfileTab" component={Profile} options={{ tabBarLabel: 'Cá nhân', tabBarIcon: ({color, size}) => <Icon source="account" color={color} size={size} /> }} />
  </Tab.Navigator>
);

// ==========================================
// 2. CẤU HÌNH ROOT STACK TỔNG
// ==========================================

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          
          {/* --- AUTHENTICATION --- */}
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />

          {/* --- MAIN TABS CỦA 3 ROLE (Không có header, dùng tab) --- */}
          <Stack.Screen name="Home" component={CustomerTabs} options={{headerShown: false}} />
          <Stack.Screen name="ProviderHome" component={ProviderTabs} options={{headerShown: false}} />
          <Stack.Screen name="AdminHome" component={AdminTabs} options={{headerShown: false}} />

          {/* --- CHAT CHUNG --- */}
          <Stack.Screen name="ChatProvider" component={ChatProvider} options={{headerShown: false}} />

          {/* --- CUSTOMER SUB-SCREENS --- */}
          <Stack.Screen name="TourDetail" component={TourDetail} options={{title: 'Chi tiết Tour'}} />
          <Stack.Screen name="HotelDetail" component={HotelDetail} options={{title: 'Chi tiết Phòng'}} />
          <Stack.Screen name="TransportDetail" component={TransportDetail} options={{title: 'Chi tiết Phương Tiện'}} />
          <Stack.Screen name="ComboDetail" component={ComboDetail} options={{title: 'Chi tiết Combo'}} />
          <Stack.Screen name="Booking" component={Booking} options={{title: 'Thông tin đặt chỗ'}} />

          {/* --- PROVIDER SUB-SCREENS --- */}
          <Stack.Screen name="ServiceForm" component={ServiceForm} options={{headerShown: false}} />
          <Stack.Screen name="EditService" component={EditService} options={{headerShown: false}} />
          <Stack.Screen name="ReviewManager" component={ReviewManager} options={{title: 'Đánh giá về dịch vụ'}} />
          <Stack.Screen name="Statistics" component={Statistics} options={{title: 'Hiệu quả kinh doanh'}} />
          <Stack.Screen name="ProviderReportList" component={ProviderReportList} options={{title: 'Báo cáo dịch vụ'}} />

          {/* --- ADMIN SUB-SCREENS --- */}
          {/* ĐÂY LÀ ROUTE DÀNH CHO NÚT BẤM TỪ HOME (Có Header & nút Back) */}
          <Stack.Screen 
            name="ReportListFromHome" 
            component={ReportList} 
            options={{ title: 'Quản Lý Báo Cáo', headerBackTitleVisible: false }} 
          />

          <Stack.Screen 
            name="AdminUserFromHome" 
            component={AdminUserList} 
            options={{ title: 'Quản Lý Người Dùng', headerBackTitleVisible: false }} 
          />
          
          <Stack.Screen name="ApproveProvider" component={ApproveProvider} options={{title: 'Xác thực nhà cung cấp'}} />
          <Stack.Screen name="AdminServiceList" component={AdminServiceList} options={{title: 'Danh sách dịch vụ'}} />
          <Stack.Screen name="AdminStatistics" component={AdminStatistics} options={{title: 'Báo cáo thống kê'}} />
          
          {/* Admin Services Details */}
          <Stack.Screen name='AdminTourDetail' component={AdminTourDetail} options={{title: 'Chi tiết Tour Admin'}} />
          <Stack.Screen name='AdminHotelDetail' component={AdminHotelDetail} options={{title: 'Chi tiết Hotel Admin'}} />
          <Stack.Screen name='AdminTransportDetail' component={AdminTransportDetail} options={{title: 'Chi tiết Phương Tiện Admin'}} />
          <Stack.Screen name='AdminComboDetail' component={AdminComboDetail} options={{title: 'Chi tiết Combo Admin'}} />

          {/* Admin Report Details */}
          <Stack.Screen name='AdminTourDetailReport' component={AdminTourDetailReport} options={{title: 'Báo cáo Tour'}} />
          <Stack.Screen name='AdminHotelDetailReport' component={AdminHotelDetailReport} options={{title: 'Báo cáo Hotel'}} />
          <Stack.Screen name='AdminTransportDetailReport' component={AdminTransportDetailReport} options={{title: 'Báo cáo Phương Tiện'}} />
          <Stack.Screen name='AdminComboDetailReport' component={AdminComboDetailReport} options={{title: 'Báo cáo Combo'}} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;