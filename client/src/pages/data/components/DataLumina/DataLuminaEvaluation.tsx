import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

import DataLuminaChart from "./DataLuminaChart";

const DataLuminaEvaluation = ({ email }: { email?: string }) => {
  // const intl = useIntl();

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        Lumina - {email ? "Individual" : "Group"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataLuminaChart email={email} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataLuminaEvaluation;
