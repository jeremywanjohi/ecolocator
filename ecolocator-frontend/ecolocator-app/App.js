import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import Homepage from './screens/Homepage';
import ActivateScreen from './screens/ActivateScreen';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://192.168.100.74:8081', 'myapp://'],
  config: {
    screens: {
      Welcome: 'welcome',
      Register: 'register',
      Login: 'login',
      Homepage: 'home',
      Activate: 'activate',
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
        <Stack.Screen name="Activate" component={ActivateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
