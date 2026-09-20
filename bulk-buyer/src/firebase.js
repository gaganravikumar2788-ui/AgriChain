import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCptR_29el2nlZfUVC1Q-pnFapyTdAXvfw",
  authDomain: "agrichain-5e907.firebaseapp.com",
  projectId: "agrichain-5e907",
  storageBucket: "agrichain-5e907.firebasestorage.app",
  messagingSenderId: "350989711844",
  appId: "1:350989711844:web:e0082f25bbdf4be7c06ff1",
  measurementId: "G-WW2CWD6CYQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
