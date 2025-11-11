import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

import DataLuminaChart from "./DataLuminaChart";

const DataLumina360 = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        Mindslines 360
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography fontSize={12} fontWeight={600} color="#646C60">
            Self evaluation
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <DataLuminaChart reverse labels={false} />
            </Grid>
            <Grid item xs={6}>
              <DataLuminaChart labels={false} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={12} fontWeight={600} color="#646C60">
            Facilitator evaluation
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <DataLuminaChart reverse labels={false} />
            </Grid>
            <Grid item xs={6}>
              <DataLuminaChart labels={false} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DataLumina360;
