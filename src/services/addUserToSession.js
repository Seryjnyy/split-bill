import {setDoc, doc, arrayUnion} from "firebase/firestore";
import { db } from "../../firebase";

export const addUserToSession = async (_sessionID, _userID, _username, _avatarSeed) => {
    const sessionRef = doc(db, "sessions", _sessionID);

    return await setDoc(sessionRef, {
      users: arrayUnion({ id: _userID, name: _username, avatarSeed: _avatarSeed, items: [] })
    }, { merge: true });
}