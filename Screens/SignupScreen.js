import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase'; // adjust path to your firebase.js
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification();
      Alert.alert('Success', 'Account created. Please verify your email.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="home" size={100} color="#00C9A7" style={styles.logo} />
      <Text style={styles.header}>Find Your Perfect Home</Text>
      <Text style={styles.subHeader}>Create an account to continue</Text>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        error={!!errors.email}
        left={<TextInput.Icon name="email" />}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        error={!!errors.password}
        left={<TextInput.Icon name="lock" />}
        right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
        secureTextEntry={!showPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <Button
        mode="contained"
        onPress={handleEmailSignup}
        loading={loading}
        style={styles.signupButton}
        labelStyle={styles.buttonText}
      >
        Create Account
      </Button>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  logo: {
    alignSelf: 'center',
    marginVertical: 30,
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
    marginBottom: 10,
    backgroundColor: '#2A2A2A',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signupButton: {
    marginTop: 20,
    backgroundColor: '#00C9A7',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#A0A0A0',
  },
  loginLink: {
    color: '#00C9A7',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
