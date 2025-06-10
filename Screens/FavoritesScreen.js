import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const fetchFavorites = async () => {
    try {
      const favSnapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
      const favApartmentIds = favSnapshot.docs.map(doc => doc.id);

      const apartmentsData = [];
      for (const aptId of favApartmentIds) {
        const aptDoc = await getDoc(doc(db, 'apartments', aptId));
        if (aptDoc.exists()) {
          apartmentsData.push({ id: aptDoc.id, ...aptDoc.data() });
        }
      }

      setFavorites(apartmentsData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorites</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00C9A7" />
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>You have no favorites yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardLocation: { color: '#A0A0A0' },
  cardPrice: { color: '#00C9A7', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#A0A0A0', marginTop: 30 },
});

export default FavoritesScreen;
