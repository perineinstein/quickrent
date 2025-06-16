import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgIllustration from '../assets/illustrations/empty-favorites.svg'; // ✅ your SVG file

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const user = auth.currentUser;

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const snapshot = await getDocs(collection(db, `users/${user.uid}/favorites`));
        const data = snapshot.docs.map(doc => doc.id); // Store apartment IDs
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        showSnackbar('Failed to load favorites');
      }
    };

    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorites</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SvgIllustration width={200} height={200} />
          <Text style={styles.emptyText}>No favorite apartments yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>{item}</Title>
                <Paragraph style={styles.text}>Apartment ID</Paragraph>
              </Card.Content>
            </Card>
          )}
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
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#2A2A2A' },
  title: { color: 'white' },
  text: { color: '#A0A0A0' },
  list: { paddingBottom: 80 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  }
});

export default FavoritesScreen;
