import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDW-DvlozXVEZro1Z0qy1LKQyWaO_K01Fw",
    authDomain: "netflix-clone-88070.firebaseapp.com",
    projectId: "netflix-clone-88070",
    storageBucket: "netflix-clone-88070.appspot.com",
    messagingSenderId: "688314951436",
    appId: "1:688314951436:web:c16d4dfce8742b3b29cb29",
    measurementId: "G-FJ4YX17BK5"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  export { auth }
  export default db;