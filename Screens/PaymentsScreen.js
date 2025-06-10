import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../firebase'; // ✅ Web SDK
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { Paystack } from 'react-native-paystack-webview';

const PaymentScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const user = auth.currentUser;
  const [showPaystack, setShowPaystack] = useState(false);

  const onPaymentSuccess = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid),
        where('apartmentId', '==', apartment.id),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const bookingRef = snapshot.docs[0].ref;
        await updateDoc(bookingRef, { status: 'paid' });

        Alert.alert('Success', 'Payment confirmed!');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Payment succeeded but booking failed to update.');
    }
  };

  const onPaymentCancel = () => {
    Alert.alert('Cancelled', 'Payment was cancelled.');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Payment</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{apartment.title}</Title>
          <Paragraph style={styles.location}>{apartment.location}</Paragraph>
          <Paragraph style={styles.price}>GHS {apartment.price}/month</Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.note}>Pay securely using Paystack.</Text>

      <Text onPress={() => setShowPaystack(true)} style={styles.payButton}>
        Pay Now
      </Text>

      {showPaystack && (
        <Paystack
          paystackKey="pk_test_xxxxxxxxxxxxxxxxxxxxx" // Replace with your real key
          amount={Number(apartment.price)}
          billingEmail={user.email}
          activityIndicatorColor="#00C9A7"
          onCancel={onPaymentCancel}
          onSuccess={onPaymentSuccess}
          autoStart={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
  card: { marginBottom: 20, backgroundColor: '#2A2A2A' },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  location: { color: '#A0A0A0', fontSize: 16 },
  price: { color: '#00C9A7', fontWeight: 'bold', fontSize: 18 },
  note: { color: '#A0A0A0', textAlign: 'center', marginVertical: 20 },
  payButton: {
    textAlign: 'center',
    backgroundColor: '#00C9A7',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    borderRadius: 8,
  },
});

export default PaymentScreen;
