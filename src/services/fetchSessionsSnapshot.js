import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchSessionsSnapshot = (_userID, _action) => {
    const q = query(collection(db, "sessions"), where("creator", "==", _userID), orderBy("created"));

    onSnapshot(q, (_querySnapshot) => _action(_querySnapshot));
}