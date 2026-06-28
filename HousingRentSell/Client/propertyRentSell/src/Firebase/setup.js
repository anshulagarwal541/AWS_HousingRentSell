import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBW_QdIUX7Mk3muZNXO683gTPuyEvxQjnI",
  authDomain: "houserentsell-34775.firebaseapp.com",
  projectId: "houserentsell-34775",
  storageBucket: "houserentsell-34775.appspot.com",
  messagingSenderId: "262550424308",
  appId: "1:262550424308:web:299ed3eca495f9860a2ca1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
