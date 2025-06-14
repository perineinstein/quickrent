import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Screens
import WelcomeScreen from './Screens/WelcomeScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import ConfirmationScreen from './Screens/ConfirmationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import HomeScreen from './Screens/HomeScreen';
import FavoritesScreen from './Screens/FavoritesScreen';
import ProfileScreen from './Screens/ProfileScreen';
import EditProfileScreen from './Screens/EditProfileScreen';
import ApartmentDetailsScreen from './Screens/ApartmentDetailsScreen';
import LandlordDashboard from './Screens/LandlordDashboard';
import AddApartmentScreen from './Screens/AddApartmentScreen';
import HelpSupportScreen from './Screens/HelpSupportScreen';
import ContactSupportScreen from './Screens/ContactSupportScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import ChatScreen from './Screens/ChatScreen';
import BookingScreen from './Screens/BookingScreen';
import PaymentScreen from './Screens/PaymentsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TenantTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#00C9A7',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: { backgroundColor: '#1A1A1A' },
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home',
          Favorites: 'favorite',
          Profile: 'person',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const LandlordTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#00C9A7',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: { backgroundColor: '#1A1A1A' },
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Dashboard: 'dashboard',
          Add: 'add-business',
          Profile: 'person',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={LandlordDashboard} />
    <Tab.Screen name="Add" component={AddApartmentScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(null);

  // Splash screen delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check if app is launched for the first time
  useEffect(() => {
    AsyncStorage.getItem('hasLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('hasLaunched', 'true');
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      console.log('Checking Firebase Auth...');
      console.log('User:', currentUser ? currentUser.email : 'Not signed in');

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setRole(userDoc.exists() ? userDoc.data().role || 'tenant' : 'tenant');
        } catch (err) {
          console.error('Error fetching role:', err);
          setRole('tenant');
          
        }
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing || showWelcome || firstLaunch === null) return <WelcomeScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstLaunch && !user ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}

        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={role === 'landlord' ? LandlordTabs : TenantTabs} />
            <Stack.Screen name="ApartmentDetails" component={ApartmentDetailsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} />
            <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            <Stack.Screen name="MyPayments" component={MyPaymentsScreen} />
            <Stack.Screen name="ReceivedPayments" component={ReceivedPaymentsScreen} />


          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
