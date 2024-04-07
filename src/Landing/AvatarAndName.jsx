import {
  Button,
  Typography,
  TextField,
  Container,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import Avatar, { genConfig } from "react-nice-avatar";

export default function AvatarAndName({ name, avatarSeed }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: 350,
        pt: 1,
        pb: 1,
        mt: 1,
        borderColor: "divider",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ ml: 2 }}>
        <Avatar
          style={{ width: "5rem", height: "5rem" }}
          {...genConfig(avatarSeed)}
        />
      </Box>
      <Typography
        sx={{
          textTransform: "uppercase",
          mr: 5,
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        {name}
      </Typography>
    </Paper>
  );
}
