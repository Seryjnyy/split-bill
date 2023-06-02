import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import { Typography, TextField, InputAdornment, Button, Card, Paper, Modal, Box, Tab, Switch, FormControlLabel, FormGroup } from "@mui/material";
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from "./UserAuthContext";
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Square } from "@mui/icons-material";
import { Divider } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import QRCode from "react-qr-code";
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { fetchSessionItemsSnapshot } from "./services/fetchSessionItemsSnapshot";
import { fetchSessionSnapshot } from "./services/fetchSessionSnapshot";
import { addSessionItem } from "./services/addSessionItem";
import { addUserToSession } from "./services/addUserToSession";
import { removeSessionItem } from "./services/removeSessionItem";

export default function SessionPage() {
  const [users, setUsers] = useState({ creator: "", users: [] });
  const [usersItems, setUsersItems] = useState([])
  const { id } = useParams();
  const { user } = useAuth();

  // Item
  const [itemName, setItemName] = useState("");
  const [itemNameError, setItemNameError] = useState("");

  const [itemPrice, setItemPrice] = useState(0);
  const [itemPriceError, setItemPriceError] = useState("");

  const [itemAmount, setItemAmount] = useState(1);
  const [itemAmountError, setItemAmountError] = useState("");

  // Charge
  const [chargeName, setChargeName] = useState("");
  const [chargeNameError, setChargeNameError] = useState("");

  const [chargePrice, setChargePrice] = useState(0);
  const [chargePriceError, setChargePriceError] = useState("");

  // Modal

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (source) => {
    if (source == "FAB") {
      setModalContent("FAB")
    } else if (source == "QR") {
      setModalContent("QR")
    }

    setOpenModal(true)
  };


  const sessionItemsSnapshotListener = (_sessionID) => {
    fetchSessionItemsSnapshot(_sessionID, (_querySnapshot) => { setUsersItems(_querySnapshot.docs.map(_doc => ({ id: _doc.id, ..._doc.data() }))); });
  }
  const sessionSnapshotListener = (_sessionID) => {
    fetchSessionSnapshot(_sessionID, (_querySnapshot) => {

      setUsers({
        creator: _querySnapshot.data().creator, users: _querySnapshot.data().users.map(_user => {
          // calculate item count, total price
          var userItemCountTemp = 0
          var userTotalPriceTemp = 0

          usersItems.forEach(_item => {
            if (_item.userID == _user.id) {
              userItemCountTemp = _item.quantity;
              userTotalPriceTemp = _item.price * _item.quantity;
            }
          })

          return { ..._user, additional: { itemCount: userItemCountTemp, totalPrice: userTotalPriceTemp } }
        })
      });

    })
  }

  useEffect(() => {

    console.log(users)
    if (users.users.length > 0) {

      let partOf = false;
      users?.users?.forEach(_user => {
        if (_user.id == user.id)
          partOf = true;
      })

      if (!partOf) {
        addUserToSession(id, user.id, user.username, user.avatarSeed).catch(e => alert(e));
      }
    }

  }, [users])


  useEffect(() => {
    sessionItemsSnapshotListener(id);
    sessionSnapshotListener(id);
  }, []);

  // Item

  const validateItemName = (_itemName) => {
    if (_itemName.length <= 0) {
      setItemNameError("Need a name.");
      setItemName("");
      return false;
    }

    if (_itemName.length > 20) {
      setItemNameError("Too long.");
      return false;
    }

    setItemNameError("");
    setItemName(_itemName);
    return true;
  }

  const validateItemPrice = (_itemPrice) => {
    if (_itemPrice < 0) {
      setItemPriceError("Can't be less than 0.");
      return false;
    }

    setItemPriceError("");
    setItemPrice(_itemPrice);
    return true;
  }

  const validateItemAmount = (_itemAmount) => {
    if (_itemAmount < 1) {
      setItemAmountError("Can't be 0 or less.");
      setItemAmount(_itemAmount);
      return false;
    }

    setItemAmountError("");
    setItemAmount(_itemAmount);
    return true;
  }

  const validateItemAndSave = () => {
    if (!validateItemName(itemName))
      return;

    if (!validateItemPrice(itemPrice))
      return;

    if (!validateItemAmount(itemAmount))
      return;


    addSessionItem(user.id, id, itemName, itemAmount, itemPrice).catch(e => alert(e));

    setItemAmount(1);
    setItemName("");
    setItemPrice(0);

    setOpenModal(false);
  }

  // Charge

  const validateChargeName = (_chargeName) => {
    if (_chargeName.length <= 0) {
      setChargeNameError("Need a name.");
      setChargeName("");
      return false;
    }

    if (_chargeName.length > 20) {
      setChargeNameError("Too long.");
      return false;
    }

    setChargeNameError("");
    setChargeName(_chargeName);
    return true;
  }

  const validateChargePrice = (_chargePrice) => {
    if (_chargePrice < 0) {
      setChargePriceError("Can't be less than 0.");
      return false;
    }

    setChargePriceError("");
    setChargePrice(_chargePrice);
    return true;
  }

  const validateChargeAndSave = () => {
    if(!validateChargeName(chargeName))
      return;

    if(!validateChargePrice(chargePrice))
      return;


      // if split between calculate new price of charge
      var newPrice = forEveryone ? chargePrice / users.users.length : chargePrice;

      users.users.forEach(_user => {
        if ((_user.id == user.id) || forEveryone) {
          addSessionItem(_user.id, id, chargeName, 1, newPrice).catch(e => alert(e));
        }

      })
  

    setChargeName("");
    setChargePrice(0);

    setOpenModal(false);
  }



  const getItemCount = () => {
    var itemCountTemp = 0;


    usersItems.forEach(_item => {
      itemCountTemp += _item.quantity
    })

    return itemCountTemp;
  }

  const getPeopleCount = () => {
    return users.users.length;
  }
  const getTotalPrice = () => {
    var totalCostTemp = 0;

    usersItems.forEach(_item => {
      totalCostTemp += _item.price * _item.quantity;
    });

    return totalCostTemp;
  }

  const getUserItemCount = (_userID) => {
    var totalItemCount = 0;

    usersItems.forEach(_item => {
      if (_item.userID == _userID)
        totalItemCount += _item.quantity;
    });

    return totalItemCount;
  }

  const getUserTotalPrice = (_userID) => {
    var totalPriceTemp = 0;

    usersItems.forEach(_item => {
      if (_item.userID == _userID)
        totalPriceTemp += _item.price * _item.quantity;
    });

    return totalPriceTemp;
  }

  const removeItem = (_itemID) => {
    // TODO : could have check to ensure item belongs to the user
    removeSessionItem(_itemID);
  }

  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [forEveryone, setForEveryone] = useState(false);


  const modalFABContent = () => {
    return <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label="Add item" value='1' />
          <Tab label="Add charge" value='2' />
        </TabList>
        <TabPanel value='1'>
          <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            {/* <Typography sx={{ fontSize: 20, mt: 1, mb: 3 }}>Add item</Typography> */}
            <TextField
              sx={{ width: 200 }}
              error={itemNameError != ""}
              id="outlined-error-helper-text"
              label="Name"
              value={itemName}
              helperText={itemNameError != "" ? itemNameError : ""}
              onChange={(e) => {
                validateItemName(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              sx={{ mt: 3, width: 200 }}
              error={itemPriceError != ""}
              id="outlined-error-helper-text"
              label="Price"
              type="number"
              value={itemPrice}
              helperText={itemPriceError != "" ? itemPriceError : ""}
              onChange={(e) => {
                validateItemPrice(e.target.value);
              }}
              InputProps={{
                // TODO : would need adapting to currency being used
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
            />

            <TextField
              sx={{ mt: 3, width: 200 }}
              error={itemAmountError != ""}
              id="outlined-error-helper-text"
              label="Amount"
              type="number"
              value={itemAmount}
              helperText={itemAmountError != "" ? itemAmountError : ""}
              onChange={(e) => {
                validateItemAmount(e.target.value);
              }}
            />

            <Button onClick={() => validateItemAndSave()} sx={{ mt: 1 }}>
              Add
            </Button>

          </Box>

        </TabPanel>
        <TabPanel value='2'>
          <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <TextField
              sx={{ width: 200 }}
              error={chargeNameError != ""}
              id="outlined-error-helper-text"
              label="Name"
              value={chargeName}
              helperText={chargeNameError != "" ? chargeNameError : ""}
              onChange={(e) => {
                validateChargeName(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              sx={{ mt: 3, mb:3 ,width: 200 }}
              error={chargePriceError != ""}
              id="outlined-error-helper-text"
              label="Price"
              type="number"
              value={chargePrice}
              helperText={chargePriceError != "" ? chargePriceError : ""}
              onChange={(e) => {
                validateChargePrice(e.target.value);
              }}
              InputProps={{
                // TODO : would need adapting to currency being used
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
            />

            <FormGroup>
              <FormControlLabel control={<Switch checked={forEveryone} onClick={() => setForEveryone(!forEveryone)}/>} label="Split between everyone" />
            </FormGroup>

            <Button onClick={() => validateChargeAndSave()} sx={{ mt: 1 }}>
              Add
            </Button>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  }

  const getModalContent = () => {
    switch (modalContent) {
      case "FAB":
        return modalFABContent();
      case "QR":
        return (<Box sx={{ display: "flex", justifContent: "center", alignItems: "center", width: "100%", height: "100%", pl: 6, }}>
          <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: 3, p: 2 }}>
            <QRCode value={window.location.href} />
          </Paper>
        </Box>)

    }

  }

  return (
    <Container maxWidth="xs" sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      {/* <div>SessionPage {id}</div> */}


      <Box>
        <Typography sx={{ fontSize: 40, mt: 8 }}>{getTotalPrice().toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 })}</Typography>
        <Typography sx={{ fontSize: 12 }} align="center">{getPeopleCount()} people | {getItemCount()} items</Typography>
      </Box>

      <Paper variant="outlined" sx={{ width: 350, display: "flex", justifyContent: "center", pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3 }}>

        <Button onClick={() => handleOpenModal("QR")}>
          <QrCodeIcon />
          QR Code
        </Button>
      </Paper>

      {users ? users?.users?.map(_user => (
        <Box key={_user.id}>
          <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: 'divider', borderRadius: 3 }}>
            <Box sx={{ display: "flex", maxWidth: "xs", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar style={{ width: '3rem', height: '3rem' }} {...genConfig(_user.avatarSeed)} />
                <Typography sx={{ textTransform: 'uppercase', ml: 2 }}>{_user.name} </Typography>

              </Box>



              <Box>
                <Typography sx={{ mr: 2 }}>{getUserTotalPrice(_user.id).toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 })}</Typography>
                <Typography sx={{ fontSize: 10 }}>{getUserItemCount(_user.id)} items</Typography>
              </Box>
            </Box>

            <Divider sx={{ mt: 1, mb: 1 }} />

            <Box>
              {
                usersItems.map((_item, _index) => {
                  if (_item.userID == _user.id) {

                    return <Box sx={{ display: "flex", justifyContent: "space-between" }} key={_user.id + _index}>
                      <Box sx={{ ml: 3 }}>
                        <Typography sx={{ fontSize: 20 }}>{_item.name}</Typography>
                        <Box sx={{ display: "flex" }}>
                          <Typography sx={{ fontSize: 10 }}>x {_item.quantity}</Typography>
                          <Typography sx={{ fontSize: 10, ml: 2 }}>{_item.price.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 })}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                        {/* {_user.id == user.id ?  : ""} */}
                        <Button onClick={() => removeItem(_item.id)}><ClearIcon /></Button>
                      </Box>

                    </Box>

                  }
                })

              }


            </Box>


          </Paper>
        </Box>

      )) : ""}
      {/* TODO : Make position of FAB different based on screen size */}
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => handleOpenModal("FAB")}>
        <AddIcon />
      </Fab>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <Paper sx={{ height: 370, width: { xs: "98vw", md: 400 } }}>



            {getModalContent()}

          </Paper>
        </Box>
      </Modal>

    </Container>



  )
}
