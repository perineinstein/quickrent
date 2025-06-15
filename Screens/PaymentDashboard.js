import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { API, graphqlOperation } from 'aws-amplify';
import { getPaymentSummary } from '../graphql/queries'; // Replace with your GraphQL query
import Icon from 'react-native-vector-icons/MaterialIcons';

const PaymentDashboard = ({ navigation }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch payment summary from the backend
  const fetchPaymentSummary = async () => {
    try {
      const response = await API.graphql(graphqlOperation(getPaymentSummary));
      setSummary(response.data.getPaymentSummary);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      Alert.alert('Error', 'Failed to fetch payment summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentSummary();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Payment Dashboard</Text>
      </View>

      {/* Payment Summary */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C9A7" />
        </View>
      ) : summary ? (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Total Earnings</Title>
            <Paragraph style={styles.summaryAmount}>GHS {summary.totalEarnings}</Paragraph>
            <Title style={styles.summaryTitle}>Pending Payments</Title>
            <Paragraph style={styles.summaryAmount}>GHS {summary.pendingPayments}</Paragraph>
            <Title style={styles.summaryTitle}>Successful Payments</Title>
            <Paragraph style={styles.summaryAmount}>GHS {summary.successfulPayments}</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="payment" size={60} color="#A0A0A0" />
          <Text style={styles.emptyText}>No payment data found.</Text>
        </View>
      )}

      {/* View Payments Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Payments')}
        style={styles.viewPaymentsButton}
        labelStyle={styles.buttonText}
      >
        View Payments
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryCard: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryAmount: {
    color: '#00C9A7',
    fontWeight: 'bold',
  },
  viewPaymentsButton: {
    marginTop: 20,
    backgroundColor: '#00C9A7',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default PaymentDashboard;