import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import moment from 'moment';

const MonthlyReportScreen = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('status', '==', 'paid'));
        const snapshot = await getDocs(q);

        const monthlyMap = {};

        snapshot.forEach(doc => {
          const data = doc.data();
          const date = data.paidAt?.toDate?.() || new Date();
          const monthKey = moment(date).format('YYYY-MM');

          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = {
              month: moment(date).format('MMMM YYYY'),
              totalRevenue: 0,
              totalCommission: 0,
              bookings: 0
            };
          }

          monthlyMap[monthKey].totalRevenue += data.paidAmount || 0;
          monthlyMap[monthKey].totalCommission += data.commission || 0;
          monthlyMap[monthKey].bookings += 1;
        });

        const sorted = Object.values(monthlyMap).sort((a, b) =>
          moment(b.month, 'MMMM YYYY').diff(moment(a.month, 'MMMM YYYY'))
        );

        setMonthlyData(sorted);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not fetch monthly reports.');
      }
    };

    fetchData();
  }, []);

  const renderReport = (month, revenue, commission, bookings) => (
    <Card key={month} style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{month}</Title>
        <Paragraph style={styles.text}>Revenue: GHS {revenue.toFixed(2)}</Paragraph>
        <Paragraph style={styles.text}>Commission: GHS {commission.toFixed(2)}</Paragraph>
        <Paragraph style={styles.text}>Bookings: {bookings}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Monthly Financial Report</Text>
      {monthlyData.map((item) =>
        renderReport(item.month, item.totalRevenue, item.totalCommission, item.bookings)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#2A2A2A', marginBottom: 15 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  text: { color: '#CCCCCC', fontSize: 15 }
});

export default MonthlyReportScreen;
