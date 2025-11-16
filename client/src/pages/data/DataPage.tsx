import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import ROICalculatorWidget from "pages/data/roi-calculator/components/ROICalculatorWidget";
import Home3EyesViewReport from "pages/home/components/Home3EyesViewReport/Home3EyesViewReport";
import HomeGroupTrust from "pages/home/components/HomeGroupSkill/HomeGroupSkill";
import HomeLearners from "pages/home/components/HomeLearners";
import { useIntl } from "react-intl";

import Title from "components/TItle/Title";

import DataGroupMetrics from "./components/DataGroupMetrics/DataGroupMetrics";
import DataLuminaEvaluation from "./components/DataLumina/DataLuminaEvaluation";

const DataPage = () => {
  const intl = useIntl();
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
      height="100%"
    >
      <Title title="PAGE.TITLE.GROUP_METRICS" />

      <Grid
        className="scrollbar-hidden"
        container
        spacing={2}
        mt={2}
        height="100%"
        overflow="scroll"
      >
        <Grid item xs={8}>
          <Typography variant="h5" color="#4D4D4D">
            {intl.formatMessage({
              id: "PAGE.GROUP_METRICS",
            })}
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
            Mindslines
          </Typography>

          {/* Mindslines */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <DataLuminaEvaluation />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box position="sticky" top={10}>
            <Typography variant="h5" color="#4D4D4D">
              {intl.formatMessage({
                id: "PAGE.GROUP_LEARNERS",
              })}
            </Typography>

            {/* Learners */}
            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <HomeLearners />
              </Grid>
            </Grid>

            <Typography variant="h5" color="#4D4D4D" sx={{ mt: 2 }}>
              {intl.formatMessage({
                id: "PAGE.GROUP_ROICALCULATOR",
              })}
            </Typography>

            {/* ROI Calculator */}
            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <ROICalculatorWidget link="/data/roi-calculator" />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DataPage;
