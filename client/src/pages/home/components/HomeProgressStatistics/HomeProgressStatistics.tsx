import React from "react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import Counter from "components/Counter/Counter";

const HomeProgressStatistics = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        <FormattedMessage id="PAGE.HOME.PROGRESS_STATISTICS" />
      </Typography>

      <Grid container>
        <Grid item xs={4}>
          <Stack direction="row" spacing={1}>
            <Stack
              width={38}
              height={38}
              borderRadius="50%"
              bgcolor="#F1B136"
            ></Stack>
            <Box>
              <Typography fontSize={16} fontWeight={600} color="#2A2A2A">
                <Counter count={20} step={1} digits={0} />{" "}
                <FormattedMessage id="PAGE.HOME.QUIZZES" />
              </Typography>
              <Typography fontSize={11} lineHeight={1} color="#2A2A2A">
                <FormattedMessage id="PAGE.HOME.IN_PROGRESS" />
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" spacing={1}>
            <Stack
              width={38}
              height={38}
              borderRadius="50%"
              bgcolor="success.main"
            ></Stack>
            <Box>
              <Typography fontSize={16} fontWeight={600} color="#2A2A2A">
                <Counter count={10} step={1} digits={0} />{" "}
                <FormattedMessage id="PAGE.HOME.QUIZZES" />
              </Typography>
              <Typography fontSize={11} lineHeight={1} color="#2A2A2A">
                <FormattedMessage id="PAGE.HOME.COMPLETED" />
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" spacing={1}>
            <Stack
              width={38}
              height={38}
              borderRadius="50%"
              bgcolor="error.main"
            ></Stack>
            <Box>
              <Typography fontSize={16} fontWeight={600} color="#2A2A2A">
                <Counter count={5} step={1} digits={0} />{" "}
                <FormattedMessage id="PAGE.HOME.VIDEOS" />
              </Typography>
              <Typography fontSize={11} lineHeight={1} color="#2A2A2A">
                <FormattedMessage id="PAGE.HOME.PENDING" />
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomeProgressStatistics;
