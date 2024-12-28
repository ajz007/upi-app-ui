import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import dayjs from 'dayjs';

const TransactionStatus = () => {
  const [filters, setFilters] = useState({
    transactionId: '',
    fromVPA: '',
    toVPA: '',
    fromDate: '',
    toDate: '',
    status: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchFilteredTransactions = async (filters) => {
    try {
      setLoading(true);
      const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      const response = await axios.get('http://192.168.29.120:3000/api/history/status', {
        params,
      });

      if (response.data.success) {
        setTransactions(response.data.transactions || []);
        setShowFilters(false);
      } else {
        Alert.alert('Error', response.data.message || 'No transactions found.');
      }
    } catch (error) {
      console.error('Error fetching transactions with filters:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionId}>Transaction ID: {item.transactionId}</Text>
      <Text>From: {item.fromVPA}</Text>
      <Text>To: {item.toVPA}</Text>
      <View style={styles.statusRow}>
        <Text>Status: </Text>
        {item.status === 'Success' ? (
          <FontAwesome name="check-circle" size={16} color="green" />
        ) : (
          <FontAwesome name="times-circle" size={16} color="red" />
        )}
      </View>
      <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
      <Text>Timestamp: {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Transactions</Text>
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Transaction ID"
          value={filters.transactionId}
          onChangeText={(text) => setFilters({ ...filters, transactionId: text })}
        />
        <Button
          onPress={() => setShowFilters(!showFilters)}
          title=""
          style={styles.filterToggle}
        >
          {showFilters ? (
            <MaterialIcons name="filter-list-off" size={24} color="gray" />
          ) : (
            <MaterialIcons name="filter-list" size={24} color="blue" />
          )}
        </Button>
        {showFilters && (
          <>
            <TextInput
              style={styles.input}
              placeholder="From VPA"
              value={filters.fromVPA}
              onChangeText={(text) => setFilters({ ...filters, fromVPA: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="To VPA"
              value={filters.toVPA}
              onChangeText={(text) => setFilters({ ...filters, toVPA: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="From Date (YYYY-MM-DD)"
              value={filters.fromDate}
              onChangeText={(text) => setFilters({ ...filters, fromDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="To Date (YYYY-MM-DD)"
              value={filters.toDate}
              onChangeText={(text) => setFilters({ ...filters, toDate: text })}
            />
            <Picker
              selectedValue={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
              style={styles.picker}
            >
              <Picker.Item label="All Statuses" value="" />
              <Picker.Item label="Success" value="Success" />
              <Picker.Item label="Failed" value="Failed" />
            </Picker>
          </>
        )}
        <Button
          title={loading ? 'Fetching...' : 'Apply Filters'}
          onPress={() => {
            setShowFilters(false);
            fetchFilteredTransactions(filters);
          }}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransactionItem}
        ListEmptyComponent={
          !loading && <Text style={styles.noTransactions}>No transactions found</Text>
        }
      />
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
  filters: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loader: {
    marginVertical: 20,
  },
  noTransactions: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  filterToggle: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});

export default TransactionStatus;
