import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReset = async () => {
    setSending(true);
    try {
      await auth.sendPasswordResetEmail(email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Reset error:', error.message);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="lock-reset" size={80} color="#00C9A7" style={styles.icon} />
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon name="email" />}
      />

      <Button
        mode="contained"
        onPress={handleReset}
        loading={sending}
        disabled={!email}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Send Reset Link
      </Button>

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#1A1A1A', padding: 24 },
  icon: { alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  subtitle: { color: '#A0A0A0', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  input: { marginBottom: 20, backgroundColor: '#2A2A2A' },
  button: { backgroundColor: '#00C9A7', paddingVertical: 10, borderRadius: 8 },
  buttonText: { fontWeight: 'bold', color: 'white' },
  message: { textAlign: 'center', color: '#00C9A7', marginTop: 20, fontSize: 14 },
});

export default ResetPasswordScreen;
