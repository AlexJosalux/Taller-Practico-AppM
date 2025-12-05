import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBXVB1g70mA7sUKSWSK7KJGxhjdJoIvNw",
  authDomain: "mensajeriaapp-7b24c.firebaseapp.com",
  projectId: "mensajeriaapp-7b24c",
  storageBucket: "mensajeriaapp-7b24c.firebasestorage.app",
  messagingSenderId: "142569696636",
  appId: "1:142569696636:web:f800a711a2da15f0a848f9"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});