import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { auth } from '../firebase'; // adjust path to your firebase.js

const ConfirmationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  // Send verification email on mount
  useEffect(() => {
    const sendVerification = async () => {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await user.sendEmailVerification();
      }
    };
    sendVerification();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const checkVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      await user.reload(); // Refresh user's emailVerified status
      if (user.emailVerified) {
        Alert.alert('Success', 'Email verified!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Still not verified', 'Please check your email for the verification link.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const user = auth.currentUser;
      await user.sendEmailVerification();
      setTimer(60);
      Alert.alert('Sent', 'A new verification email has been sent.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify Your Email</Text>
      <Text style={styles.subHeader}>
        A verification link has been sent to{' '}
        <Text style={styles.emailText}>{email}</Text>. Please check your inbox.
      </Text>

      <Button
        mode="contained"
        onPress={checkVerification}
        loading={loading}
        style={styles.verifyButton}
        labelStyle={styles.buttonText}
      >
        Check Verification
      </Button>

      <TouchableOpacity onPress={resendVerification} disabled={timer > 0}>
        <Text style={styles.resendText}>
          Didn’t receive the link?{' '}
          <Text style={[styles.resendLink, timer > 0 && { color: '#A0A0A0' }]}>
            Resend {timer > 0 ? `(${timer}s)` : ''}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 40,
  },
  emailText: {
    color: '#00C9A7',
    fontWeight: 'bold',
  },
  verifyButton: {
    marginTop: 10,
    backgroundColor: '#00C9A7',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 20,
  },
  resendLink: {
    color: '#00C9A7',
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
