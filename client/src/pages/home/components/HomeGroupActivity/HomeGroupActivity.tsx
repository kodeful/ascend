import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

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
          <FormattedMessage id="PAGE.HOME.GROUP_ACTIVITY" />
        </Typography>

        <Typography fontSize={14} fontWeight={500} color="#60646C">
          <FormattedMessage id="PAGE.HOME.HOURS_SPENT" />
          <Counter count={23.9} fontWeight={600} />
          <FormattedMessage id="PAGE.HOME.HOURS" />
        </Typography>
      </Stack>

      <Box mt={1}>
        <HomeGroupActivityGraph height={200} />
      </Box>
    </Paper>
  );
};

export default HomeGroupActivity;
