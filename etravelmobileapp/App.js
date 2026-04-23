import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from './screens/home/Home.js';
import Login from './screens/user/Login.js';
import Register from './screens/user/Register.js';
import TourDetail from "./screens/details/TourDetail.js";
import TransportDetail from "./screens/details/TransportDetail.js";
import HotelDetail from "./screens/details/HotelDetail.js";
import ComboDetail from "./screens/details/ComboDetail.js";
import Booking from "./booking/Booking.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Profile from "./screens/user/Profile.js";
import MyBookings from "./booking/MyBookings.js";


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

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

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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

         <Stack.Screen 
          name="Home"
          component={MainTabs}
          options={{title: 'Trang chủ du lịch'}}
        />
        
        <Stack.Screen name='TourDetail' component={TourDetail} />
        <Stack.Screen name='HotelDetail' component={HotelDetail} />
        <Stack.Screen name='TransportDetail' component={TransportDetail} />
        <Stack.Screen name='ComboDetail' component={ComboDetail} />

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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;