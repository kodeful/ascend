import React from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import ExcelIMG from "assets/imgs/connections/excel.png";
import GoogleSheetsIMG from "assets/imgs/connections/google-sheets.png";
// import LearnDashIMG from "assets/imgs/connections/learn-dash.png";
import LuminaIMG from "assets/imgs/connections/lumina.png";
// import MoodleIMG from "assets/imgs/connections/moodle.png";
import { useHistory } from "react-router-dom";

import Title from "components/TItle/Title";

import SettingsPageLayout from "../SettingsPageLayout";

const connectApps = [
  // {
  //   img: LearnDashIMG,
  //   title: "LearnDash LMS",
  //   link: "/settings/connections/learn-dash",
  //   disabled: true,
  // },
  // {
  //   img: MoodleIMG,
  //   title: "Moodle LMS",
  //   link: "/settings/connections/moodle",
  //   disabled: true,
  // },

  {
    img: GoogleSheetsIMG,
    title: "Google Sheets",
    link: "/settings/connections/google-sheets",
    disabled: false,
  },
  {
    img: LuminaIMG,
    title: "Lumina",
    link: "/settings/connections/lumina",
    disabled: false,
  },
];
const importData = [
  {
    img: ExcelIMG,
    // title: "Files .CSV .XLS",
    title: "Files .CSV .JSON",
    link: "/settings/connections/files",
    disabled: false,
  },
];

const SettingsConnectionsPage = () => {
  const history = useHistory();

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
        <Title title="Connections" />

        <Stack direction="column" mt={3} width="100%" spacing={2}>
          <Typography variant="h5" color="#4D4D4D">
            Connect apps
          </Typography>

          <Stack direction="row" gap={2} flexWrap="wrap">
            {connectApps.map((app) => (
              <Paper
                key={app.title}
                component={ButtonBase}
                sx={{
                  width: 240,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  if (app.disabled) return;
                  history.push(app.link);
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
                key={app.title}
                component={ButtonBase}
                sx={{
                  width: 240,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  if (app.disabled) return;
                  history.push(app.link);
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
