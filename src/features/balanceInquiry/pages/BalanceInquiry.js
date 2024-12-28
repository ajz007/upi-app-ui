import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';

const BalanceInquiry = () => {
  const [vpa, setVpa] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    if (!vpa.trim()) {
      Alert.alert('Error', 'Please enter a valid VPA.');
      return;
    }

    setLoading(true);
    setBalance(null); // Clear previous balance

    try {
      const response = await axios.post('http://192.168.29.120:3000/api/balance', { vpa });

      if (response.data.success) {
        setBalance(response.data.balance);
      } else {
        Alert.alert('Error', 'Failed to fetch balance.');
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      Alert.alert('Error', 'Failed to check balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Balance</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter VPA"
        value={vpa}
        onChangeText={setVpa}
      />

      <Button title={loading ? 'Checking...' : 'Check Balance'} onPress={checkBalance} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {balance && (
        <View style={styles.balanceContainer}>
          <Text style={styles.label}>Account:</Text>
          <Text style={styles.value}>{balance.account}</Text>

          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>
            ₹{balance.amount.toFixed(2)} {balance.currency}
          </Text>

          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>
            {dayjs(balance.lastUpdated).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  loader: {
    marginVertical: 20,
  },
  balanceContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default BalanceInquiry;
