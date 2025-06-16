import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import SvgEmptyNotifications from '../assets/illustrations/empty-notifications.svg';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  const fetchNotifications = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    } catch (error) {
      console.error('Notification error:', error);
      showSnackbar('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.title}</Title>
        <Paragraph style={styles.body}>{item.body}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SvgEmptyNotifications width={200} height={200} />
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

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
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  body: { color: '#A0A0A0' },
  list: { paddingBottom: 80 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    color: '#A0A0A0',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center'
  }
});

export default NotificationsScreen;
