import React from "react";
import { Stack } from "@mui/material";

import Title from "components/TItle/Title";

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
        <Title
          title="Create Report"
          breadcrumbs={[
            {
              title: "Report",
              link: "/report",
            },
            {
              title: "Create Report",
              link: "/report/create",
            },
          ]}
        />
      </Stack>
    </Stack>
  );
};

export default CreateReportPage;
