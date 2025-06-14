import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, Alert
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query
} from 'firebase/firestore';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'users')));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch users');
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = users.filter(u =>
      (u.name?.toLowerCase().includes(text.toLowerCase()) || u.email?.toLowerCase().includes(text.toLowerCase()))
    );
    setFiltered(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.name}>{item.name || 'No Name'}</Title>
        <Paragraph style={styles.email}>{item.email}</Paragraph>
        <Paragraph style={styles.role}>Role: {item.userType}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email"
        value={search}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 22, color: 'white', fontWeight: 'bold', marginBottom: 15 },
  searchInput: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    color: 'white',
    marginBottom: 15
  },
  card: { backgroundColor: '#2A2A2A', marginBottom: 12 },
  name: { color: 'white', fontSize: 18 },
  email: { color: '#A0A0A0' },
  role: { color: '#00C9A7', marginTop: 4 },
  list: { paddingBottom: 80 }
});

export default UserManagementScreen;
