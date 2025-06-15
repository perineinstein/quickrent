import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Card, Paragraph } from 'react-native-paper';

const NotificationsScreen = () => {
  const user = auth.currentUser;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user.uid]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.message}>{item.message}</Paragraph>
        <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00C9A7" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>You have no notifications.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  message: { color: 'white', fontSize: 16 },
  timestamp: { color: '#A0A0A0', fontSize: 12, marginTop: 5 },
  emptyText: { color: '#A0A0A0', textAlign: 'center', marginTop: 30 },
});

export default NotificationsScreen;
