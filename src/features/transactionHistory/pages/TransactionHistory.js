import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';


const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noTransactions, setNoTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const toDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const fromDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
  const limit = 10;

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    if (page > totalPages || loading) return;

    setLoading(true);

    try {
      const response = await axios.get('http://192.168.29.120:3000/api/history/transactions', {
        params: {
          fromDate,
          toDate,
          page,
          limit,
        },
      });

      if (response.data.success) {
        const newTransactions = response.data.transactions || [];
        const metadata = response.data.metadata || {};

        if (page === 1 && newTransactions.length === 0) {
          setNoTransactions(true);
        } else {
          setNoTransactions(false);
        }

        setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
        setTotalPages(metadata.totalPages || 1);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch transactions.');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStatus = async (transactionId) => {
    try {
      const response = await axios.get(`http://192.168.29.120:3000/api/history/status/${transactionId}`);
      if (response.data.success) {
        setSelectedTransaction(response.data.transaction);
      } else {
        Alert.alert('Error', 'Transaction status not found.');
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      Alert.alert('Error', 'Failed to fetch transaction status. Please try again.');
    }
  };

  const renderTransactionDetails = () => {
    if (!selectedTransaction) return null;

    return (
      <View style={styles.transactionDetails}>
        <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setSelectedTransaction(null)}
      >
        <Text style={styles.closeButtonText}>✖ Close</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Transaction ID:</Text>
      <Text
        style={styles.copyable}
        onPress={() => {
            Clipboard.setStringAsync(selectedTransaction.transactionId);
            Alert.alert('Copied!', 'Transaction ID copied to clipboard.');
        }}
        >
        {selectedTransaction.transactionId} (Tap to Copy)
        </Text>

        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{selectedTransaction.fromVPA}</Text>

        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{selectedTransaction.toVPA}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>
          ₹{selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}
        </Text>

        <Text style={styles.label}>Remarks:</Text>
        <Text style={styles.value}>{selectedTransaction.remarks}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>
          {selectedTransaction.status === 'Success' ? '✅ Success' : '❌ Failed'}
        </Text>

        <Text style={styles.label}>Timestamp:</Text>
        <Text style={styles.value}>{dayjs(selectedTransaction.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => fetchTransactionStatus(item.transactionId)}
    >
      <Text style={styles.date}>{dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
      <Text style={styles.description}>
        {item.fromVPA} → {item.toVPA}
      </Text>
      <Text style={styles.amount}>
        {item.amount > 0 ? `+₹${item.amount.toFixed(2)}` : `-₹${Math.abs(item.amount).toFixed(2)}`}
      </Text>
      <Text style={styles.status}>
        {item.status === 'Success' ? '✅ Success' : '❌ Failed'}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {noTransactions ? (
        <Text style={styles.noTransactions}>
          No transactions found for the selected date range.
        </Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReached={() => {
            if (page < totalPages) setPage((prevPage) => prevPage + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      {renderTransactionDetails()}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noTransactions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50', // Green for credit
  },
  status: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  transactionDetails: {
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  copyable: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },  
});

export default TransactionHistory;
