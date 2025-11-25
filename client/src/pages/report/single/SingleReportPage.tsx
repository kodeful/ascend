import React from "react";
import { Skeleton, Stack } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useIntl } from "react-intl";
import { useLocation, useParams } from "react-router-dom";

import { useReportControllerGetReportById } from "api/generated/report/report";
import AsyncComponent from "components/AsyncComponent/AsyncComponent";
import Title from "components/TItle/Title";

import ReportPDF from "../create/components/ReportPDF";

const SingleReportPage = () => {
  const location = useLocation();
  const { reportId } = useParams<{ reportId: string }>();

  const intl = useIntl();
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
    onSubmit: async () => {},
  });

  const { setValues } = formik;

  const { isLoading } = useReportControllerGetReportById(reportId, {
    query: {
      enabled: !!reportId,
      onSuccess: (data) => {
        setValues({
          // @ts-expect-error
          title: data?.title ?? "",
          // @ts-expect-error
          subtitle: data?.subtitle ?? "",
          // @ts-expect-error
          reportType: data?.type ?? null,
          // @ts-expect-error
          learner: data?.learner ?? null,
          // @ts-expect-error
          rangeDate: data?.rangeDate ?? null,
          // @ts-expect-error
          horizontal: data?.horizontal ?? false,
        });
      },
    },
  });

  return (
    <FormikProvider value={formik}>
      <Stack direction="row" height="100%">
        {/* <CreateReportSidebar isLoading={isLoading} /> */}

        <Stack
          sx={{
            p: 3,
            py: 2,
          }}
          width="100%"
          flex={1}
        >
          <Title
            title="PAGE.TITLE.SINGLE_REPORT"
            breadcrumbs={[
              {
                title: intl.formatMessage({
                  id: "PAGE.REPORT.CREATE_REPORT.BREADCRUMBS_REPORT",
                }),
                link: "/report",
              },
              {
                title: intl.formatMessage({
                  id: "PAGE.REPORT.SINGLE_REPORT.BREADCRUMBS_SINGLE_REPORT",
                }),
                link: `/report/${reportId}`,
              },
            ]}
          />

          <Stack overflow="scroll" className="scrollbar-hidden">
            <AsyncComponent
              loading={isLoading}
              SkeletonComponent={
                <Skeleton
                  variant="rectangular"
                  width={660}
                  height={934}
                  sx={{
                    mt: 3,
                    mx: "auto",
                  }}
                />
              }
            >
              <ReportPDF />
            </AsyncComponent>
          </Stack>
        </Stack>
      </Stack>
    </FormikProvider>
  );
};

export default SingleReportPage;
