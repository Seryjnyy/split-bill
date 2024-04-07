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

export default function CreateCharge({ users, onSuccess }) {
  const [chargeName, setChargeName] = useState("");
  const [chargeNameError, setChargeNameError] = useState("");

  const [chargePrice, setChargePrice] = useState(0);
  const [chargePriceError, setChargePriceError] = useState("");

  const [forEveryone, setForEveryone] = useState(false);

  const { user } = useAuth();
  const { id } = useParams();

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
  };

  const validateChargePrice = (_chargePrice) => {
    if (_chargePrice < 0) {
      setChargePriceError("Can't be less than 0.");
      return false;
    }

    setChargePriceError("");
    setChargePrice(_chargePrice);
    return true;
  };

  const validateChargeAndSave = () => {
    if (!validateChargeName(chargeName)) return;

    if (!validateChargePrice(chargePrice)) return;

    // if split between calculate new price of charge
    var newPrice = forEveryone ? chargePrice / users.users.length : chargePrice;

    users.users.forEach((_user) => {
      if (_user.id == user.id || forEveryone) {
        addSessionItem(_user.id, id, chargeName, 1, newPrice, ["Charge"]).catch(
          (e) => alert(e)
        );
      }
    });

    setChargeName("");
    setChargePrice(0);

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
        sx={{ mt: 3, mb: 3, width: 200 }}
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
        <FormControlLabel
          control={
            <Switch
              checked={forEveryone}
              onClick={() => setForEveryone(!forEveryone)}
            />
          }
          label="Split between everyone"
        />
      </FormGroup>

      <Button onClick={() => validateChargeAndSave()} sx={{ mt: 1 }}>
        Add
      </Button>
    </Box>
  );
}
