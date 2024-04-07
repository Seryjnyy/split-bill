import { Box, Button } from "@mui/material";
import { useAuth } from "../UserAuthContext";

import { collection, getDocs, query, where } from "firebase/firestore";
import Hashids from "hashids";
import { db } from "../../firebase";
import { addSession } from "../services/addSession";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSession() {
  const { user } = useAuth();
  const [creationAttempted, setCreationAttempted] = useState(false);
  const navigate = useNavigate();
  const createSession = () => {
    // setCreationAttempted(true);

    const collectionRef = collection(db, "sessions");
    const q = query(collectionRef, where("creator", "==", user.id));
    getDocs(q).then((result) => {
      const hashids = new Hashids(user.id, 8);
      let joinCode = hashids.encode(result.size);

      addSession(user.id, user.username, user.avatarSeed, joinCode)
        .then((docRef) => {
          // console.log(docRef.id);
          navigate("/session/" + docRef.id);
          // route to the page
        })
        .catch((error) => {
          alert("ERROR" + error);
          setCreationAttempted(false);
        });
    });
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => {
          createSession();
        }}
        disabled={creationAttempted}
      >
        Create Session
      </Button>
    </Box>
  );
}
