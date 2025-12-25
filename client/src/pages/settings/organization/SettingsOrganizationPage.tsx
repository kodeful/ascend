import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

import Title from "components/TItle/Title";

import SettingsPageLayout from "../SettingsPageLayout";
import SettingsOrgnizationForm from "./SettingsOrgnizationForm";

const SettingsOrganizationPage = () => {
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
        <Title title="PAGE.TITLE.ORGANIZATION" />

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Typography fontSize={14} fontWeight={600} color="primary.main">
              Organization Info
            </Typography>

            <Box mt={2}>
              <SettingsOrgnizationForm />
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsOrganizationPage;
