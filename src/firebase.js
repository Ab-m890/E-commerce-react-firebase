import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyAvtyefF_KAUsdmYGK1oyjhX7atoMR7eUQ",
  authDomain: "react-app-3c087.firebaseapp.com",
  projectId: "react-app-3c087",
  storageBucket: "react-app-3c087.appspot.com",
  messagingSenderId: "989999851367",
  appId: "1:989999851367:web:59b56cf5ef795b1505f1c2",
  measurementId: "G-JF28Z6CYXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase