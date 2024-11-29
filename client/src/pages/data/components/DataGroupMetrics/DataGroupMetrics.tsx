import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import DataGroupMetricsChart from "./DataGroupMetricsChart";

const DataGroupMetrics = () => {
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
            Group Transformation Capacity
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
            Group Self-Awareness
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
