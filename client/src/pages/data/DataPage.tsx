import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Home3EyesViewReport from "pages/home/components/Home3EyesViewReport/Home3EyesViewReport";
import HomeGroupTrust from "pages/home/components/HomeGroupTrust/HomeGroupTrust";
import HomeLearners from "pages/home/components/HomeLearners";

import Title from "components/TItle/Title";

import DataGroupMetrics from "./components/DataGroupMetrics/DataGroupMetrics";
import DataLuminaGroupEvaluation from "./components/DataLumina/DataLuminaGroupEvaluation";

const DataPage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
    >
      <Title title="Group metrics" />

      <Grid container spacing={2} mt={2}>
        <Grid item xs={8}>
          <Typography variant="h5" color="#4D4D4D">
            Metrics
          </Typography>

          {/* Metrics */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={6}>
              <DataGroupMetrics />
            </Grid>
            <Grid item xs={6}>
              <HomeGroupTrust />
            </Grid>
            <Grid item xs={12}>
              <Home3EyesViewReport />
            </Grid>
          </Grid>

          <Typography variant="h5" color="#4D4D4D" mt={3}>
            Lumina
          </Typography>

          {/* Lumina */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <DataLuminaGroupEvaluation />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box position="sticky" top={10}>
            <Typography variant="h5" color="#4D4D4D">
              Learners
            </Typography>

            {/* Learners */}
            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <HomeLearners />
              </Grid>
            </Grid>

            {/* <Typography variant="h5" color="#4D4D4D" mt={3}>
              ROI Calculator
            </Typography>

            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    height: 442,
                  }}
                ></Paper>
              </Grid>
            </Grid> */}
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DataPage;
