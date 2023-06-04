import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from "../../firebase";

export const addSession = async (_userID, _username, _avatarSeed, _joinCode) => {
    return await addDoc(collection(db, "sessions"), {
        creator: _userID,
        users: [{id: _userID, name: _username, avatarSeed: _avatarSeed, items:[]}],
        created: Timestamp.now(),
        joinCode: _joinCode
    });
}