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

export default function CreateDiscount({ onSuccess }) {
  const [discountName, setDiscountName] = useState("");
  const [discountNameError, setDiscountNameError] = useState("");

  const [discountAmount, setDiscountAmount] = useState(1);
  const [discountAmountError, setDiscountAmountError] = useState("");

  const [discountTags, setDiscountTags] = useState([]);
  const [discountTagsError, setDiscountTagsError] = useState("");

  // Tags
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState(["Food", "Drink"]);
  const [itemTagsError, setItemTagsError] = useState("");

  const validateDiscountName = (_discountName) => {
    if (_discountName.length <= 0) {
      setDiscountNameError("Need a name.");
      setDiscountName("");
      return false;
    }

    if (_discountName.length > 20) {
      setDiscountNameError("Too long.");
      return false;
    }

    setDiscountNameError("");
    setDiscountName(_discountName);
    return true;
  };

  const validateDiscountAmount = (_discountAmount) => {
    if (_discountAmount < 1) {
      setDiscountAmountError("Can't be 0 or less.");
      setDiscountAmount(0);
      return false;
    }

    if (_discountAmount > 100) {
      setDiscountAmountError("Can't be more than 100.");
      setDiscountAmount(100);
      return false;
    }

    setDiscountAmountError("");
    setDiscountAmount(_discountAmount);
    return true;
  };

  const validateDiscountTags = (_discountTags) => {
    if (_discountTags.length == 0) {
      setDiscountTagsError("Need a tag.");
      return false;
    }

    if (_discountTags.length > 1) {
      setDiscountTagsError("Too many tags.");
      return false;
    }

    setDiscountTagsError("");
    return true;
  };

  const validateDiscountAndSave = () => {
    let valid = true;

    if (!validateDiscountName(discountName)) {
      valid = false;
    }

    if (!validateDiscountAmount(discountAmount)) {
      valid = false;
    }

    if (!validateDiscountTags(discountTags)) {
      valid = false;
    }

    if (!valid) {
      return;
    }

    setDiscountName("");
    setDiscountAmount("");
    setDiscountTags([]);

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
        error={discountNameError != ""}
        id="outlined-error-helper-text"
        label="Name"
        value={discountName}
        helperText={discountNameError != "" ? discountNameError : ""}
        onChange={(e) => {
          validateDiscountName(e.target.value);
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        sx={{ mt: 3, width: 200 }}
        error={discountAmountError != ""}
        id="outlined-error-helper-text"
        label="Amount in %"
        type="number"
        value={discountAmount}
        helperText={discountAmountError != "" ? discountAmountError : ""}
        onChange={(e) => {
          validateDiscountAmount(e.target.value);
        }}
      />

      <Box sx={{ width: "100%", mt: 3 }}>
        <LabelSelect
          value={discountTags}
          setValue={setDiscountTags}
          availableTags={availableTags.map((tag) => ({
            value: tag,
            name: tag,
            createdNow: false,
          }))}
          inputErrorMessage={discountTagsError}
          maxSelect={2}
          label="For"
        />
      </Box>

      <Button onClick={() => validateDiscountAndSave()} sx={{ mt: 1 }} disabled>
        Add
      </Button>
    </Box>
  );
}
