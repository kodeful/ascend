import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LuminaIMG from "assets/imgs/connections/lumina.png";
import SettingsPageLayout from "pages/settings/SettingsPageLayout";

import { openModal } from "components/modals/ModalsStore";
import Title from "components/TItle/Title";

import ImportsLuminaDataGrid from "./ImportsLuminaDataGrid";

const SettingsConnectionsLuminaPage = () => {
  const [tab, setTab] = useState<"imports" | "integration-details">("imports");

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
          title="PAGE.TITLE.NEW_CONNECTION"
          breadcrumbs={[
            {
              title: "Connections",
              link: "/settings/connections",
            },
            {
              title: "Lumina",
              link: "/settings/connections/lumina",
            },
          ]}
        />

        <Stack
          direction="row"
          mt={4}
          pb={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src={LuminaIMG}
              width={67}
              height={62}
              sx={{
                objectFit: "contain",
              }}
            />
            <Box>
              <Typography
                fontSize={24}
                fontWeight={600}
                color="#4D4D4D"
                lineHeight={1.2}
              >
                Lumina
              </Typography>
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
                  source: "file",
                });
              }}
            >
              Import Data
            </Button>
          </Box>
        </Stack>

        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(e, value) => {
            if (!value) return;
            setTab(value);
          }}
          sx={{ mb: 1 }}
        >
          <ToggleButton value="imports">Imports</ToggleButton>
          <ToggleButton value="integration-details">
            Integration Details
          </ToggleButton>
        </ToggleButtonGroup>

        {tab === "imports" && (
          <>
            <Typography fontSize={18} fontWeight={600} color="#60646C" mb={1}>
              Import logs
            </Typography>

            <Box>
              <ImportsLuminaDataGrid />
            </Box>
          </>
        )}
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsConnectionsLuminaPage;
