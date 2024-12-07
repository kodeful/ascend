import React from "react";
import { Box, Grid, Stack } from "@mui/material";
import DataLumina360 from "pages/data/components/DataLumina/DataLumina360";
import DataLuminaGroupEvaluation from "pages/data/components/DataLumina/DataLuminaGroupEvaluation";
import HomeGroupActivity from "pages/home/components/HomeGroupActivity/HomeGroupActivity";

import Title from "components/TItle/Title";

const LearnerDetailsPage = () => {
  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
    >
      <Title
        title="Learner"
        breadcrumbs={[
          {
            title: "Data",
            link: "/data",
          },
          {
            title: "Learner",
            link: "/data/learner",
          },
        ]}
      />

      <Grid container spacing={2} mt={2}>
        <Grid item xs={8}>
          {/* Lumina */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={12}>
              <DataLuminaGroupEvaluation />
            </Grid>

            <Grid item xs={12}>
              <DataLumina360 />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box position="sticky" top={10}>
            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <HomeGroupActivity />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default LearnerDetailsPage;
