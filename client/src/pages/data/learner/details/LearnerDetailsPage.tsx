import React from "react";
import { Avatar, Box, Grid, Stack } from "@mui/material";
import DataLumina360 from "pages/data/components/DataLumina/DataLumina360";
import DataLuminaGroupEvaluation from "pages/data/components/DataLumina/DataLuminaGroupEvaluation";
import HomeGroupActivity from "pages/home/components/HomeGroupActivity/HomeGroupActivity";

import { userInitials } from "components/stores/MeStore";
import Title from "components/TItle/Title";

const LearnerDetailsPage = () => {
  const initials = userInitials("John Doe");

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
          <Box position="sticky" top={30}>
            <Stack position="relative" width="100%" alignItems="center" mb={3}>
              <Box
                sx={{
                  width: 125,
                  height: 125,
                  // bgcolor: "primary.main",
                  border: "2px solid transparent",
                  borderColor: "primary.main",
                  borderRadius: "50%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                position="absolute"
              />

              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: "primary.main",
                  color: "#FFF",
                  // fontSize: Math.min(30, 38 / initials.length),
                  fontSize: 40,
                  border: "1px solid transparent",
                  borderColor: "primary.dark",
                  fontWeight: 600,
                }}
                variant="circular"
              >
                {initials.toUpperCase()}
              </Avatar>
            </Stack>

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
