import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import SessionTable from "./SessionTable";

export default function Sessions() {
  const [sessions, setSessions] = useState(null);

  return (
    <>
      <Box sx={{ marginRight: "auto", ml: 3, mt: 8 }}>
        <Typography sx={{ fontSize: 20 }}>Created sessions,</Typography>
      </Box>
      <Box sx={{ mt: 1, mb: 5 }}>
        <SessionTable></SessionTable>
      </Box>
    </>
  );
}
