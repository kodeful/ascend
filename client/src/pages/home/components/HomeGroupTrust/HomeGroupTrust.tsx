import React from "react";
import { TrendingUp } from "@mui/icons-material";
import { Grid, Paper, Stack, Typography } from "@mui/material";

import Counter from "components/Counter/Counter";

import HomeGroupTestGraph from "./HomeGroupTrustGraph";

const HomeGroupTrust = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
            Group Trust
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
            Group Active Listening
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <HomeGroupTestGraph height={240} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={14}>
              <b>Trust</b> has increased <Counter count={5.2} />%
            </Typography>
            <TrendingUp color="success" />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <HomeGroupTestGraph height={240} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={14}>
              Has increased <Counter count={2} />%
            </Typography>
            <TrendingUp color="success" />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomeGroupTrust;
