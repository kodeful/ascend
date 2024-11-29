import React from "react";
import { Paper, Stack, Typography } from "@mui/material";

import SettingsPageLayout from "../SettingsPageLayout";

const SettingsAccountPage = () => {
  return (
    <SettingsPageLayout>
      <Stack
        sx={{
          p: 3,
          py: 2,
        }}
        width="100%"
        flex={1}
      >
        <Typography variant="h1" color="primary.main">
          Account
        </Typography>

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Paper sx={{ height: 458 }} />
          <Paper sx={{ height: 298 }} />
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsAccountPage;
