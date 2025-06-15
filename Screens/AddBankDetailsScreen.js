import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Alert, Picker, TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-paper';
import { auth } from '../firebase';
import { createSubaccountForLandlord } from '../utils/paystack';

const AddBankDetailsScreen = ({ navigation }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [providerType, setProviderType] = useState('bank'); // or 'momo'
  const [bankCode, setBankCode] = useState('057'); // default GTBank

  const bankOptions = [
    { label: 'GTBank', code: '057' },
    { label: 'UBA', code: '033' },
    { label: 'Access Bank', code: '044' },
  ];

  const momoOptions = [
    { label: 'MTN Mobile Money', code: 'MTN' },
    { label: 'Vodafone Cash', code: 'VDF' },
    { label: 'AirtelTigo Money', code: 'ATL' },
  ];

  const handleSubmit = async () => {
    if (!accountNumber || !bankCode) {
      return Alert.alert('Error', 'Please fill in all required fields');
    }

    const user = auth.currentUser;
    if (!user) return Alert.alert('Error', 'You must be signed in');

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'QuickRent Landlord',
      accountNumber,
      bankCode
    };

    const result = await createSubaccountForLandlord(userData);
    if (result) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Payout Details</Text>

      <Text style={styles.label}>Choose Payment Method:</Text>
      <Picker
        selectedValue={providerType}
        onValueChange={(val) => setProviderType(val)}
        style={styles.picker}
      >
        <Picker.Item label="Bank Account" value="bank" />
        <Picker.Item label="Mobile Money" value="momo" />
      </Picker>

      <Text style={styles.label}>Select {providerType === 'bank' ? 'Bank' : 'Network'}:</Text>
      <Picker
        selectedValue={bankCode}
        onValueChange={(val) => setBankCode(val)}
        style={styles.picker}
      >
        {(providerType === 'bank' ? bankOptions : momoOptions).map((option) => (
          <Picker.Item key={option.code} label={option.label} value={option.code} />
        ))}
      </Picker>

      <Text style={styles.label}>Account Number:</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        placeholder="Enter account or phone number"
        placeholderTextColor="#aaa"
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Submit Details
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', padding: 20 },
  header: { fontSize: 22, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  label: { color: '#ccc', marginTop: 10 },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  picker: {
    color: 'white',
    backgroundColor: '#2A2A2A',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00C9A7',
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddBankDetailsScreen;
