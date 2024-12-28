import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const Payment = ({ navigation }) => {
  const [fromVPA, setFromVPA] = useState('sender@upi'); // Default sender VPA
  const [toVPA, setToVPA] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!fromVPA || !toVPA || !amount) {
      Alert.alert('Error', 'Sender VPA, recipient VPA, and amount are required.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.29.120:3000/api/payments/initiate', {
        fromVPA,
        toVPA,
        amount: parseFloat(amount),
        remarks,
      });

      const { success, message } = response.data;

      if (success) {
        Alert.alert('Payment Successful', `Payment of ₹${amount} to ${toVPA} completed.`);
        navigation.navigate('TransactionHistory'); // Navigate to history
      } else {
        Alert.alert('Payment Failed', message || 'Unknown error occurred.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      console.error('Payment Error Details:', error.toJSON());
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Your UPI ID (sender@upi)"
        value={fromVPA}
        onChangeText={setFromVPA}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient's UPI ID (receiver@upi)"
        value={toVPA}
        onChangeText={setToVPA}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (₹)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Remarks (optional)"
        value={remarks}
        onChangeText={setRemarks}
      />

      <Button title={loading ? 'Processing...' : 'Pay Now'} onPress={handlePayment} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default Payment;
