import React from "react";
import { Avatar, Box, CircularProgress, Grid, Stack } from "@mui/material";
import DataLumina360 from "pages/data/components/DataLumina/DataLumina360";
import DataLuminaGroupEvaluation from "pages/data/components/DataLumina/DataLuminaGroupEvaluation";
import HomeCompletition from "pages/home/components/HomeCompletition/HomeCompletition";
import HomeGroupActivity from "pages/home/components/HomeGroupActivity/HomeGroupActivity";
import { useParams } from "react-router-dom";

import { useUserControllerGetUser } from "api/generated/user/user";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Title from "components/TItle/Title";

const LearnerDetailsPage = () => {
  const { learnerId } = useParams<{ learnerId: string }>();

  const { data: learner, isLoading } = useUserControllerGetUser(learnerId, {
    query: {
      queryKey: ["learner", learnerId],
    },
  });

  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
    >
      <Title
        title="PAGE.TITLE.LEARNER"
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

      <AsyncComponent
        loading={isLoading}
        SkeletonComponent={
          <Stack
            height="100%"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Stack>
        }
      >
        <Grid container spacing={2} mt={2}>
          <Grid item xs={8}>
            {/* Mindslines */}
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
              <Stack
                position="relative"
                width="100%"
                alignItems="center"
                mb={3}
              >
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
                  {learner?.fullName
                    ?.split(" ")
                    .map((name: string) => name[0])
                    .join("")
                    .toUpperCase()}
                </Avatar>
              </Stack>

              <Grid container pt={1} spacing={2}>
                <Grid item xs={12}>
                  <HomeCompletition email={learner?.email} />
                </Grid>
                <Grid item xs={12}>
                  <HomeGroupActivity />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </AsyncComponent>
    </Stack>
  );
};

export default LearnerDetailsPage;
