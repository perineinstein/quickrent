// ✅ Firebase-compatible ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase'; // adjust path to your firebase.js

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await auth.confirmPasswordReset(code, newPassword);
      Alert.alert('Success', 'Password reset successful!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>
      <Text style={styles.subHeader}>Check your email for a reset link or code.</Text>

      <TextInput
        label="Verification Code"
        mode="outlined"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="number-pad"
      />

      <TextInput
        label="New Password"
        mode="outlined"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Submit
      </Button>
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
  input: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#00C9A7',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
