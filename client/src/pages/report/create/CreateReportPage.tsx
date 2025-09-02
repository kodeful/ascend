import React from "react";
import { Stack } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useHistory, useLocation } from "react-router-dom";

import { useReportControllerCreateReport } from "api/generated/report/report";
import Title from "components/TItle/Title";

import ReportPDF from "./components/ReportPDF";
import CreateReportSidebar from "./CreateReportSidebar";

const CreateReportPage = () => {
  const location = useLocation();
  const history = useHistory();
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
    onSubmit: async (values) => {
      await createReport({
        data: {
          title: values.title,
          subtitle: values.subtitle,
          type: values.reportType,
          rangeDate: values.rangeDate,
          horizontal: values.horizontal,
        },
      });
    },
  });

  const { mutateAsync: createReport, isLoading } =
    useReportControllerCreateReport({
      mutation: {
        onSuccess: () => {
          history.push("/report");
        },
      },
    });

  return (
    <FormikProvider value={formik}>
      <Stack direction="row" height="100%">
        <CreateReportSidebar isLoading={isLoading} />

        <Stack
          sx={{
            p: 3,
            py: 2,
          }}
          width="100%"
          flex={1}
        >
          <Title
            title="PAGE.TITLE.CREATE_REPORT"
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

          <Stack overflow="scroll" className="scrollbar-hidden">
            <ReportPDF />
          </Stack>
        </Stack>
      </Stack>
    </FormikProvider>
  );
};

export default CreateReportPage;
