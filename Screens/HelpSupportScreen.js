import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HelpSupportScreen = ({ navigation }) => {
  const faqs = [
    {
      question: 'How do I search for apartments?',
      answer: 'Use the search bar on the Home Screen to find apartments by location, price, or type.',
    },
    {
      question: 'How do I pay rent?',
      answer: 'Go to the Payments Screen and select the apartment you want to pay for. Follow the prompts to complete the payment.',
    },
    {
      question: 'How do I contact a landlord?',
      answer: 'On the Apartment Details Screen, use the "Call" or "Message" buttons to contact the landlord directly.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      {/* FAQ Section */}
      <Card style={styles.faqCard}>
        <Card.Content>
          <Title style={styles.faqTitle}>Frequently Asked Questions</Title>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Contact Support Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ContactSupport')}
        style={styles.contactButton}
        labelStyle={styles.buttonText}
      >
        Contact Support
      </Button>
    </ScrollView>
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
  faqCard: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
  },
  faqTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqAnswer: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 5,
  },
  contactButton: {
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

export default HelpSupportScreen;