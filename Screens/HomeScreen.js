import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { db, auth } from '../firebase'; // Adjust the path if needed
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [apartments, setApartments] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const fetchApartments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'apartments'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApartments(data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      Alert.alert('Error', 'Failed to fetch apartments.');
    }
  };

  const fetchFavorites = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
      const favs = {};
      snapshot.docs.forEach(doc => {
        favs[doc.id] = true;
      });
      setFavoritesMap(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (apartmentId) => {
    const favRef = doc(db, 'users', user.uid, 'favorites', apartmentId);
    const isFav = favoritesMap[apartmentId];

    try {
      if (isFav) {
        await deleteDoc(favRef);
        setFavoritesMap(prev => ({ ...prev, [apartmentId]: false }));
      } else {
        await setDoc(favRef, { savedAt: new Date() });
        setFavoritesMap(prev => ({ ...prev, [apartmentId]: true }));
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Could not update favorites.');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchApartments();
      await fetchFavorites();
      setLoading(false);
    };
    load();
  }, []);

  const renderApartmentCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ApartmentDetails', { apartmentId: item.id })}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.images?.[0] || '' }} />
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>{item.title}</Title>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Icon
                name="favorite"
                size={24}
                color={favoritesMap[item.id] ? 'red' : '#A0A0A0'}
              />
            </TouchableOpacity>
          </View>
          <Paragraph style={styles.cardLocation}>{item.location}</Paragraph>
          <Paragraph style={styles.cardPrice}>GHS {item.price}/month</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QuickRent</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C9A7" />
        </View>
      ) : (
        <FlatList
          data={apartments}
          renderItem={renderApartmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 20, backgroundColor: '#2A2A2A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardLocation: { color: '#A0A0A0' },
  cardPrice: { color: '#00C9A7', fontWeight: 'bold' },
  list: { paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
