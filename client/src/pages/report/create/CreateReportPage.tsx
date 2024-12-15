import React from "react";
import { Stack } from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import Title from "components/TItle/Title";

import ReportPDF from "./components/ReportPDF";
import CreateReportSidebar from "./CreateReportSidebar";

const CreateReportPage = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      reportType: null,
      learner: null,
      rangeDate: null,
      horizontal: false,
    },
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
