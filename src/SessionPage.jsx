import { arrayUnion, collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import { Typography, TextField, InputAdornment, Button, Card, Paper, Modal } from "@mui/material";
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from "./UserAuthContext";
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Square } from "@mui/icons-material";
import { Divider } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import QRCode from "react-qr-code";

export default function SessionPage() {
  const [users, setUsers] = useState({ creator: "", users: [] });
  const { id } = useParams();
  const { user } = useAuth();

  const [itemName, setItemName] = useState("");
  const [itemNameError, setItemNameError] = useState("");

  const [itemPrice, setItemPrice] = useState(0);
  const [itemPriceError, setItemPriceError] = useState("");

  const [itemAmount, setItemAmount] = useState(0);
  const [itemAmountError, setItemAmountError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [modalContent, setModalContent] = useState("");


  const [peopleCount, setPeopleCount] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  const handleOpenModal = (source) => {
    if (source == "FAB") {
      setModalContent("FAB")
    } else if (source == "QR") {
      setModalContent("QR")
    }

    setOpenModal(true)
  };


  const sessionSnapshotListener = (_id) => {
    const ref = doc(db, "sessions", _id);
    console.log("this id " + _id)

    const q = query(ref);

    onSnapshot(q, (querySnapshot) => {
      
      setUsers({ creator: querySnapshot.data().creator, users: querySnapshot.data().users.map(_user => {
        // calculate item count, total price
        var itemCountTemp = 0
        var totalPriceTemp = 0
        _user.items.forEach(_item => {
          itemCountTemp = _item.quantity;
          totalPriceTemp = _item.price * _item.quantity;
        })


        return {..._user, additional: {itemCount: itemCountTemp, totalPrice: totalPriceTemp}}
      }) });

      // calculate money total, people, items
      // console.log(querySnapshot.data().users)

      // TODO : put these into single object to prevent 3 rerenders when setting these 
      // This could go in useEffect for users
      var peopleCountTemp = querySnapshot.data().users.length; // TODO : might be null
      var itemCountTemp = 0;
      var totalCostTemp = 0;

      querySnapshot.data().users.forEach((_user) => {
        _user.items.forEach(_item => {
          totalCostTemp += _item.price * _item.quantity;
          itemCountTemp += _item.quantity;
        });
      });
      setPeopleCount(peopleCountTemp);
      setItemCount(itemCountTemp)
      setTotalCost(totalCostTemp)

    });
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
        // need to add the user
        const taskRef = doc(db, "sessions", id);

        setDoc(taskRef, {
          users: arrayUnion({ id: user.id, name: user.username, avatarSeed: user.avatarSeed, items: [] })
        }, { merge: true });

      }
    }

  }, [users])


  useEffect(() => {
    sessionSnapshotListener(id);
  }, []);

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


    // save to user items
    const taskRef = doc(db, "sessions", id);

    // find ourself in users list
    let us = users.users.find(element => element.id == user.id);
    updateDoc(taskRef, {

    }, { merge: true });


    setItemAmount(1);
    setItemName("");
    setItemPrice(0);
  }

  return (
    <Container maxWidth="xs" sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      {/* <div>SessionPage {id}</div> */}


      <Box>
        <Typography sx={{ fontSize: 40, mt: 8 }}>{totalCost.toLocaleString("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})}</Typography>
        <Typography sx={{ fontSize: 12 }} align="center">{peopleCount} people | {itemCount} items</Typography>
      </Box>

      <Paper variant="outlined" sx={{ width: 350, display: "flex", justifyContent: "center", pt: 1, pb: 1, mt: 3, borderColor: "#EDEADE", borderRadius: 3 }}>

        <Button onClick={() => handleOpenModal("QR")}>
          <QrCodeIcon />
          QR Code
        </Button>
      </Paper>

      {users ? users?.users?.map(_user => (
        <Box key={_user.id}>
          <Paper variant="outlined" sx={{ width: 350, pt: 1, pb: 1, mt: 3, borderColor: "#EDEADE", borderRadius: 3 }}>
            <Box sx={{ display: "flex", maxWidth: "xs", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar style={{ width: '3rem', height: '3rem' }} {...genConfig(_user.avatarSeed)} />
                <Typography sx={{ textTransform: 'uppercase', ml: 2 }}>{_user.name}</Typography>

              </Box>



              <Box>
                <Typography sx={{ mr: 2 }}>{_user.additional.totalPrice.toLocaleString("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})}</Typography>
                <Typography sx={{ fontSize: 10 }}>{_user.additional.itemCount} items</Typography>
              </Box>
            </Box>

            <Divider sx={{ mt: 1, mb: 1 }} />

            <Box>
              {_user.items.map((item, index) => (
                <Box sx={{ display: "flex", justifyContent: "space-between" }} key={_user.id + index}>
                  <Box sx={{ ml: 3 }}>
                    <Typography sx={{ fontSize: 20 }}>{item.name}</Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography sx={{ fontSize: 10 }}>x {item.quantity}</Typography>
                      <Typography sx={{ fontSize: 10, ml: 2 }}>{item.price.toLocaleString("en-GB", {style: "currency", currency: "GBP", minimumFractionDigits: 2})}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <ClearIcon />
                  </Box>

                </Box>))}
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
          <Paper sx={{ height: 370, width:{xs:"98vw", md:400}}}>



            {modalContent == "FAB" ?
              <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ fontSize: 20, mt: 1, mb: 3 }}>Add item</Typography>
                <TextField
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
                  sx={{ mt: 3 }}
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
                  sx={{ mt: 3 }}
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

                <Button onClick={() => validateItemAndSave()} sx={{ mt: 5 }}>
                  Add
                </Button>
              </Box>
              :
              <Box sx={{display:"flex", justifContent:"center", alignItems:"center", width:"100%", height:"100%", backgroundColor:"red"}}>
                <QRCode value={window.location.href} />
              </Box>
            }

          </Paper>
        </Box>
      </Modal>

    </Container>



  )
}
