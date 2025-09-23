import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import DataGroupMetricsChart from "./DataGroupMetricsChart";

const DataGroupMetrics = () => {
  const intl = useIntl();
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
            {intl.formatMessage({
              id: "PAGE.GROUP_METRICS_GROUP_CAPACITY",
            })}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
            {intl.formatMessage({
              id: "PAGE.GROUP_METRICS_GROUP_AWARENESS",
            })}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <DataGroupMetricsChart height={200} />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <DataGroupMetricsChart height={200} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataGroupMetrics;
