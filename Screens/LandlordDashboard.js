import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy
} from 'firebase/firestore';

const LandlordDashboardScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'apartments'), where('landlordId', '==', user.uid))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Could not load your apartments.');
    }
  };

  const fetchPayments = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'bookings'), where('status', '==', 'paid'), orderBy('timestamp', 'desc'))
      );

      const landlordPayments = [];
      let income = 0;

      for (let docSnap of snapshot.docs) {
        const booking = docSnap.data();
        const aptId = booking.apartmentId;
        const aptRef = doc(db, 'apartments', aptId);
        const aptSnap = await getDoc(aptRef);

        if (aptSnap.exists() && aptSnap.data().landlordId === user.uid) {
          landlordPayments.push({ id: docSnap.id, ...booking });
          income += booking.apartmentPrice || 0;
        }
      }

      setPayments(landlordPayments);
      setTotalIncome(income);
    } catch (error) {
      console.error('Error fetching payments:', error);
      Alert.alert('Error', 'Could not load payments.');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchListings();
      await fetchPayments();
      setLoading(false);
    };
    load();
  }, []);

  const renderListing = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ApartmentDetails', { apartmentId: item.id })}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.images?.[0] || '' }} />
        <Card.Content>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Paragraph style={styles.cardLocation}>{item.location}</Paragraph>
          <Paragraph style={styles.cardPrice}>GHS {item.price}/month</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderPayment = ({ item }) => (
    <Card style={styles.paymentCard}>
      <Card.Content>
        <Title style={styles.paymentTitle}>Booking by: {item.userId}</Title>
        <Paragraph style={styles.paymentInfo}>Apartment: {item.apartmentTitle}</Paragraph>
        <Paragraph style={styles.paymentInfo}>Paid: GHS {item.apartmentPrice?.toFixed(2)}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Listings</Text>

      {listings.length > 0 ? (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderListing}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No apartments listed yet.</Text>
      )}

      <Text style={styles.header}>Payment Dashboard</Text>
      <Text style={styles.incomeText}>Total Income: GHS {totalIncome.toFixed(2)}</Text>

      {payments.length > 0 ? (
        <FlatList
          data={payments}
          keyExtractor={item => item.id}
          renderItem={renderPayment}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No payments yet.</Text>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddApartment')}
        style={styles.addButton}
        labelStyle={styles.addButtonText}
      >
        Add Apartment
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('ReceivedPayments')}
        style={styles.linkButton}
        labelStyle={{ color: '#00C9A7' }}
      >
        View Received Payments
      </Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 22, color: 'white', fontWeight: 'bold', marginVertical: 15 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  paymentCard: { marginBottom: 10, backgroundColor: '#1F1F1F' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardLocation: { color: '#A0A0A0' },
  cardPrice: { color: '#00C9A7', fontWeight: 'bold' },
  paymentTitle: { color: 'white', fontWeight: 'bold' },
  paymentInfo: { color: '#CCCCCC', fontSize: 14 },
  listContainer: { paddingBottom: 100 },
  emptyText: { color: '#A0A0A0', textAlign: 'center', marginBottom: 20 },
  incomeText: { color: '#00C9A7', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  addButton: { backgroundColor: '#00C9A7', marginTop: 20 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  linkButton: {
  borderColor: '#00C9A7',
  marginTop: 15
  }

});

export default LandlordDashboardScreen;
