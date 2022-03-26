// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBo7s-tFsPSWwxbrRO4kd9NtRCQuYw3jc",
  authDomain: "cappcamp.firebaseapp.com",
  projectId: "cappcamp",
  storageBucket: "cappcamp.appspot.com",
  messagingSenderId: "335695792175",
  appId: "1:335695792175:web:5f2796964cb387ca629eda",
  measurementId: "G-H2D9Y6F575",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore();
export const storage = getStorage(app);
