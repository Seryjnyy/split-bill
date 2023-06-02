import { useEffect, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from './UserAuthContext'
import { Button, Typography, TextField, Container, Box, Paper, Divider } from '@mui/material';
import uuid from 'react-uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { addSession } from './services/addSession';
import SessionTable from './SessionTable';
import { fetchSessionSnapshot } from './services/fetchSessionSnapshot';
import { fetchSessionsSnapshot } from './services/fetchSessionsSnapshot';


export default function LandingPage() {
    const [avatarSeed, setAvatarSeed] = useState("hello");
    const [name, setName] = useState("");
    const { user, register } = useAuth();
    const [nameError, setNameError] = useState("");

    const [session, setSession] = useState("");
    const [sessionError, setSessionError] = useState("");

    const [creationAttempted, setCreationAttempted] = useState(false);
    const [joinAttempted, setJoinAttempted] = useState(false);

    const [sessions, setSessions] = useState(null);

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

        addSession(user.id, user.username, user.avatarSeed)
        .then((docRef) => {
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
        <Container maxWidth="xs" sx={{mt:2, display:"flex", flexDirection:"column", alignItems:"center"}}>
            {/* <div>LandingPage</div> */}

            <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3 , display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <Box sx={{ml:2}}><Avatar style={{ width: '5rem', height: '5rem' }} {...genConfig(avatarSeed)} /></Box>
                <Typography sx={{ textTransform: 'uppercase', mr: 5, fontSize:18, fontWeight:500 }}>{name}</Typography>
            </Paper>

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
                     <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3 }}>
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
                    </Paper>
                </>
            }
            <SessionTable ></SessionTable>
            <Box sx={{mt:5, mb:5}}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui tempora consequuntur non illum odit dolor molestias consequatur eligendi, aliquam eius, repudiandae fuga laudantium sunt omnis cum mollitia similique. Debitis, soluta?
            </Box>
            <Box>
                <Divider/>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                    <Box><Typography>c 2023 Jakub</Typography></Box>
                    <Box><Typography>Buy me a coffee</Typography></Box>
                </Box>
            </Box>
        </Container>
    )
}
