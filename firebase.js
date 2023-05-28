import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyATAW6HioncZqTaJg3hrzUVyI1vw4csW0c",
    authDomain: "splitbill-75ad8.firebaseapp.com",
    projectId: "splitbill-75ad8",
    storageBucket: "splitbill-75ad8.appspot.com",
    messagingSenderId: "476584909821",
    appId: "1:476584909821:web:bad21182ae65b5e305d794",
    measurementId: "G-M3H3BK27C2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };