import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Paystack } from 'react-native-paystack-webview';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

const PaymentScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const user = auth.currentUser;

  const [commissionRate, setCommissionRate] = useState(5); // Default fallback
  const [subAccount, setSubAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaystack, setShowPaystack] = useState(false);

  const apartmentPrice = Number(apartment.price);
  const commission = (apartmentPrice * commissionRate) / 100;
  const totalAmount = apartmentPrice + commission;

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        // Get commission rate from admin config
        const configSnap = await getDoc(doc(db, 'admin', 'config'));
        if (configSnap.exists()) {
          setCommissionRate(configSnap.data()?.commissionRate || 5);
        }

        // Get landlord subaccount
        const aptSnap = await getDoc(doc(db, 'apartments', apartment.id));
        const landlordId = aptSnap.data()?.landlordId;

        const landlordSnap = await getDoc(doc(db, 'users', landlordId));
        const sub = landlordSnap.data()?.subaccount_code;

        if (!sub) throw new Error('Landlord payout account not set.');
        setSubAccount(sub);

        setLoading(false);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', err.message);
        navigation.goBack();
      }
    };

    fetchSetupData();
  }, []);

  const onPaymentSuccess = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid),
        where('apartmentId', '==', apartment.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const bookingRef = snapshot.docs[0].ref;

        await updateDoc(bookingRef, {
          status: 'paid',
          paidAmount: totalAmount,
          apartmentPrice,
          commission,
          commissionRate,
          subaccount_code: subAccount,
          paidAt: new Date()
        });

        Alert.alert('Success', 'Payment confirmed!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Booking not found.');
      }
    } catch (err) {
      console.error('Booking update failed:', err);
      Alert.alert('Error', 'Payment went through, but update failed.');
    }
  };

  const onPaymentCancel = () => {
    Alert.alert('Cancelled', 'Payment was cancelled.');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading payment setup...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Confirm Payment</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{apartment.title}</Title>
          <Paragraph style={styles.text}>{apartment.location}</Paragraph>
          <Paragraph style={styles.text}>Rent: GHS {apartmentPrice.toFixed(2)}</Paragraph>
          <Paragraph style={styles.text}>
            Service Fee ({commissionRate}%): GHS {commission.toFixed(2)}
          </Paragraph>
          <Paragraph style={styles.total}>
            Total: GHS {totalAmount.toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>

      <Text onPress={() => setShowPaystack(true)} style={styles.payButton}>
        Pay with Paystack
      </Text>

      {showPaystack && (
        <Paystack
          paystackKey="pk_live_xxxxxxxxxxxxx" // Replace with your Paystack public key
          amount={totalAmount}
          billingEmail={user.email}
          subAccount={subAccount}
          bearer="account"
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
  header: { fontSize: 24, color: 'white', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#2A2A2A', marginBottom: 20 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  text: { color: '#A0A0A0', fontSize: 16 },
  total: { color: '#00C9A7', fontWeight: 'bold', fontSize: 18 },
  payButton: {
    backgroundColor: '#00C9A7',
    color: 'white',
    padding: 12,
    textAlign: 'center',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16
  },
  loadingText: { color: '#999', textAlign: 'center', fontSize: 16 }
});

export default PaymentScreen;
