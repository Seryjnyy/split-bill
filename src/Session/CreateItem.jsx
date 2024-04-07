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

export default function CreateItem({ onSuccess }) {
  const { user } = useAuth();
  const { id } = useParams();

  // Item
  const [itemName, setItemName] = useState("");
  const [itemNameError, setItemNameError] = useState("");

  const [itemPrice, setItemPrice] = useState(0);
  const [itemPriceError, setItemPriceError] = useState("");

  const [itemAmount, setItemAmount] = useState(1);
  const [itemAmountError, setItemAmountError] = useState("");

  // Tags
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState(["Food", "Drink"]);
  const [itemTagsError, setItemTagsError] = useState("");

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
  };

  const validateItemPrice = (_itemPrice) => {
    if (_itemPrice < 0) {
      setItemPriceError("Can't be less than 0.");
      return false;
    }

    setItemPriceError("");
    setItemPrice(_itemPrice);
    return true;
  };

  const validateItemAmount = (_itemAmount) => {
    if (_itemAmount < 1) {
      setItemAmountError("Can't be 0 or less.");
      setItemAmount(0);
      return false;
    }

    setItemAmountError("");
    setItemAmount(_itemAmount);
    return true;
  };

  const validateItemTags = () => {
    if (tags.length == 0) {
      setItemTagsError("Need a tag.");
      return false;
    }

    if (tags.length > 1) {
      setItemTagsError("Too many tags.");
      return false;
    }

    setItemTagsError("");
    return true;
  };

  const validateItemAndSave = () => {
    let valid = true;

    if (!validateItemName(itemName)) {
      valid = false;
    }

    if (!validateItemPrice(itemPrice)) {
      valid = false;
    }

    if (!validateItemAmount(itemAmount)) {
      valid = false;
    }

    if (!validateItemTags(tags)) {
      valid = false;
    }

    if (!valid) {
      return;
    }

    addSessionItem(
      user.id,
      id,
      itemName,
      itemAmount,
      itemPrice,
      tags.map((tag) => tag.value)
    ).catch((e) => alert(e));

    setItemAmount(1);
    setItemName("");
    setItemPrice(0);
    setTags([]);

    onSuccess();
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

      <Box sx={{ width: "100%", mt: 3 }}>
        <LabelSelect
          value={tags}
          setValue={setTags}
          availableTags={availableTags.map((tag) => ({
            value: tag,
            name: tag,
            createdNow: false,
          }))}
          inputErrorMessage={itemTagsError}
          maxSelect={1}
          label={"Tags"}
        />
      </Box>

      <Button onClick={() => validateItemAndSave()} sx={{ mt: 1 }}>
        Add
      </Button>
    </Box>
  );
}
