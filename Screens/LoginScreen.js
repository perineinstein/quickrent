import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="login" size={80} color="#00C9A7" style={styles.icon} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to find your apartment</Text>

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

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
        right={
          <TextInput.Icon
            name={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.loginButton}
        labelStyle={styles.loginLabel}
      >
        Log In
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 24, justifyContent: 'center' },
  icon: { alignSelf: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#A0A0A0', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  input: { marginBottom: 16, backgroundColor: '#2A2A2A' },
  forgot: { color: '#00C9A7', textAlign: 'right', marginBottom: 25 },
  loginButton: { backgroundColor: '#00C9A7', paddingVertical: 10, borderRadius: 8 },
  loginLabel: { fontWeight: 'bold', color: 'white' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#A0A0A0' },
  link: { color: '#00C9A7', fontWeight: 'bold' },
});

export default LoginScreen;
