import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the UPI App</Text>
      <Button title="Make a Payment" onPress={() => navigation.navigate('Payment')}/>
      <Button title="Check Balance" onPress={() => navigation.navigate('BalanceInquiry')} />
      <Button
  title="Check Transaction Status"
  onPress={() => navigation.navigate('TransactionStatus')}
/>

      <Button title="Transaction History" onPress={() => navigation.navigate('TransactionHistory')} />
      <Button title="Scan QR" onPress={() => navigation.navigate('QRCodeScanner')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Dashboard;
