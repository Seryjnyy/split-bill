import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase";

export const fetchSessionWithKeyCode = async (_joinCode) => {
    const q = query(collection(db, "sessions"), where("joinCode", "==", _joinCode));
    // const docRef = doc(db, "sessions", _joinCode)
    return await getDocs(q);
}