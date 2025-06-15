import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, updateDoc } from 'firebase/firestore';
import { Paystack } from 'react-native-paystack-webview';

const PaymentScreen = ({ route, navigation }) => {
  const { apartmentId } = route.params;
  const user = auth.currentUser;
  const [apartment, setApartment] = useState(null);
  const [showPaystack, setShowPaystack] = useState(false);

  // 🔄 Fetch apartment from Firestore
  const fetchApartment = async () => {
    try {
      const docRef = doc(db, 'apartments', apartmentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setApartment({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Apartment not found.');
      }
    } catch (err) {
      console.error('Error loading apartment:', err);
      Alert.alert('Error', 'Failed to load apartment data.');
    }
  };

  useEffect(() => {
    fetchApartment();
  }, []);

  // ✅ Handle Paystack payment success
  const onPaymentSuccess = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('userId', '==', user.uid),
        where('apartmentId', '==', apartmentId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, { status: 'paid' });
        Alert.alert('Success', 'Payment completed!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Warning', 'Booking not found.');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      Alert.alert('Error', 'Payment succeeded but booking not updated.');
    }
  };

  const onPaymentCancel = () => {
    Alert.alert('Cancelled', 'Payment was cancelled.');
  };

  if (!apartment) {
    return <Text style={{ color: 'white', padding: 20 }}>Loading apartment info...</Text>;
  }

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

      <Text
        onPress={() => setShowPaystack(true)}
        style={styles.payButton}
      >
        Pay Now
      </Text>

      {showPaystack && (
        <Paystack
          paystackKey="pk_test_xxxxxxxxxxxxx" // 🔁 Replace with your real test/public key
          amount={Number(apartment.price)}
          billingEmail={user.email}
          currency="GHS"
          subaccount={apartment.subaccount_code} // ✅ 95% goes here, 5% to QuickRent
          onSuccess={onPaymentSuccess}
          onCancel={onPaymentCancel}
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
