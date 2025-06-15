import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyPaymentsScreen = () => {
  const [payments, setPayments] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          where('status', '==', 'paid')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPayments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.apartmentTitle}</Title>
        <Paragraph style={styles.label}>Amount Paid: GHS {item.paidAmount?.toFixed(2)}</Paragraph>
        <Paragraph>Status: {item.status}</Paragraph>
        <Paragraph>Date: {item.paidAt?.toDate?.().toLocaleDateString() || '—'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 15 },
  card: { backgroundColor: '#2A2A2A', marginBottom: 15 },
  title: { color: 'white', fontSize: 18 },
  label: { color: '#00C9A7', marginTop: 4 },
  list: { paddingBottom: 80 }
});

export default MyPaymentsScreen;
