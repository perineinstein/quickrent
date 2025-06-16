import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { Button } from 'react-native-paper';
import Onboarding1 from '../assets/illustrations/onboarding1.svg';
import Onboarding2 from '../assets/illustrations/onboarding2.svg';
import Onboarding3 from '../assets/illustrations/onboarding3.svg';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      title: 'Find Hostels Easily',
      text: 'Browse verified student apartments and book from anywhere.',
      image: <Onboarding1 width={250} height={250} />,
    },
    {
      title: 'List Your Property',
      text: 'Landlords can showcase hostels and manage listings easily.',
      image: <Onboarding2 width={250} height={250} />,
    },
    {
      title: 'Track Bookings & Payments',
      text: 'Get payment insights and manage bookings in one place.',
      image: <Onboarding3 width={250} height={250} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={true}
        onIndexChanged={setActiveIndex}
        activeDotColor="#00C9A7"
      >
        {slides.map((slide, i) => (
          <View style={styles.slide} key={i}>
            {slide.image}
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </Swiper>

      <Button
        mode="contained"
        onPress={() => navigation.replace('Login')}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {activeIndex === slides.length - 1 ? 'Get Started' : 'Skip'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  text: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#00C9A7',
    margin: 20,
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardingScreen;
