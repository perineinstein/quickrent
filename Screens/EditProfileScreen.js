import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [loading, setLoading] = useState(false);

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setImage(data.image || null);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        showSnackbar('Error loading profile');
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        phone,
        image,
      });
      showSnackbar('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.avatarBox}>
        <Image
          source={image ? { uri: image } : require('../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Button onPress={pickImage} mode="outlined" style={styles.imageBtn}>
          Change Picture
        </Button>
      </View>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="account" />}
      />

      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"
        left={<TextInput.Icon name="phone" />}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
        labelStyle={styles.buttonLabel}
      >
        Save Changes
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        style={{ backgroundColor: '#2A2A2A' }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 30, textAlign: 'center' },
  avatarBox: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  imageBtn: { borderColor: '#00C9A7', marginBottom: 30 },
  input: { marginBottom: 16, backgroundColor: '#2A2A2A' },
  saveButton: { backgroundColor: '#00C9A7', marginTop: 10, paddingVertical: 10 },
  buttonLabel: { color: 'white', fontWeight: 'bold' },
});

export default EditProfileScreen;
