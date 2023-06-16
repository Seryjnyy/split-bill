import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Avatar, { genConfig } from 'react-nice-avatar'
import uuid from 'react-uuid';
import { addUserToSession } from "./services/addUserToSession";

export default function AddPerson({sessionID, onSuccess}) {
    const [avatarSeed, setAvatarSeed] = useState(sessionID);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    // TODO : duplicate validation function for person name
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
    }

    const validateAndSave = () => {
        if (!validateName(name))
            return;

        addUserToSession(sessionID, uuid(), name, avatarSeed).catch(e => alert(e));

        onSuccess();
    }

    // TODO : duplicate function for randomAvatar, with landing page
    const randomAvatar = () => {
        setAvatarSeed(uuid());
    }

    return (
        <Box>
            <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 1, borderColor: 'divider', borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ ml: 2 }}><Avatar style={{ width: '5rem', height: '5rem' }} {...genConfig(avatarSeed)} /></Box>
                <Typography sx={{ textTransform: 'uppercase', mr: 5, fontSize: 18, fontWeight: 500 }}>{name}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ mt: 0 }}>
                    <Box sx={{ display: "flex", mt: 1, justifyContent: "center", alignItems: "center" }}>



                        <TextField
                            error={nameError != ""}
                            id="outlined-error-helper-text"
                            label="Name"

                            helperText={nameError != "" ? nameError : ""}
                            onChange={(e) => {
                                validateName(e.target.value);
                            }}
                        />

                    </Box >

                    <Box sx={{ display: "flex", mt: 2, justifyContent: "center" }} >
                        <Button onClick={randomAvatar}>
                            Random avatar
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", mt: 3, justifyContent: "center", alignItems: "center" }}>
                        <Button onClick={() => { validateAndSave() }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}
