import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchSessionItemsSnapshot = (_sessionID, _action) => {
    const q = query(collection(db, "items"), where("sessionID", "==", _sessionID), orderBy("created"));

    onSnapshot(q, (_querySnapshot) => _action(_querySnapshot))
}