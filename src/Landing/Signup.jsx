import {
  Button,
  Typography,
  TextField,
  Container,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import uuid from "react-uuid";
import React from "react";
import { useState } from "react";
import { useAuth } from "../UserAuthContext";
import Avatar, { genConfig } from "react-nice-avatar";

export default function Signup() {
  const [avatarSeed, setAvatarSeed] = useState(`${new Date()}`);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const { register } = useAuth();

  const validateName = (_name) => {
    if (_name.length === 0) {
      setNameError("Need a name boss.");
      setName("");
      return false;
    }

    if (_name.length > 20) {
      setNameError("No need to be extra.");
      return false;
    }

    setName(_name);
    setNameError("");
    return true;
  };

  const validateAndSave = () => {
    if (!validateName(name)) return;

    register(uuid(), name, avatarSeed);
  };

  const randomAvatar = () => {
    setAvatarSeed(uuid());
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          width: 350,
          pt: 1,
          pb: 1,
          mt: 3,
          borderColor: "divider",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ mt: 0 }}>
          <Box
            sx={{
              display: "flex",
              mt: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              error={nameError != ""}
              id="outlined-error-helper-text"
              label="Name"
              helperText={nameError != "" ? nameError : ""}
              onChange={(e) => {
                validateName(e.target.value);
              }}
            />
          </Box>

          <Box sx={{ display: "flex", mt: 2, justifyContent: "center" }}>
            <Button onClick={randomAvatar}>Random avatar</Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              mt: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                validateAndSave();
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
