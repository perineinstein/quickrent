import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { auth, db } from '../firebase'; // ✅ Web SDK
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LandlordDashboardScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const q = query(
        collection(db, 'apartments'),
        where('landlordId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Could not load your apartments.');
    }
  };

  const fetchPayments = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('status', '==', 'paid')
      );
      const snapshot = await getDocs(q);

      const landlordPayments = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(booking => listings.find(listing => listing.id === booking.apartmentId));

      const income = landlordPayments.reduce((sum, booking) => {
        const apt = listings.find(l => l.id === booking.apartmentId);
        return sum + (apt?.price || 0);
      }, 0);

      setPayments(landlordPayments);
      setTotalIncome(income);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchListings();
      await fetchPayments();
      setLoading(false);
    };
    loadData();
  }, []);

  const renderItem = ({ item }) => (
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

  const renderPaymentItem = ({ item }) => (
    <Card style={styles.paymentCard}>
      <Card.Content>
        <Title style={styles.cardTitle}>Payment from: {item.userId}</Title>
        <Paragraph style={styles.cardLocation}>Apartment ID: {item.apartmentId}</Paragraph>
        <Paragraph style={styles.cardPrice}>Status: {item.status}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Listings</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : listings.length > 0 ? (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>You have not added any apartments yet.</Text>
      )}

      <Text style={styles.header}>Payment Dashboard</Text>
      <Text style={styles.totalIncome}>Total Income: GHS {totalIncome}</Text>
      {payments.length > 0 ? (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No payments received yet.</Text>
      )}

      <Button
        icon={() => <Icon name="add" size={20} color="white" />}
        mode="contained"
        onPress={() => navigation.navigate('AddApartment')}
        style={styles.addButton}
        labelStyle={styles.buttonText}
      >
        Add Apartment
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  paymentCard: { marginBottom: 10, backgroundColor: '#1F1F1F' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardLocation: { color: '#A0A0A0' },
  cardPrice: { color: '#00C9A7', fontWeight: 'bold' },
  listContainer: { paddingBottom: 80 },
  loadingText: { color: '#A0A0A0', textAlign: 'center' },
  emptyText: { color: '#A0A0A0', textAlign: 'center', marginBottom: 30 },
  addButton: { backgroundColor: '#00C9A7', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  totalIncome: { fontSize: 18, color: '#00C9A7', marginBottom: 15, textAlign: 'center' }
});

export default LandlordDashboardScreen;
