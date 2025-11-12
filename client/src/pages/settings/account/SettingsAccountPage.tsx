import React from "react";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

import { useMeStore, userInitials } from "components/stores/MeStore";
import Title from "components/TItle/Title";

import SettingsPageLayout from "../SettingsPageLayout";
import SettingsAccountInfoForm from "./SettingsAccountInfoForm";
import SettingsPasswordForm from "./SettingsPasswordForm";

const SettingsAccountPage = () => {
  const name = useMeStore((s) => s.me?.fullName);
  const initials = userInitials(name);

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
        <Title title="PAGE.TITLE.ACCOUNT" />

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Typography fontSize={14} fontWeight={600} color="primary.main">
              Account Info
            </Typography>

            <Box mt={2}>
              <Avatar
                sx={{
                  width: 68,
                  height: 68,
                  bgcolor: "primary.main",
                  color: "#FFF",
                  // fontSize: Math.min(35, 60 / initials.length),
                  fontSize: 35,
                  // border: "1px solid transparent",
                  borderColor: "primary.dark",
                  fontWeight: 600,
                  mb: 2,
                }}
                variant="circular"
              >
                {initials.toUpperCase()}
              </Avatar>

              <SettingsAccountInfoForm />
            </Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography fontSize={14} fontWeight={600} color="primary.main">
              Password
            </Typography>

            <Box mt={1}>
              <Typography fontSize={12} fontWeight={500} color="#808080">
                Save carefully and remember your password before you change it.
              </Typography>
            </Box>

            <Box mt={1}>
              <SettingsPasswordForm />
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsAccountPage;
