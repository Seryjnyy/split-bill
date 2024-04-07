import {
  Button,
  Typography,
  TextField,
  Container,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinSession() {
  const [session, setSession] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [joinAttempted, setJoinAttempted] = useState(false);

  let navigate = useNavigate();

  const validateSession = (_session) => {
    if (_session.length === 0) {
      setSessionError("Need a session code boss.");
      return false;
    }

    if (_session.length > 20) {
      setSessionError("Session code max 10 length.");
      return false;
    }

    setSession(_session);
    setSessionError("");
    return true;
  };

  const joinSession = () => {
    if (!validateSession(session)) return;

    // setJoinAttempted(true);

    fetchSessionWithKeyCode(session)
      .then((result) => {
        if (result.empty) console.log("key code invalid");

        if (result.size > 1)
          console.log(
            "internal error, keycode maps to multiple sessions, sorry :/"
          );

        navigate("/session/" + result.docs[0].id);
        console.log(result);
      })
      .catch((err) => alert(err));

    // fetch doc here
    // pass into
    // navigate("/session/" + session);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          error={sessionError != ""}
          id="outlined-error-helper-text"
          label="Join Code"
          helperText={sessionError != "" ? sessionError : ""}
          onChange={(e) => {
            validateSession(e.target.value);
          }}
        />
        <Button onClick={() => joinSession()} disabled={joinAttempted}>
          Join Session
        </Button>
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
