import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
// 1. IMPORTA estas funciones necesarias
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAceJDCQ_69GVNDlXqR5XqljKAhRiDQoKg",
  authDomain: "juegoaa.firebaseapp.com",
  projectId: "juegoaa",
  storageBucket: "juegoaa.firebasestorage.app",
  messagingSenderId: "1077881363094",
  appId: "1:1077881363094:web:174f4c83bc34246f00c0b7",
  measurementId: "G-0QK0SKE1M1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. EXPORTA 'auth' correctamente
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// 3. EXPORTA 'dbRealtime' (Esto quita el error de tu imagen)
export const dbRealtime = getDatabase(app);

// 4. EXPORTA 'storage' (También lo estás usando en HomeScreen)
export const storage = getStorage(app);