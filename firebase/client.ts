// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_pRLWVOPLDDNm1lGQ3LjYPN4u_VFZtFM",
  authDomain: "knovo-60865.firebaseapp.com",
  projectId: "knovo-60865",
  storageBucket: "knovo-60865.firebasestorage.app",
  messagingSenderId: "837264573643",
  appId: "1:837264573643:web:7589f18c49e04164dec74e",
  measurementId: "G-5TMMSY14Q3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Client Side 
export const auth = getAuth(app);
export const db = getFirestore(app);