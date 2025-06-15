
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ25KgF2nTpqh5z0iDCUSB2oj-DCceWgo",
  authDomain: "tokyo-scholar-356213.firebaseapp.com",
  projectId: "tokyo-scholar-356213",
  storageBucket: "tokyo-scholar-356213.appspot.com",
  messagingSenderId: "353110342117",
  appId: "1:353110342117:web:e39b6dcce50b8bb325d70c",
  measurementId: "G-M2G1MN56WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (runs only in browser, avoid errors in SSR)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
