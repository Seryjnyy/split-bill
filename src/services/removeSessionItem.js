import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export const removeSessionItem = async (_itemID) => {
    const itemRef = doc(db, "items", _itemID);

    deleteDoc(itemRef);
}