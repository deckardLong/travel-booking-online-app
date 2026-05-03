import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./features/user/screens/Profile/Profile.js";
import Login from "./features/auth/screens/Login.js";
import ChatList from "./features/user/screens/ChatList/ChatList.js";
import Dashboard from "./features/provider/screens/Dashboard.js";
import Register from "./features/auth/screens/Register.js";
import Home from "./features/user/screens/Home/Home.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, PaperProvider } from "react-native-paper";
import TourDetail from "./features/service/details/TourDetail.js";
import HotelDetail from "./features/service/details/HotelDetail.js";
import TransportDetail from "./features/service/details/TransportDetail.js";
import ComboDetail from "./features/service/details/ComboDetail.js";
import Booking from "./features/booking/UserBooking/Booking.js";
import MyBookings from "./features/booking/BookingList/MyBookings.js";
import ServiceForm from "./features/provider/screens/ServiceForm.js";
import ServiceList from "./features/provider/screens/ServiceList.js";
import EditService from "./features/provider/screens/EditService.js";
import ReviewManager from "./features/provider/screens/ReviewManager.js";
import Statistics from "./features/provider/screens/Statistics.js";
import ChatProvider from "./features/provider/screens/ChatProvider.js";
import ApproveProvider from "./features/admin/ApproveProvider/ApproveProvider.js";
import ReportList from "./features/admin/ReportList/ReportList.js";
import AdminServiceList from "./features/admin/AdminServiceList/AdminServiceList.js";
import AdminUserList from "./features/admin/AdminUserList/AdminUserList.js";
import ProviderReportList from "./features/provider/screens/ProviderReportList.js";
import AdminHome from "./features/admin/AdminHome/AdminHome.js";
import AdminStatistics from "./features/admin/AdminStatistics/AdminStatistics.js";
// import Booking from "./features/booking/Booking.js";
// import MyBookings from "./features/booking/MyBookings.js";
// import ServiceForm from "./features/provider/screens/ServiceForm.js";
// import ServiceList from "./features/provider/screens/ServiceList.js";
// import EditService from "./features/provider/screens/EditService.js";

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

// TABS FOR CUSTOMER
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b5998',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color, size}) => (
            <Icon source="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={MyBookings} 
        options={{
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({color, size}) => (
            <Icon source="clipboard-text-clock" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatList} 
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color, size}) => (
            <Icon source="chat-processing" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({color, size}) => (
            <Icon source="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// TABS FOR PROVIDER
const ProviderTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0F766E', 
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={Dashboard}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({color, size}) => <Icon source="view-dashboard" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ServiceListTab"
        component={ServiceList} 
        options={{
          tabBarLabel: 'Dịch vụ',
          tabBarIcon: ({color, size}) => <Icon source="format-list-bulleted" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatList}
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({color, size}) => <Icon source="chat" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({color, size}) => <Icon source="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// TABS FOR ADMIN
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1E293B', 
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AdminHomeTab"
        component={AdminHome}
        options={{
          tabBarLabel: 'Quản trị',
          tabBarIcon: ({color, size}) => <Icon source="shield-account" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminUserListTab"
        component={AdminUserList}
        options={{
          tabBarLabel: 'Người dùng',
          tabBarIcon: ({color, size}) => <Icon source="account-group" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ReportListTab"
        component={ReportList} 
        options={{
          tabBarLabel: 'Báo cáo',
          tabBarIcon: ({color, size}) => <Icon source="alert-decagram" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({color, size}) => <Icon source="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* AUTH */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Đăng nhập'}}
          />

          <Stack.Screen
            name="Register"
            component={Register}
            options={{title: 'Đăng ký'}}
          />

           {/* HOME */}
          <Stack.Screen 
            name="Home"
            component={MainTabs}
            options={{title: 'Trang chủ du lịch'}}
          />

          <Stack.Screen 
            name="ProviderHome" 
            component={ProviderTabs} 
            options={{headerShown: false}} 
          />

          <Stack.Screen 
            name="AdminHome" 
            component={AdminTabs} 
            options={{headerShown: false}} 
          />

          {/* DETAILS */}
          <Stack.Screen name='TourDetail' component={TourDetail} />
          <Stack.Screen name='HotelDetail' component={HotelDetail} />
          <Stack.Screen name='TransportDetail' component={TransportDetail} />
          <Stack.Screen name='ComboDetail' component={ComboDetail} />

          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Booking"
            component={Booking}
            options={{title: 'Thông tin đặt chỗ'}}
          />

          <Stack.Screen
            name="MyBookings"
            component={MyBookings}
            options={{title: 'Lịch sử đặt chỗ'}}
          />

          <Stack.Screen
            name="ChatProvider"
            component={ChatProvider}
            options={{title: 'Trao đổi trực tiếp'}}
          />

          {/* PROVIDER */}
          <Stack.Screen
            name="ServiceForm"
            component={ServiceForm}
            options={{title: 'Đăng dịch vụ mới'}}
          />

          <Stack.Screen
            name="ServiceList"
            component={ServiceList}
            options={{title: 'Danh sách các dịch vụ'}}
          />

          <Stack.Screen
            name="EditService"
            component={EditService}
            options={{title: 'Chỉnh sửa dịch vụ'}}
          />

          <Stack.Screen
            name="ReviewManager"
            component={ReviewManager}
            options={{title: 'Đánh giá về dịch vụ'}}
          />

           <Stack.Screen
            name="Statistics"
            component={Statistics}
            options={{title: 'Hiệu quả kinh doanh'}}
          />

          <Stack.Screen
            name="ProviderReportList"
            component={ProviderReportList}
          />

          {/* ADMIN */}
          <Stack.Screen
            name="AdminHomeMain"
            component={AdminHome}
            options={{title: 'Trang chủ Admin'}}
          />

          <Stack.Screen
            name="ApproveProvider"
            component={ApproveProvider}
            options={{title: 'Xác thực nhà cung cấp'}}
          />

          <Stack.Screen
            name="ReportList"
            component={ReportList}
            options={{title: 'Báo cáo thống kê'}}
          />

          <Stack.Screen
            name="AdminServiceList"
            component={AdminServiceList}
            options={{title: 'Danh sách dịch vụ Admin'}}
          />

          <Stack.Screen
            name="AdminStatistics"
            component={AdminStatistics}
            options={{title: 'Báo cáo thống kê Admin'}}
          />

          <Stack.Screen
            name="AdminUserList"
            component={AdminUserList}
            options={{title: 'Danh sách người dùng'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;