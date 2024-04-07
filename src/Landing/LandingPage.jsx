import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Signup from "./Signup";
import CreateSession from "./CreateSession";
import JoinSession from "./JoinSession";
import Sessions from "./Sessions";
import Footer from "../Footer";
import { useAuth } from "../UserAuthContext";
import AvatarAndName from "./AvatarAndName";

const CreateJoinSession = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: 350,
        py: 3,
        mt: 3,
        borderColor: "divider",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <JoinSession />

      <CreateSession />
    </Paper>
  );
};

const About = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: 350,
        borderColor: "divider",
        borderRadius: 3,
        py: 3,
        px: 3,
      }}
    >
      <Box sx={{}}>
        <Typography variant="h4" component={"h2"}>
          About
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          pt: 3,
          pl: 1,
          opacity: "80%",
        }}
      >
        <Typography variant="body1">
          This is a simple web app for keeping track of what everyone in the
          group ordered.
        </Typography>
        <Typography>
          So, when the bill arrives, you'll know exactly what each person owes,
          including the pesky extra fees, making sure everyone chips in fair and
          square.
        </Typography>
      </Box>
    </Paper>
  );
};

export default function LandingPage() {
  const { user } = useAuth();

  let navigate = useNavigate();
  let location = useLocation();

  const redirectPath = location.state?.path || "/";

  useEffect(() => {
    // Work around for when page is refreshed and user is lost.
    // The user is sent here before we have chance to load in user again.
    // Therefore, if user not null and we got redirecetd from somwhere, then get back there son.
    if (user != null && redirectPath != "/") {
      navigate(redirectPath);
    }

    // if (user != null) {
    //   setAvatarSeed(user.avatarSeed);
    //   setName(user.username);
    // }
  }, [user]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <div>LandingPage</div> */}
      <Box sx={{ marginRight: "auto", ml: 3 }}>
        <Typography sx={{ fontSize: 32 }} variant="h1" component="h1">
          Welcome
        </Typography>
      </Box>

      {!user ? (
        <Signup />
      ) : (
        <>
          <AvatarAndName name={user.username} avatarSeed={user.avatarSeed} />
          <CreateJoinSession />
        </>
      )}
      {/* {user ?? <Sessions />} */}
      <Box sx={{ pt: 12 }}>
        <About />
      </Box>
      <Footer />
    </Container>
  );
}
