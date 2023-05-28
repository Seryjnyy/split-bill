import { useEffect, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from './UserAuthContext'
import { Button, Typography, TextField, Container } from '@mui/material';
import Box from '@mui/material/Box';
import uuid from 'react-uuid';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const [avatarSeed, setAvatarSeed] = useState("hello");
    const [name, setName] = useState("");
    const { user, register } = useAuth();
    const [nameError, setNameError] = useState("");

    const [session, setSession] = useState("");
    const [sessionError, setSessionError] = useState("");

    const [creationAttempted, setCreationAttempted] = useState(false);
    const [joinAttempted, setJoinAttempted] = useState(false);

    let navigate = useNavigate();
    let location = useLocation();
  
    const redirectPath = location.state?.path || '/';

    useEffect(() => {

        // Work around for when page is refreshed and user is lost.
        // The user is sent here before we have chance to load in user again.
        // Therefore, if user not null and we got redirecetd from somwhere, then get back there son.
        if(user != null && redirectPath != '/'){
            navigate(redirectPath);
        }

        if (user != null) {
            setAvatarSeed(user.avatarSeed);
            console.log(user.username)
            setName(user.username);
        }
    }, [user])



    useEffect(() => {
        // config = genConfig(avatarSeed);

        console.log("avatar seed cahgne")
    }, [avatarSeed])

    const randomAvatar = () => {
        console.log("random")
        setAvatarSeed(uuid());
    }

    const validateName = (_name) => {
        if (_name.length === 0) {
            setNameError("Need a name boss.");
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
    }

    const createSession = () => {
        setCreationAttempted(true);
        addDoc(collection(db, "sessions"), {
            creator: user.id,
            users: [{id: user.id, name: user.username, avatarSeed: user.avatarSeed, items:[]}]
        }).then((docRef) => {
            // console.log(docRef.id);
            navigate("/session/" + docRef.id);
            // route to the page
        }).catch((error) => {
            alert("ERROR" + error)
            setCreationAttempted(false);
        });
    }

    const joinSession = () => {
        if(!validateSession(session))
            return;

        setJoinAttempted(true);

        // fetch doc here
        // pass into
        navigate("/session/" + session);
    }

    const validateAndSave = () => {
        if (!validateName(name))
            return;

        register(uuid(), name, avatarSeed);
    }

    return (
        <Container maxWidth="xs" sx={{mt:5}}>
            {/* <div>LandingPage</div> */}

            <Box sx={{ display: "flex", maxWidth: "xs", justifyContent: "space-between", alignItems: "center" }}>
                <Avatar style={{ width: '8rem', height: '8rem' }} {...genConfig(avatarSeed)} />
                <Typography sx={{ textTransform: 'uppercase', mr: 5 }}>{name}</Typography>
            </Box>

            {!user ?
                <Box sx={{mt: 5}}>
                    <Typography>First, create a user.</Typography>
                    <Box sx={{ display: "flex", mt: 1, justifyContent: "space-between", alignItems: "center" }}>
                        <Button onClick={randomAvatar}>
                            Random avatar
                        </Button>


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

                    <Box sx={{ display: "flex", mt: 5, justifyContent: "center", alignItems: "center" }}>
                        <Button onClick={() => { validateAndSave() }}>
                            Save
                        </Button>
                    </Box>
                </Box>


                :
                <>
                    <Box sx={{backgroundColor:"red", mt:5}}>
                        <Button onClick={() => {createSession()}} disabled={creationAttempted}>
                          Create Session
                        </Button>
                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                        <TextField
                                error={sessionError != ""}
                                id="outlined-error-helper-text"
                                label="Session"
                                helperText={sessionError != "" ? sessionError : ""}
                                onChange={(e) => {
                                    validateSession(e.target.value);
                                }}
                            />
                        <Button onClick={() => joinSession()} disabled={joinAttempted}>
                          Join Session
                        </Button>
                        </Box>
                    </Box>
                </>
            }
        </Container>
    )
}
