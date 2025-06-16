import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit, updateDoc } from 'firebase/firestore';
import { Paystack } from 'react-native-paystack-webview';

const PaymentScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const user = auth.currentUser;
  const [showPaystack, setShowPaystack] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showMessage = (msg) => setSnackbar({ visible: true, message: msg });

  const onPaymentSuccess = async (response) => {
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
        await updateDoc(snapshot.docs[0].ref, { status: 'paid' });
        showMessage('Payment successful!');
        setTimeout(() => navigation.navigate('Home'), 1500);
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      showMessage('Payment succeeded, but booking update failed.');
    }
  };

  const onPaymentCancel = () => {
    showMessage('Payment cancelled.');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Payment</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{apartment.title}</Title>
          <Paragraph style={styles.location}>{apartment.location}</Paragraph>
          <Paragraph style={styles.price}>GHS {apartment.price} / month</Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.note}>Secure payments powered by Paystack.</Text>

      <Text onPress={() => setShowPaystack(true)} style={styles.payButton}>
        Pay Now
      </Text>

      {showPaystack && (
        <Paystack
          paystackKey="pk_test_35faf0ddf4469b1faf4fde5863936acddeabbec6"
          billingEmail={user.email}
          amount={Number(apartment.price)}
          onSuccess={onPaymentSuccess}
          onCancel={onPaymentCancel}
          autoStart={true}
        />
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        style={{ backgroundColor: '#2A2A2A' }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#1A1A1A', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#2A2A2A', marginBottom: 20 },
  title: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  location: { fontSize: 14, color: '#A0A0A0' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#00C9A7', marginTop: 8 },
  note: { textAlign: 'center', color: '#A0A0A0', marginBottom: 20 },
  payButton: {
    textAlign: 'center',
    backgroundColor: '#00C9A7',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default PaymentScreen;
