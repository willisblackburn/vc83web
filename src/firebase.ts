import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBrv5mWl3_5FogkQMIbWedMNY-HgjcuA1c",
  authDomain: "vc83web.firebaseapp.com",
  projectId: "vc83web",
  storageBucket: "vc83web.firebasestorage.app",
  messagingSenderId: "865154490521",
  appId: "1:865154490521:web:d422d54efd6e5f473dd808",
  measurementId: "G-KJ7GWGK933"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export default app;
