import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

const slides = [
  {
    image: require('../assets/search.png'),
    title: 'Find Apartments Easily',
    description: 'Browse and discover apartments in your preferred location with ease.',
  },
  {
    image: require('../assets/add-apartment.png'),
    title: 'Post Apartments for Rent',
    description: 'Landlords can list apartments with images, price, and description.',
  },
  {
    image: require('../assets/dashboard.png'),
    title: 'Dashboard for Landlords',
    description: 'Track bookings and view payment history from one place.',
  },
  {
    image: require('../assets/payment.png'),
    title: 'Secure Booking & Payment',
    description: 'Book apartments and make secure payments through the app.',
  },
  {
    image: require('../assets/help.png'),
    title: 'In-App Support',
    description: 'Chat with support or report issues directly from the app.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  return (
    <Swiper
      loop={false}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      showsButtons={false}
    >
      {slides.map((slide, index) => (
        <View key={index} style={styles.slide}>
          <Image source={slide.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
          {index === slides.length - 1 && (
            <Button
              mode="contained"
              onPress={() => navigation.replace('Login')}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Get Started
            </Button>
          )}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.7,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 20,
  },
  dot: {
    backgroundColor: '#555',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#00C9A7',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  button: {
    backgroundColor: '#00C9A7',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
