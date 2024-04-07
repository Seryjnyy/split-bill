import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Modal,
  Box,
  Tab,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Avatar, { genConfig } from "react-nice-avatar";
import { useAuth } from "../UserAuthContext";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { Divider } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import QRCode from "react-qr-code";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { fetchSessionItemsSnapshot } from "../services/fetchSessionItemsSnapshot";
import { fetchSessionSnapshot } from "../services/fetchSessionSnapshot";
import { addSessionItem } from "../services/addSessionItem";
import { addUserToSession } from "../services/addUserToSession";
import { removeSessionItem } from "../services/removeSessionItem";
import ShareIcon from "@mui/icons-material/Share";
import Grid from "@mui/material/Unstable_Grid2";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LabelSelect from "./LabelSelect";
import AddPerson from "./AddPerson";
import { motion } from "framer-motion";
import CreateItem from "./CreateItem";
import CreateCharge from "./CreateCharge";
import CreateDiscount from "./CreateDiscount";

const CreateNew = ({ users, onCreateNew }) => {
  const { id } = useParams();

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label="item" value="1" />
          <Tab label="charge" value="2" />
          <Tab label="person" value="3" />
          <Tab label="discount" value="4" />
        </TabList>
        <TabPanel value="1">
          <CreateItem onSuccess={() => onCreateNew(false)} />
        </TabPanel>
        <TabPanel value="2">
          <CreateCharge users={users} onSuccess={() => onCreateNew(false)} />
        </TabPanel>
        <TabPanel value="3">
          <AddPerson sessionID={id} onSuccess={() => onCreateNew(false)} />
        </TabPanel>
        <TabPanel value="4">
          <CreateDiscount onSuccess={() => onCreateNew(false)} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default function SessionPage() {
  const [users, setUsers] = useState({ creator: "", users: [] });
  const [usersItems, setUsersItems] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();

  // Selected user to inspect

  const [userToInspect, setUserToInspect] = useState("");

  // Modal

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (_source) => {
    // if (source == "FAB") {
    //   setModalContent("FAB")
    // } else if (source == "QR") {
    //   setModalContent("QR")
    // }
    setModalContent(_source);

    setOpenModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(users.joinCode);
  };

  const sessionItemsSnapshotListener = (_sessionID) => {
    fetchSessionItemsSnapshot(_sessionID, (_querySnapshot) => {
      setUsersItems(
        _querySnapshot.docs.map((_doc) => ({ id: _doc.id, ..._doc.data() }))
      );
    });
  };
  const sessionSnapshotListener = (_sessionID) => {
    fetchSessionSnapshot(_sessionID, (_querySnapshot) => {
      // TODO : need changing the name users to session, since its more than just the users at this point
      setUsers({
        creator: _querySnapshot.data().creator,
        users: _querySnapshot.data().users.map((_user) => {
          return { ..._user };
        }),
        joinCode: _querySnapshot.data().joinCode,
      });
    });
  };

  useEffect(() => {
    console.log(users);
    if (users.users.length > 0) {
      let partOf = false;
      users?.users?.forEach((_user) => {
        if (_user.id == user.id) partOf = true;
      });

      if (!partOf) {
        addUserToSession(id, user.id, user.username, user.avatarSeed).catch(
          (e) => alert(e)
        );
      }
    }
  }, [users]);

  useEffect(() => {
    sessionItemsSnapshotListener(id);
    sessionSnapshotListener(id);
  }, []);

  const handleInspectUser = (_userID) => {
    setUserToInspect(_userID);
    handleOpenModal("USER");
  };

  //#region get stuff

  const getItemCount = () => {
    var itemCountTemp = 0;

    usersItems.forEach((_item) => {
      itemCountTemp += _item.quantity;
    });

    return itemCountTemp;
  };

  const getPeopleCount = () => {
    return users.users.length;
  };
  const getTotalPrice = () => {
    var totalCostTemp = 0;

    usersItems.forEach((_item) => {
      totalCostTemp += _item.price * _item.quantity;
    });

    return totalCostTemp;
  };

  const getUserItemCount = (_userID) => {
    var totalItemCount = 0;

    usersItems.forEach((_item) => {
      if (_item.userID == _userID) totalItemCount += _item.quantity;
    });

    return totalItemCount;
  };

  const getUserTotalPrice = (_userID) => {
    var totalPriceTemp = 0;

    usersItems.forEach((_item) => {
      if (_item.userID == _userID)
        totalPriceTemp += _item.price * _item.quantity;
    });

    return totalPriceTemp;
  };

  // #endregion

  const removeItem = (_itemID) => {
    // TODO : could have check to ensure item belongs to the user
    removeSessionItem(_itemID);
  };

  const getModalContent = () => {
    switch (modalContent) {
      case "FAB":
        return (
          <CreateNew users={users} onCreateNew={() => setOpenModal(false)} />
        );
      case "QR":
        return (
          <Box
            sx={{
              display: "flex",
              justifContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              pl: 6,
            }}
          >
            <Paper
              variant="outlined"
              sx={{ borderColor: "divider", borderRadius: 3, p: 2 }}
            >
              <QRCode value={window.location.href} />
            </Paper>
          </Box>
        );
      case "SHARE":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 8,
              }}
            >
              Copy link
              <Button onClick={handleCopyLink}>
                <ContentCopyIcon />
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 6,
              }}
            >
              {users.joinCode}
              <Button onClick={handleCopyJoinCode}>
                <ContentCopyIcon />
              </Button>
            </Box>
          </Box>
        );
      case "USER":
        var userInspect = users.users.find(
          (_user) => _user.id == userToInspect
        );
        // var creatorOfUser = [];
        // if (userInspect?.creator != "") {
        //   creatorOfUser = users.users.find(
        //     (_user) => _user.id == userInspect.creator
        //   );
        // }

        console.log(userInspect);
        // console.log(creatorOfUser);
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <Avatar
                  style={{ width: "3rem", height: "3rem" }}
                  {...genConfig(userInspect.avatarSeed)}
                />
                <Typography>
                  {userInspect.name}
                  {userInspect.id == user.id ? " (YOU)" : ""}
                </Typography>
              </Box>
              {userInspect.creator != "" ? (
                <Box>
                  Added manually by
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* <Avatar
                      style={{ width: "2rem", height: "2rem" }}
                      {...genConfig(creatorOfUser.avatarSeed)}
                    />
                    <Typography sx={{ ml: 1 }}>{creatorOfUser.name}</Typography> */}
                  </Box>
                  <Typography>
                    on{" "}
                    {/* {new Date(
                      userInspect.joined.seconds * 1000
                    ).toLocaleString()} */}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  Joined on{" "}
                  {/* {new Date(userInspect.joined.seconds * 1000).toLocaleString()} */}
                </Box>
              )}

              {userInspect.id == users.creator ? (
                <Box>
                  <Typography>The creator of this session.</Typography>
                </Box>
              ) : (
                ""
              )}

              {userInspect?.creator == user.id ? (
                <Button>Remove</Button>
              ) : (
                "can't"
              )}
            </Paper>
          </Box>
        );
    }
  };

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.15,
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        pb: 15,
      }}
    >
      {/* <div>SessionPage {id}</div> */}

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography sx={{ fontSize: 40, mt: 8 }}>
          {getTotalPrice().toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
            minimumFractionDigits: 2,
          })}
        </Typography>
        <Typography sx={{ fontSize: 12 }} align="center">
          {getPeopleCount()} people | {getItemCount()} items
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 11 }}>-20% Drink Student</Typography>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          width: 350,
          pt: 1,
          pb: 1,
          mt: 3,
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={4}></Grid>
          <Grid xs={4}>
            <Button onClick={() => handleOpenModal("QR")}>
              <QrCodeIcon />
              QR Code
            </Button>
          </Grid>
          <Grid xs={4}>
            <Button onClick={() => handleOpenModal("SHARE")} sx={{ ml: 5 }}>
              <ShareIcon />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {users
        ? users?.users?.map((_user) => (
            <Box key={_user.id}>
              <Paper
                variant="outlined"
                sx={{
                  width: 350,
                  pt: 1,
                  pb: 1,
                  mt: 3,
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: "xs",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <Box
                      onClick={() => handleInspectUser(_user.id)}
                      component={motion.div}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Avatar
                        style={{ width: "3rem", height: "3rem" }}
                        {...genConfig(_user.avatarSeed)}
                      />
                    </Box>
                    <Typography sx={{ textTransform: "uppercase", ml: 2 }}>
                      {_user.name}{" "}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ mr: 2 }}>
                      {getUserTotalPrice(_user.id).toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography sx={{ fontSize: 10 }}>
                      {getUserItemCount(_user.id)} items
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mt: 1, mb: 1 }} />

                <Box>
                  {usersItems.map((_item, _index) => {
                    if (_item.userID == _user.id) {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          key={_user.id + _index}
                        >
                          <Box sx={{ ml: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography sx={{ fontSize: 20, mr: 0.5 }}>
                                {_item.name}
                              </Typography>
                              {_item.tags.map((tag, _indexTag) => {
                                return (
                                  <Typography
                                    sx={{ fontSize: 9, mt: 0.2 }}
                                    key={_indexTag}
                                  >
                                    ({tag})
                                  </Typography>
                                );
                              })}
                            </Box>
                            <Box sx={{ display: "flex" }}>
                              <Typography sx={{ fontSize: 10 }}>
                                x {_item.quantity}
                              </Typography>
                              <Typography sx={{ fontSize: 10, ml: 2 }}>
                                {_item.price.toLocaleString("en-GB", {
                                  style: "currency",
                                  currency: "GBP",
                                  minimumFractionDigits: 2,
                                })}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              mr: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {/* {_user.id == user.id ?  : ""} */}
                            <Button onClick={() => removeItem(_item.id)}>
                              <ClearIcon />
                            </Button>
                          </Box>
                        </Box>
                      );
                    }
                  })}
                </Box>
              </Paper>
            </Box>
          ))
        : ""}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => handleOpenModal("FAB")}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Paper
            sx={{ height: 450, width: { xs: "98vw", md: 400 } }}
            component={motion.div}
            variants={dropIn}
            initial="hidden"
            animate="visible"
          >
            {getModalContent()}
          </Paper>
        </Box>
      </Modal>
    </Container>
  );
}
