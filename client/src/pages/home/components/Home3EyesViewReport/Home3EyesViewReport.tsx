import React from "react";
import { Box, Paper, Typography } from "@mui/material";

import Home3EyesViewReportGraph from "./Home3EyesViewReportGraph";

const Home3EyesViewReport = () => {
  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
      }}
    >
      <Typography fontSize={18} fontWeight={500} color="#60646C" mb={2}>
        3-Eyes View Report
      </Typography>
      <Typography fontSize={14} fontWeight={500} color="#646C60">
        Group Leadership Skills Assessment Comparison
      </Typography>

      <Box mt={3}>
        <Home3EyesViewReportGraph height={280} />
      </Box>
    </Paper>
  );
};

export default Home3EyesViewReport;
