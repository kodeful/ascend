import React from "react";
import { Stack, Typography } from "@mui/material";

import SettingsSidebar from "./components/SettingsSidebar";

const SettingsPage = () => {
  return (
    <Stack direction="row" height="100%">
      <SettingsSidebar />

      <Stack
        sx={{
          p: 3,
          py: 2,
        }}
      >
        <Typography variant="h1" color="primary.main">
          Settings
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SettingsPage;
