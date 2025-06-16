import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const HelpSupportScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [loading, setLoading] = useState(false);

  const showSnackbar = (msg) => setSnackbar({ visible: true, message: msg });

  const handleSubmit = async () => {
    if (!subject || !message) {
      showSnackbar('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'support_requests'), {
        userId: user.uid,
        subject,
        message,
        timestamp: serverTimestamp(),
      });
      setSubject('');
      setMessage('');
      showSnackbar('Message sent to support team!');
    } catch (error) {
      console.error('Support error:', error);
      showSnackbar('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Need Help?</Text>
      <Text style={styles.subHeader}>We’re here to support you. Submit your issue below.</Text>

      <TextInput
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="help-circle" />}
      />

      <TextInput
        label="Message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        mode="outlined"
        style={[styles.input, { height: 120 }]}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
        labelStyle={styles.buttonText}
      >
        Send Message
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
  container: {
    padding: 24,
    backgroundColor: '#1A1A1A',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  submitButton: {
    backgroundColor: '#00C9A7',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HelpSupportScreen;
