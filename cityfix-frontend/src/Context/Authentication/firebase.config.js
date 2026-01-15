import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAojmJezOKJE2acnK0BSzRJQMN64GCdPqM",
    authDomain: "cityfix-report.firebaseapp.com",
    projectId: "cityfix-report",
    storageBucket: "cityfix-report.firebasestorage.app",
    messagingSenderId: "788979794746",
    appId: "1:788979794746:web:e7607a40c86f5a2c114603"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);