import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

import DataLuminaChart from "./DataLuminaChart";

const DataLuminaIndividualEvaluation = ({ email }: { email?: string }) => {
  // const intl = useIntl();

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        Mindslines - Individual
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataLuminaChart email={email} />
        </Grid>
        {/* <Grid item xs={6}>
          <DataLuminaChart />
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export default DataLuminaIndividualEvaluation;
