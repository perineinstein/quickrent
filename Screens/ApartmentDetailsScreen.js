// ✅ Firebase Web SDK–compatible ApartmentDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ApartmentDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { apartmentId } = route.params;
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const docRef = doc(db, 'apartments', apartmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApartment(docSnap.data());
        } else {
          Alert.alert('Error', 'Apartment not found.');
        }
      } catch (error) {
        console.error('Error fetching apartment:', error);
        Alert.alert('Error', 'Could not load apartment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [apartmentId]);

  if (loading) {
    return (
      <View style={styles.center}><Text style={{ color: 'white' }}>Loading...</Text></View>
    );
  }

  if (!apartment) {
    return (
      <View style={styles.center}><Text style={{ color: 'white' }}>No apartment data found.</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: apartment.images?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image' }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Title style={styles.title}>{apartment.title}</Title>
        <Paragraph style={styles.location}>{apartment.location}</Paragraph>
        <Paragraph style={styles.price}>GHS {apartment.price}/month</Paragraph>
        <Paragraph style={styles.description}>{apartment.description || 'No description provided.'}</Paragraph>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Booking', { apartment })}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Book Now
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' },
  image: { width: '100%', height: 250 },
  details: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  location: { fontSize: 16, color: '#A0A0A0', marginVertical: 5 },
  price: { fontSize: 18, color: '#00C9A7', fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 15, color: 'white', marginBottom: 20 },
  button: { backgroundColor: '#00C9A7' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default ApartmentDetailsScreen;
