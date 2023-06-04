import { useEffect, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from './UserAuthContext'
import { Button, Typography, TextField, Container, Box, Paper, Divider } from '@mui/material';
import uuid from 'react-uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import SessionTable from './SessionTable';
import Hashids from 'hashids';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {addSession} from "./services/addSession"


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
        // setCreationAttempted(true);
        

        const collectionRef = collection(db, 'sessions');
        const q = query(collectionRef, where("creator", "==", user.id));
        getDocs(q).then(result => {
            const hashids = new Hashids(user.id, 8);
            let joinCode = hashids.encode(result.size);

            addSession(user.id, user.username, user.avatarSeed, joinCode)
            .then((docRef) => {
                // console.log(docRef.id);
                navigate("/session/" + docRef.id);
                // route to the page
            }).catch((error) => {
                alert("ERROR" + error)
                setCreationAttempted(false);
            });
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
            <Box sx={{marginRight:"auto", ml:3}}><Typography sx={{fontSize:20}}>Welcome,</Typography></Box>
            <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 1, borderColor: 'divider', borderRadius: 3 , display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <Box sx={{ml:2}}><Avatar style={{ width: '5rem', height: '5rem' }} {...genConfig(avatarSeed)} /></Box>
                <Typography sx={{ textTransform: 'uppercase', mr: 5, fontSize:18, fontWeight:500 }}>{name}</Typography>
            </Paper>

            {!user ?
             <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                <Box sx={{mt: 0}}>
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

                    <Box sx={{ display: "flex", mt: 2, justifyContent: "center"}} >
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

                :
                <>
                     <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        <Box >
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
                        <Divider sx={{mt:2}}/>
                        </Box>
                        

                        <Box sx={{mt:2}}>
                        
                        <Button onClick={() => {createSession()}} disabled={creationAttempted}>
                          Create Session
                        </Button>

                        </Box>
                    </Paper>
                </>
            }
            {user ?  
                <>
                                <Box sx={{marginRight:"auto", ml:3, mt:8}}><Typography sx={{fontSize:20}}>Created sessions,</Typography></Box>
                <Box sx={{mt:1, mb:5}}><SessionTable ></SessionTable></Box>
                </>
            : ""}
            <Box sx={{marginRight:"auto", ml:3, mt:8}}><Typography sx={{fontSize:20}}>About,</Typography></Box>
            <Box sx={{mt:1, mb:10}}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui tempora consequuntur non illum odit dolor molestias consequatur eligendi, aliquam eius, repudiandae fuga laudantium sunt omnis cum mollitia similique. Debitis, soluta?
            </Box>
            <Box>
                <Divider/>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                    <Box sx={{marginRight:"auto"}}><Typography>c 2023 Jakub</Typography></Box>
                    <Box sx={{ml:12}}><Typography>Buy me a coffee</Typography></Box>
                </Box>
            </Box>
        </Container>
    )
}
