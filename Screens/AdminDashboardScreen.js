import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminDashboardScreen = ({ navigation }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalLandlords, setTotalLandlords] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const bookingsSnapshot = await getDocs(
          query(collection(db, 'bookings'), where('status', '==', 'paid'))
        );

        let revenue = 0;
        let commission = 0;

        bookingsSnapshot.forEach(doc => {
          const data = doc.data();
          revenue += data.paidAmount || 0;
          commission += data.commission || 0;
        });

        setTotalRevenue(revenue);
        setTotalCommission(commission);
        setTotalBookings(bookingsSnapshot.size);

        const tenantsSnapshot = await getDocs(
          query(collection(db, 'users'), where('userType', '==', 'tenant'))
        );
        setTotalTenants(tenantsSnapshot.size);

        const landlordsSnapshot = await getDocs(
          query(collection(db, 'users'), where('userType', '==', 'landlord'))
        );
        setTotalLandlords(landlordsSnapshot.size);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not fetch admin data.');
      }
    };

    fetchAdminData();
  }, []);

  const renderCard = (title, value, color = '#00C9A7') => (
    <Card style={styles.card} key={title}>
      <Card.Content>
        <Title style={styles.cardTitle}>{title}</Title>
        <Paragraph style={[styles.cardValue, { color }]}>{value}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {renderCard('Total Revenue', `GHS ${totalRevenue.toFixed(2)}`)}
      {renderCard('Total Commission', `GHS ${totalCommission.toFixed(2)}`, '#FFB300')}
      {renderCard('Total Bookings', totalBookings)}
      {renderCard('Tenants Registered', totalTenants)}
      {renderCard('Landlords Registered', totalLandlords)}

      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('MonthlyReport')}
          style={styles.linkButton}
          labelStyle={styles.linkLabel}
        >
          📊 Monthly Report
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AdminSettings')}
          style={styles.linkButton}
          labelStyle={styles.linkLabel}
        >
          ⚙️ Commission Settings
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('UserManagement')}
          style={styles.linkButton}
          labelStyle={styles.linkLabel}
        >
          👥 Manage Users
        </Button>
      </View>

      <Text style={styles.footer}>QuickRent Admin • Powered by Paystack</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#2A2A2A', marginBottom: 15 },
  cardTitle: { color: 'white', fontSize: 18 },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  buttonGroup: { marginTop: 30 },
  linkButton: {
    marginBottom: 12,
    borderColor: '#00C9A7',
    backgroundColor: '#2A2A2A'
  },
  linkLabel: { color: '#00C9A7', fontWeight: 'bold' },
  footer: { textAlign: 'center', color: '#666', marginTop: 30, fontSize: 12 }
});

export default AdminDashboardScreen;
