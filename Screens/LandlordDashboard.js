import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgEmptyListings from '../assets/illustrations/empty-listings.svg';
import SvgEmptyPayments from '../assets/illustrations/empty-payments.svg';

const LandlordDashboardScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'apartments'),
          where('landlordId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      showSnackbar('Could not load your apartments.');
    }
  };

  const fetchPayments = async () => {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'bookings'),
          where('status', '==', 'paid')
        )
      );

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
      showSnackbar('Could not load payment info.');
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

      {listings.length > 0 ? (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyBox}>
          <SvgEmptyListings width={200} height={200} />
          <Text style={styles.emptyText}>You haven't added any apartments yet.</Text>
        </View>
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
        <View style={styles.emptyBox}>
          <SvgEmptyPayments width={200} height={200} />
          <Text style={styles.emptyText}>No payments received yet.</Text>
        </View>
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
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginVertical: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  paymentCard: { marginBottom: 10, backgroundColor: '#1F1F1F' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardLocation: { color: '#A0A0A0' },
  cardPrice: { color: '#00C9A7', fontWeight: 'bold' },
  totalIncome: { fontSize: 18, color: '#00C9A7', marginBottom: 15, textAlign: 'center' },
  listContainer: { paddingBottom: 60 },
  emptyText: { color: '#A0A0A0', textAlign: 'center', marginTop: 15 },
  emptyBox: { alignItems: 'center', marginVertical: 30 },
  addButton: { backgroundColor: '#00C9A7', marginTop: 30 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default LandlordDashboardScreen;
