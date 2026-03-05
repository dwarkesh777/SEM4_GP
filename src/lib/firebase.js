import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE these with your actual Firebase project credentials from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCpD_x8omB3QZyVi93dPQfXDZoXWxpOIhA",
    authDomain: "bedbuddy-312c6.firebaseapp.com",
    projectId: "bedbuddy-312c6",
    storageBucket: "bedbuddy-312c6.firebasestorage.app",
    messagingSenderId: "247108079073",
    appId: "1:247108079073:web:2ae037679a3a68885c96a0",
    measurementId: "G-XGW6VVYJP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
