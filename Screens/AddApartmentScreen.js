import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView
} from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '../firebase'; // ✅ Web SDK
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddApartmentScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddApartment = async () => {
    if (!title || !location || !price || !description) {
      Alert.alert('Missing Fields', 'Please fill out all the fields.');
      return;
    }

    setUploading(true);

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, 'apartments'), {
        title,
        location,
        price: parseFloat(price),
        description,
        images: [
          'https://via.placeholder.com/400x300.png?text=Apartment+Image'
        ],
        landlordId: user.uid,
        landlordPhone: user.phoneNumber || 'N/A',
        amenities: [],
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Apartment added successfully!');
      navigation.goBack();

    } catch (error) {
      console.error('Error uploading apartment:', error);
      Alert.alert('Error', 'Failed to add apartment.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Apartment</Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Price (GHS)"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleAddApartment}
        loading={uploading}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Post Apartment
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00C9A7',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddApartmentScreen;
