import { doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";


export const fetchSessionSnapshot = (_sessionID, _action) => {
    const sessionDoc = doc(db, "sessions", _sessionID);
    const q = query(sessionDoc);

    onSnapshot(q, (_querySnapshot) => _action(_querySnapshot));
}