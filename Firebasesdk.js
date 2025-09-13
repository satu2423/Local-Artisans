// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBw6nzxCViLYRkBNky6NvcK0jf2OjCd_fs",
  authDomain: "local-artisans-fca9b.firebaseapp.com",
  projectId: "local-artisans-fca9b",
  storageBucket: "local-artisans-fca9b.appspot.com", // fixed typo: .app to .appspot.com
  messagingSenderId: "646410178299",
  appId: "1:646410178299:web:6691e7ef18eccc62702a5e",
  measurementId: "G-5QJ4SEZSLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };