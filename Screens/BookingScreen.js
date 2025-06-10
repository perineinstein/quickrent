import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { auth, db } from '../firebase'; // ✅ use Web SDK
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = ({ route, navigation }) => {
  const { apartment } = route.params;
  const [loading, setLoading] = useState(false);

  const handleBookApartment = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to book.');
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        apartmentId: apartment.id,
        apartmentTitle: apartment.title,
        timestamp: serverTimestamp(),
        status: 'pending',
      });

      Alert.alert('Success', 'Your booking has been confirmed!');
      navigation.navigate('Payment', { apartment });

    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Book Apartment</Text>
      </View>

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
        style={styles.bookButton}
        labelStyle={styles.buttonText}
      >
        Confirm Booking
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
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  bookButton: {
    marginTop: 20,
    backgroundColor: '#00C9A7',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
