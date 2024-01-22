// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCb9xXAkJie-R053FQLTBFjvGQiFaeIkiA",
  authDomain: "t0-python.firebaseapp.com",
  databaseURL: "https://t0-python-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "t0-python",
  storageBucket: "t0-python.appspot.com",
  messagingSenderId: "331595037617",
  appId: "1:331595037617:web:389f050cad41e45e819b90",
  measurementId: "G-5KHBYTD2TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider = new GoogleAuthProvider()

export {provider , auth}