import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminSettingsScreen = () => {
  const [rate, setRate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRate = async () => {
    try {
      const docRef = doc(db, 'admin', 'config');
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setRate(data?.commissionRate?.toString() || '5');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load commission settings.');
    }
  };

  const saveRate = async () => {
    const parsed = parseFloat(rate);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      Alert.alert('Invalid', 'Enter a number between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      await setDoc(doc(db, 'admin', 'config'), {
        commissionRate: parsed
      });
      Alert.alert('Updated', 'Commission rate saved.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save commission.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Commission Settings</Title>
      <Text style={styles.label}>Current Commission Rate (%)</Text>

      <TextInput
        style={styles.input}
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
        placeholder="e.g. 5"
        placeholderTextColor="#888"
      />

      <Button
        mode="contained"
        onPress={saveRate}
        loading={loading}
        style={styles.saveButton}
        labelStyle={{ fontWeight: 'bold', color: 'white' }}
      >
        Save Commission Rate
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  header: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { color: '#888', fontSize: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20
  },
  saveButton: {
    backgroundColor: '#00C9A7',
    paddingVertical: 10
  }
});

export default AdminSettingsScreen;
