import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnFjpXxR6ZPkFvSAf_aqQB-qdApKV5Gs4",
  authDomain: "app-2-d919d.firebaseapp.com",
  projectId: "app-2-d919d",
  storageBucket: "app-2-d919d.appspot.com",
  messagingSenderId: "222405404228",
  appId: "1:222405404228:web:2ee77f47151c665db4be11",
  measurementId: "G-MWSY3LDMM7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, db, storage };
