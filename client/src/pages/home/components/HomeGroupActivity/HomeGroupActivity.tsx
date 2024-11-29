import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

import Counter from "components/Counter/Counter";

import HomeGroupActivityGraph from "./HomeGroupActivityGraph";

const HomeGroupActivity = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
        pb: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={500} color="#60646C">
          Group Activity
        </Typography>

        <Typography fontSize={14} fontWeight={500} color="#60646C">
          <Counter count={23.9} fontWeight={600} /> hours spent
        </Typography>
      </Stack>

      <Box mt={1}>
        <HomeGroupActivityGraph height={200} />
      </Box>
    </Paper>
  );
};

export default HomeGroupActivity;
