import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: "recipe-builder-2a6b8",
    storageBucket: "recipe-builder-2a6b8.firebasestorage.app",
    messagingSenderId: "852522799586",
    appId: "1:852522799586:web:68c0b54f07f9fa79a029bb",
    measurementId: "G-9Z8FW0YJMN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
