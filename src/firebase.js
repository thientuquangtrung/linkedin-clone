import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAdNb7zqJ5Bjv3NV5xgGHM3LATnu37vy04",
    authDomain: "linkedin-clone-8af6e.firebaseapp.com",
    projectId: "linkedin-clone-8af6e",
    storageBucket: "linkedin-clone-8af6e.appspot.com",
    messagingSenderId: "645156984007",
    appId: "1:645156984007:web:44f69adee7ce856ffc1ae2",
    measurementId: "G-3E2X1M6WJ5",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp); 

export { auth, provider, storage }

export default db;
