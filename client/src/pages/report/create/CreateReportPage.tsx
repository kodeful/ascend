import React from "react";
import { Stack, Typography } from "@mui/material";

import CreateReportSidebar from "./CreateReportSidebar";

const CreateReportPage = () => {
  return (
    <Stack direction="row" height="100%">
      <CreateReportSidebar />

      <Stack
        sx={{
          p: 3,
          py: 2,
        }}
        width="100%"
        flex={1}
        overflow="hidden"
      >
        <Typography variant="h1" color="primary.main">
          Create Report
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CreateReportPage;
