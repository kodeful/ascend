import React from "react";
import { Grid, Stack, Typography } from "@mui/material";

import Title from "components/TItle/Title";

import ROICalculatorWidget from "./components/ROICalculatorWidget";
import ROIForm from "./components/ROIForm";

const ROICalculatorPage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
    >
      <Title
        title="ROI Calculator"
        breadcrumbs={[
          {
            title: "Data",
            link: "/data",
          },
          {
            title: "ROI Calculator",
            link: "/data/roi-calculator",
          },
        ]}
      />

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} xl={8}>
          <Typography variant="h5" color="#4D4D4D">
            Enter data
          </Typography>

          {/* ROI Form */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <ROIForm />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Typography variant="h5" color="#4D4D4D">
            Result
          </Typography>

          {/* ROI Calculator */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <ROICalculatorWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ROICalculatorPage;
