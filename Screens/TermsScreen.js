// Screens/TermsScreen.js
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const TermsScreen = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.header}>Terms & Conditions</Text>
    <Text style={styles.text}>
      Terms & Conditions - QuickRent

        1. QuickRent helps students find hostels/apartments through verified listings by landlords.
        2. Tenants are responsible for confirming the legitimacy of landlords before making payments.
        3. QuickRent is not responsible for disputes between tenants and landlords.
        4. All payments are securely processed via Paystack.
        5. Landlords must provide correct payout details to receive funds.
        6. A service commission (set by admin) is added to all rental payments.
        7. Any abuse, fraud, or impersonation will lead to account termination.
        8. Users data is protected under Firebase privacy rules.
        9. By using QuickRent, you agree to receive updates, alerts, and service notifications via the app.
        10. These terms may be updated periodically. Users will be notified of major changes.

        Contact: +233533245014
    </Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1A1A1A' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#00C9A7', marginBottom: 20 },
  text: { fontSize: 16, color: '#A0A0A0', lineHeight: 24 },
});

export default TermsScreen;
