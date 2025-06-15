import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../firebase';
import {
  collection, query, where, getDocs, doc, getDoc
} from 'firebase/firestore';

const ReceivedPaymentsScreen = () => {
  const [received, setReceived] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('status', '==', 'paid')
        );
        const snapshot = await getDocs(q);

        const relevant = [];
        for (const docSnap of snapshot.docs) {
          const booking = docSnap.data();
          const aptRef = doc(db, 'apartments', booking.apartmentId);
          const aptSnap = await getDoc(aptRef);

          if (aptSnap.exists() && aptSnap.data().landlordId === user.uid) {
            relevant.push({
              ...booking,
              id: docSnap.id,
              apartmentTitle: booking.apartmentTitle,
              amount: booking.apartmentPrice
            });
          }
        }
        setReceived(relevant);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReceived();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.apartmentTitle}</Title>
        <Paragraph style={styles.label}>Amount Received: GHS {item.amount?.toFixed(2)}</Paragraph>
        <Paragraph>Tenant: {item.userId}</Paragraph>
        <Paragraph>Date: {item.paidAt?.toDate?.().toLocaleDateString() || '—'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Received Payments</Text>
      <FlatList
        data={received}
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

export default ReceivedPaymentsScreen;
