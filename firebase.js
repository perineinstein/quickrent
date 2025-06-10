import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBBgc7ULG2APewUX_1tMwESDLGjsw7ztFI",
  authDomain: "quickrent-2e984.firebaseapp.com",
  projectId: "quickrent-2e984",
  storageBucket: "quickrent-2e984.appspot.com",
  messagingSenderId: "387831709624",
  appId: "1:387831709624:web:80ef2ee7a53671b641194d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// PROPER Auth initialization
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  console.log("Auth initialization error", error);
  // Fallback if persistence fails
  auth = initializeAuth(app);
}

export { auth };