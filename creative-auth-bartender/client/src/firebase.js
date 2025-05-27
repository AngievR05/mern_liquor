// Firebase client SDK initialization for use in your React app

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT0A-AdZaDJ2ImMUVBNEwBRLqV39Aw1bI",
  authDomain: "drunkeng-54515.firebaseapp.com",
  projectId: "drunkeng-54515",
  storageBucket: "drunkeng-54515.appspot.com", // <-- fix: use .appspot.com
  messagingSenderId: "928159052946",
  appId: "1:928159052946:web:32d43084fb88b6f6d9224b",
  measurementId: "G-16FHBE1G6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
