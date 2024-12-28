import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TestScreen from '../features/test/pages/TestScreen';
import Dashboard from '../features/dashboard/pages/Dashboard';
import QRCodeScanner from '../features/qrCodeScanner/pages/QRCodeScanner';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
