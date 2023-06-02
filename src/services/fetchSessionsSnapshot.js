import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchSessionsSnapshot = (_userID, _action) => {
    const q = query(collection(db, "sessions"), where("creator", "==", _userID));

    onSnapshot(q, (_querySnapshot) => _action(_querySnapshot));
}