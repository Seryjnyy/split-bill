import { arrayUnion, collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import { Typography, TextField, InputAdornment, Button } from "@mui/material";
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from "./UserAuthContext";

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

  const fetchSession = async (_id) => {
    const ref = doc(db, "sessions", _id);

    return await getDoc(ref);
  }

  const sessionSnapshotListener = (_id) => {
    const ref = doc(db, "sessions", _id);
    console.log("this id " + _id)

    const q = query(ref);

    onSnapshot(q, (querySnapshot) => {
      setUsers({ creator: querySnapshot.data().creator, users: querySnapshot.data().users })
    });
  }

  useEffect(() => {
    console.log("users")
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
    if(!validateItemName(itemName))
      return;

    if(!validateItemPrice(itemPrice))
      return;

    if(!validateItemAmount(itemAmount))
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
    <Container maxWidth="xs">
      <div>SessionPage {id}</div>
      {users ? users?.users?.map(_user => (
        <Box key={_user.id}>
          <Box sx={{ display: "flex", maxWidth: "xs", justifyContent: "space-between", alignItems: "center" }}>
            <Avatar style={{ width: '4rem', height: '4rem' }} {...genConfig(_user.avatarSeed)} />
            <Typography sx={{ textTransform: 'uppercase', mr: 5 }}>{_user.name}</Typography>
          </Box>

          <Box>
            {_user.items.map((item, index) => (<Box sx={{ display: "flex", justifyContent: "space-evenly" }} key={_user.id + index}><Typography>{item.name}</Typography> <Typography>{item.price}</Typography>  <Typography>{item.quantity}</Typography> </Box>))}
          </Box>
          {_user.id == user.id ?
            <Box>
              <TextField
                error={itemNameError != ""}
                id="outlined-error-helper-text"
                label="Name"
                value={itemName}
                helperText={itemNameError != "" ? itemNameError : ""}
                onChange={(e) => {
                  validateItemName(e.target.value);
                }}
                InputLabelProps={{shrink: true}}
              />

              <TextField
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

              <Button onClick={() => validateItemAndSave()}>
                Add
              </Button>
            </Box> : ""}
        </Box>

      )) : ""}
    </Container>


  )
}
