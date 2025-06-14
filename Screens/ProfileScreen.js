import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '../firebase'; // ✅ Firebase Web SDK
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ name: '', phone: '', image: null });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Could not load profile.');
      }
    };
    fetchProfile();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Logout failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={profile.image ? { uri: profile.image } : require('../assets/avatar.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>{profile.name || 'No Name'}</Text>
      <Text style={styles.phone}>{profile.phone || 'No phone number'}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.editButton}
        labelStyle={styles.editButtonText}
      >
        Edit Profile
      </Button>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonText}
      >
        Logout
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('MyPayments')}
        style={styles.paymentButton}
        labelStyle={{ color: '#00C9A7' }}
      >
        View Payment History
      </Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1A1A1A' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  phone: { color: '#A0A0A0', fontSize: 14 },
  email: { color: '#A0A0A0', fontSize: 14, marginBottom: 20 },
  editButton: { borderColor: '#00C9A7', marginBottom: 15 },
  editButtonText: { color: '#00C9A7' },
  logoutButton: { backgroundColor: '#00C9A7' },
  logoutButtonText: { color: 'white', fontWeight: 'bold' },
  paymentButton: {
  borderColor: '#00C9A7',
  marginTop: 15
}

});

export default ProfileScreen;
