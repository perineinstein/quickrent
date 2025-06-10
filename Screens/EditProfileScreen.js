import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setImage(data.image || '');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        Alert.alert('Error', 'Could not load profile info.');
      }
    };
    loadProfile();
  }, [user.uid]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        phone,
        image,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Profile Image URL"
        style={styles.input}
        value={image}
        onChangeText={setImage}
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={handleUpdate}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#1A1A1A', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: { backgroundColor: '#00C9A7', paddingVertical: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default EditProfileScreen;
