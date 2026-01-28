// Auth.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_Vf4hDwMgYyEBBB6bHAeEQWnfPGKvAMo",
  authDomain: "photobox-a5ead.firebaseapp.com",
  projectId: "photobox-a5ead",
  storageBucket: "photobox-a5ead.firebasestorage.app",
  messagingSenderId: "354700107844",
  appId: "1:354700107844:web:3593d1d39ab20332851c11",
    measurementId: "G-CT36BWW9YK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
