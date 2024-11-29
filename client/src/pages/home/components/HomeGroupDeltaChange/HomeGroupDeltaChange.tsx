import React from "react";
import { TrendingUp } from "@mui/icons-material";
import { Paper, Stack, Typography } from "@mui/material";

import Counter from "components/Counter/Counter";

import HomeGroupDeltaChangeGraph from "./HomeGroupDeltaChangeGraph";

const HomeGroupDeltaChange = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        Showing Group Delta Change
      </Typography>

      <HomeGroupDeltaChangeGraph height={240} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={14} fontWeight={600} color="#1C2024">
          Total increase up by <Counter count={8.2} step={0.1} />%
        </Typography>
        <TrendingUp color="success" />
      </Stack>
      <Typography fontSize={14} color="#60646C">
        July - August 2024
      </Typography>
    </Paper>
  );
};

export default HomeGroupDeltaChange;
