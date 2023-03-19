// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { collection } from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUJLRsemomBvkYTFadLvOhEQzkABNb7g4",
  authDomain: "my-anki-44f5c.firebaseapp.com",
  projectId: "my-anki-44f5c",
  storageBucket: "my-anki-44f5c.appspot.com",
  messagingSenderId: "1052047948433",
  appId: "1:1052047948433:web:79f643f5a7d683e4729d30",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const SignIn = () => {
  signInWithRedirect(auth, provider);
};

export const db = getFirestore(app);
export const usersCollectionRef = collection(db, "users");
