/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "mrdu-adm",
  appId: "1:555153660424:web:7f79a3e72ef575ac62cfbd",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyATqy1oAgt9i1BeLklDERZLRBbGIYnPYcA",
  authDomain: "mrdu-adm.firebaseapp.com",
  storageBucket: "mrdu-adm.firebasestorage.app",
  messagingSenderId: "555153660424"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, "ai-studio-75391cbd-3005-4a26-8e86-775da0bd6110");

