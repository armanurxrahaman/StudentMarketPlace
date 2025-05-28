// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjcdmDd8ZXLpLc819_5y6jY9-z1GT4yJ4",
  authDomain: "marketplace-38fdd.firebaseapp.com",
  projectId: "marketplace-38fdd",
  storageBucket: "marketplace-38fdd.firebasestorage.app",
  messagingSenderId: "603600129321",
  appId: "1:603600129321:web:88ad3b6ad4f93c1afb7b38",
  measurementId: "G-R0K18HXV60"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
