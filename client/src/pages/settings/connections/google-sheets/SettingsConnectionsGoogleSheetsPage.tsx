import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import GoogleSheetsIMG from "assets/imgs/connections/google-sheets.png";
import SettingsPageLayout from "pages/settings/SettingsPageLayout";

import { openModal } from "components/modals/ModalsStore";
import Title from "components/TItle/Title";

const SettingsConnectionsFilesPage = () => {
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
        <Title
          title="New connection"
          breadcrumbs={[
            {
              title: "Connections",
              link: "/settings/connections",
            },
            {
              title: "Google Sheets",
              link: "/settings/connections/google-sheet",
            },
          ]}
        />

        <Stack
          direction="row"
          mt={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src={GoogleSheetsIMG}
              width={67}
              height={62}
              sx={{
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography
                fontSize={24}
                fontWeight={600}
                color="#4D4D4D"
                lineHeight={1.2}
              >
                Google Sheets
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={600}
                color="primary.dark"
                lineHeight={1.2}
              ></Typography>
            </Box>
          </Stack>

          <Box>
            <Button
              variant="contained"
              sx={{
                padding: "8px 16px",
                minHeight: "auto",
                height: "auto",
                fontSize: 14,
              }}
              onClick={() => {
                openModal("import-file", {
                  source: "google-sheet",
                });
              }}
            >
              Import Data
            </Button>
          </Box>
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsConnectionsFilesPage;
