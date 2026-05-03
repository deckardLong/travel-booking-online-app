// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfL5OhMbUgW3HsCn1a4IQU8ZIND_eEgEQ",
    authDomain: "travel-app-75deb.firebaseapp.com",
    databaseURL: "https://travel-app-75deb-default-rtdb.firebaseio.com",
    projectId: "travel-app-75deb",
    storageBucket: "travel-app-75deb.firebasestorage.app",
    messagingSenderId: "51761220366",
    appId: "1:51761220366:web:87c45da98b2f39ce07255f",
    measurementId: "G-FY25TJ7ZJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);