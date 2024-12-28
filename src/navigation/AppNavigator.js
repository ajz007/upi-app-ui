import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TestScreen from '../features/test/pages/TestScreen';
import Dashboard from '../features/dashboard/pages/Dashboard';
import QRCodeScanner from '../features/qrCodeScanner/pages/QRCodeScanner';
import TransactionHistory from '../features/transactionHistory/pages/TransactionHistory';
import BalanceInquiry from '../features/balanceInquiry/pages/BalanceInquiry';
import Payment from '../features/payment/pages/Payment';
import TransactionStatus from '../features/transactionHistory/pages/TransactionStatus';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        <Stack.Screen name="BalanceInquiry" component={BalanceInquiry} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="TransactionStatus" component={TransactionStatus} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
