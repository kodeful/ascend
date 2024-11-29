import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";

import Home3EyesViewReport from "./components/Home3EyesViewReport/Home3EyesViewReport";
import HomeGroupActivity from "./components/HomeGroupActivity/HomeGroupActivity";
import HomeGroupDeltaChange from "./components/HomeGroupDeltaChange/HomeGroupDeltaChange";
import HomeGroupTrust from "./components/HomeGroupTrust/HomeGroupTrust";
import HomeLearners from "./components/HomeLearners";
import HomeRecentReportsDataGrid from "./components/HomeRecentReports/HomeRecentReportsDataGrid";

const HomePage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
    >
      <Typography variant="h1" color="primary.main">
        Dashboard
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={8}>
          <Typography variant="h5" color="#4D4D4D">
            Metrics
          </Typography>

          {/* Metrics */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={6}>
              <HomeGroupDeltaChange />
            </Grid>
            <Grid item xs={6}>
              <HomeGroupTrust />
            </Grid>
            <Grid item xs={12}>
              <Home3EyesViewReport />
            </Grid>
          </Grid>

          <Typography variant="h5" color="#4D4D4D" mt={3}>
            Recent Reports
          </Typography>

          {/* Recent Reports */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <HomeRecentReportsDataGrid />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box position="sticky" top={10}>
            <Typography variant="h5" color="#4D4D4D">
              Learners
            </Typography>

            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <HomeLearners />
              </Grid>
              <Grid item xs={12}>
                <HomeGroupActivity />
              </Grid>
              {/* <Grid item xs={12}>
                <HomeProgressStatistics />
              </Grid> */}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default HomePage;
