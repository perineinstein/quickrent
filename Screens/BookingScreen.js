import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BookingScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  const handleBookApartment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to book an apartment.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        apartmentId: apartment.id,
        apartmentTitle: apartment.title,
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      Alert.alert('Booking Created', 'Proceed to payment');
      navigation.navigate('Payment', { apartment });

    } catch (err) {
      console.error('Booking error:', err);
      Alert.alert('Error', 'Failed to confirm booking. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Confirm Booking</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{apartment.title}</Title>
          <Paragraph style={styles.location}>{apartment.location}</Paragraph>
          <Paragraph style={styles.price}>GHS {apartment.price} / month</Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.confirmation}>Do you want to book this apartment?</Text>

      <Button
        mode="contained"
        loading={loading}
        onPress={handleBookApartment}
        style={styles.bookButton}
        labelStyle={styles.buttonText}
      >
        Confirm & Proceed to Payment
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { backgroundColor: '#2A2A2A', marginBottom: 20 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  location: { color: '#A0A0A0' },
  price: { color: '#00C9A7', fontWeight: 'bold', fontSize: 16 },
  confirmation: { color: 'white', textAlign: 'center', marginVertical: 20, fontSize: 16 },
  bookButton: { backgroundColor: '#00C9A7', paddingVertical: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default BookingScreen;
