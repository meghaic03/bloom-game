// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHHfbyauxDGLs7Bj5Los8cpRDAmrWgK6o",
  authDomain: "meghai-bloom.firebaseapp.com",
  projectId: "meghai-bloom",
  storageBucket: "meghai-bloom.firebasestorage.app",
  messagingSenderId: "178525755829",
  appId: "1:178525755829:web:59fc783986a0deed3d61fc",
  measurementId: "G-0X9J2D4GPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
