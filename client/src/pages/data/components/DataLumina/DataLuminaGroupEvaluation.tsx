import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import DataLuminaChart from "./DataLuminaChart";

const DataLuminaGroupEvaluation = () => {
  const intl = useIntl();
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        {intl.formatMessage({
          id: "PAGE.GROUP_MINDSLINES_GROUP_EVALUATION",
        })}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DataLuminaChart />
        </Grid>
        <Grid item xs={6}>
          <DataLuminaChart />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataLuminaGroupEvaluation;
