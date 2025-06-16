import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView
} from 'react-native';
import { Card, Title, Paragraph, Button, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BookingScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  const handleBookApartment = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        showSnackbar('You must be logged in to book.');
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        apartmentId: apartment.id,
        apartmentTitle: apartment.title,
        timestamp: serverTimestamp(),
        status: 'pending',
      });

      showSnackbar('Booking confirmed! Proceeding to payment...');
      setTimeout(() => navigation.navigate('Payment', { apartment }), 1500);

    } catch (error) {
      console.error('Booking error:', error);
      showSnackbar('Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Book Apartment</Text>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.title}>{apartment.title}</Title>
          <Paragraph style={styles.location}>{apartment.location}</Paragraph>
          <Paragraph style={styles.price}>GHS {apartment.price}/month</Paragraph>
        </Card.Content>
      </Card>

      <Text style={styles.confirmationText}>
        Are you sure you want to book this apartment?
      </Text>

      <Button
        mode="contained"
        onPress={handleBookApartment}
        loading={loading}
        disabled={loading}
        style={styles.bookButton}
        labelStyle={styles.buttonText}
      >
        Confirm Booking
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        style={{ backgroundColor: '#2A2A2A' }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center'
  },
  detailsCard: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  price: {
    color: '#00C9A7',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  bookButton: {
    backgroundColor: '#00C9A7',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BookingScreen;
