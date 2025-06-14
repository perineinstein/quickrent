// utils/paystack.js
import axios from 'axios';
import { Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PAYSTACK_SECRET_KEY = 'sk_test_c7a663eec8e1cebb44900dec695da53c4733096b'; // 🔁 Replace with your real test key

export const createSubaccountForLandlord = async (user) => {
  const { displayName, email, accountNumber, bankCode, uid } = user;

  try {
    const response = await axios.post(
      'https://api.paystack.co/subaccount',
      {
        business_name: displayName || 'QuickRent Landlord',
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: 5,
        primary_contact_email: email
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const subaccountCode = response.data.data.subaccount_code;

    // Save to Firestore
    await updateDoc(doc(db, 'users', uid), {
      subaccount_code: subaccountCode
    });

    Alert.alert('Success', 'Subaccount created successfully!');
    return subaccountCode;

  } catch (error) {
    console.error('Paystack Error:', error.response?.data || error.message);
    Alert.alert('Error', 'Failed to create Paystack subaccount.');
    return null;
  }
};
