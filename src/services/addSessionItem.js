import {addDoc, collection, Timestamp} from "firebase/firestore";
import { db } from "../../firebase";

export const addSessionItem = async (_userID, _sessionID, _name, _quantity, _price) => {
    return await addDoc(collection(db, "items"), {
        userID: _userID,
        sessionID: _sessionID,
        name: _name,
        quantity: Number(_quantity),
        price: Number(_price),
        created: Timestamp.now()
    });
}