// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import Homepage from './screens/Homepage';
import AdminHomepage from './screens/AdminHomepage';
import DashboardScreen from './screens/DashboardScreen';
import ActivateScreen from './screens/ActivateScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import RewardsScreen from './screens/RewardsScreen';
import MapScreen from './screens/MapScreen';
import NearestCenterScreen from './screens/NearestCenterScreen';
import ProfileScreen from './screens/ProfileScreen';
import TypesOfWasteScreen from './screens/TypesOfWasteScreen';
import DirectionsScreen from './screens/DirectionsScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import ViewHistoryScreen from './screens/ViewHistoryScreen';
import GenerateReportsScreen from './screens/GenerateReportsScreen';
import ManageUsersScreen from './screens/ManageUsersScreen';
import ManageRecyclingCentersScreen from './screens/ManageRecyclingCentersScreen';
import RewardPointsScreen from './screens/RewardPointsScreen';
import AnalyticsDashboardScreen from './screens/AnalyticsDashboardScreen';
import VerificationScreen from './screens/VerificationScreen';
import RewardScreen from './screens/RewardScreen';
import RedeemPointsScreen from './screens/RedeemPointsScreen';
import ShopRedemptionsScreen from './screens/ShopRedemptionsScreen';

const Stack = createStackNavigator();

const linking = {
  prefixes: [process.env.EXPO_PUBLIC_IP_EXPO, 'myapp://'],
  config: {
    screens: {
      Welcome: 'welcome',
      Register: 'register',
      Login: 'login',
      Homepage: 'home',
      AdminHomepage: 'adminhome',
      DashboardScreen: 'officerdashboard',
      Activate: 'activate',
      ResetPassword: 'resetpassword',
      MapScreen: 'map',
      NearestCenterScreen: 'nearestcenter',
      RewardsScreen: 'rewards',
      TypesOfWasteScreen: 'typesofwaste',
      ProfileScreen: 'profile',
      AddEntryScreen: 'addentry',
      ViewHistoryScreen: 'history',
      GenerateReportsScreen: 'reports',
      DirectionsScreen: 'directions',
      ManageUsersScreen: 'manageusers',
      ManageRecyclingCentersScreen: 'managerecyclingcenters',
      RewardPointsScreen: 'rewardpoints',
      AnalyticsDashboardScreen: 'analytics',
      RewardScreen: 'reward',
      VerificationScreen: 'verification',
      RedeemPointsScreen: 'redeempoints',
      ShopRedemptionsScreen: 'shopredemptions',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="AdminHomepage" component={AdminHomepage} initialParams={{ firstName: 'John', lastName: 'Doe' }} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="Activate" component={ActivateScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="NearestCenterScreen" component={NearestCenterScreen} />
        <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
        <Stack.Screen name="TypesOfWasteScreen" component={TypesOfWasteScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AddEntryScreen" component={AddEntryScreen} />
        <Stack.Screen name="ViewHistoryScreen" component={ViewHistoryScreen} />
        <Stack.Screen name="GenerateReportsScreen" component={GenerateReportsScreen} />
        <Stack.Screen name="DirectionsScreen" component={DirectionsScreen} />
        <Stack.Screen name="ManageUsersScreen" component={ManageUsersScreen} initialParams={{ firstName: 'John', lastName: 'Doe' }} />
        <Stack.Screen name="ManageRecyclingCentersScreen" component={ManageRecyclingCentersScreen} initialParams={{ firstName: 'John', lastName: 'Doe' }} />
        <Stack.Screen name="RewardPointsScreen" component={RewardPointsScreen} />
        <Stack.Screen name="AnalyticsDashboardScreen" component={AnalyticsDashboardScreen} initialParams={{ firstName: 'John', lastName: 'Doe' }} />
        <Stack.Screen name="RewardScreen" component={RewardScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="RedeemPointsScreen" component={RedeemPointsScreen} />
        <Stack.Screen name="ShopRedemptionsScreen" component={ShopRedemptionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
