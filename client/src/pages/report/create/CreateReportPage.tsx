import React from "react";
import { Stack } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useLocation } from "react-router-dom";

import Title from "components/TItle/Title";

import ReportPDF from "./components/ReportPDF";
import CreateReportSidebar from "./CreateReportSidebar";

const CreateReportPage = () => {
  const location = useLocation();
  const locationState = (location.state || {}) as any;

  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      reportType: locationState?.reportType ?? null,
      learner: null,
      rangeDate: null,
      horizontal: false,
    },
    enableReinitialize: true,
    onSubmit: () => {},
  });

  return (
    <FormikProvider value={formik}>
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

          <ReportPDF />
        </Stack>
      </Stack>
    </FormikProvider>
  );
};

export default CreateReportPage;
