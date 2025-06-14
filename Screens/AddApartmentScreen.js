import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const AddApartmentScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handlePickImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, response => {
      if (!response.didCancel && !response.errorCode) {
        const selected = response.assets.map((asset) => asset.uri);
        setImages(selected);
      }
    });
  };

  const uploadImages = async () => {
    const urls = [];

    for (const uri of images) {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const reference = storage().ref(`apartment_images/${filename}`);
      await reference.putFile(uri);
      const url = await reference.getDownloadURL();
      urls.push(url);
    }

    return urls;
  };

  const handleAddApartment = async () => {
    if (!title || !location || !price || !description) {
      Alert.alert('Missing Fields', 'Please fill out all the fields.');
      return;
    }

    setUploading(true);

    try {
      const user = auth.currentUser;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const subaccount = userDoc.exists() ? userDoc.data().subaccount_code : null;

      const imageUrls = await uploadImages();

      await firestore().collection('apartments').add({
        title,
        location,
        price: parseFloat(price),
        description,
        images: imageUrls,
        landlordId: user.uid,
        landlordPhone: user.phoneNumber || 'N/A',
        subaccount_code: subaccount, // ✅ Store for payment routing
        amenities: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
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
      />
      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        placeholder="Price (GHS)"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImages}>
        <Icon name="add-a-photo" size={24} color="#00C9A7" />
        <Text style={styles.imagePickerText}>Pick Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.previewContainer}>
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.previewImage} />
        ))}
      </ScrollView>

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
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#00C9A7',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
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
