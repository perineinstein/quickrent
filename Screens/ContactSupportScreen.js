import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactSupportScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Send Message
  const handleSendMessage = () => {
    if (!message) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }
    setLoading(true);
    // Simulate sending a message
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your message has been sent!');
      navigation.goBack();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Contact Support</Text>
      </View>

      {/* Message Input */}
      <TextInput
        label="Message"
        mode="outlined"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        multiline
        numberOfLines={5}
      />

      {/* Send Button */}
      <Button
        mode="contained"
        onPress={handleSendMessage}
        loading={loading}
        style={styles.sendButton}
        labelStyle={styles.buttonText}
      >
        Send Message
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: '#00C9A7',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactSupportScreen;