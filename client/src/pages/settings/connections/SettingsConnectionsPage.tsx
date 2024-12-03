import React from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import ExcelIMG from "assets/imgs/connections/excel.png";
import GoogleSheetsIMG from "assets/imgs/connections/google-sheets.png";
import LearnDashIMG from "assets/imgs/connections/learn-dash.png";
import LuminaIMG from "assets/imgs/connections/lumina.png";
import MoodleIMG from "assets/imgs/connections/moodle.png";

import SettingsPageLayout from "../SettingsPageLayout";

const connectApps = [
  {
    img: LearnDashIMG,
    title: "LearnDash LMS",
  },
  {
    img: MoodleIMG,
    title: "Moodle LMS",
  },
  {
    img: LuminaIMG,
    title: "Lumina",
  },
  {
    img: GoogleSheetsIMG,
    title: "Google Form",
  },
];
const importData = [
  {
    img: ExcelIMG,
    title: "Files .CSV .XLS",
  },
];

const SettingsConnectionsPage = () => {
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
          Connections
        </Typography>

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Typography variant="h5" color="#4D4D4D">
            Connect apps
          </Typography>

          <Stack direction="row" gap={2} flexWrap="wrap">
            {connectApps.map((app) => (
              <Paper
                component={ButtonBase}
                sx={{
                  width: 240,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={app.img}
                  alt={app.title}
                  width={140}
                  height={60}
                  sx={{
                    objectFit: "contain",
                  }}
                />

                <Typography
                  fontSize={18}
                  fontWeight={600}
                  color="primary.dark"
                  mt={3}
                >
                  {app.title}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Typography variant="h5" color="#4D4D4D">
            Import data
          </Typography>

          <Stack direction="row" gap={2} flexWrap="wrap">
            {importData.map((app) => (
              <Paper
                component={ButtonBase}
                sx={{
                  width: 240,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={app.img}
                  alt={app.title}
                  width={140}
                  height={60}
                  sx={{
                    objectFit: "contain",
                  }}
                />

                <Typography
                  fontSize={18}
                  fontWeight={600}
                  color="primary.dark"
                  mt={3}
                >
                  {app.title}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </SettingsPageLayout>
  );
};

export default SettingsConnectionsPage;
