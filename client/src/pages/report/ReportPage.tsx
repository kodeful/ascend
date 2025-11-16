import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import HomeLearners from "pages/home/components/HomeLearners";
import HomeRecentReportsDataGrid from "pages/home/components/HomeRecentReports/HomeRecentReportsDataGrid";
import { useIntl } from "react-intl";

import { ReportType } from "api/generated/models";
import FormikTextField from "components/forms/FormikTextField";
import Title from "components/TItle/Title";

import ReportBuilderTemplate from "./components/ReportBuilderTemplate/ReportBuilderTemplate";

const ReportPage = () => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });

  return (
    <Stack
      sx={{
        p: 3,
        py: 2,
      }}
      height="100%"
    >
      <Title title="PAGE.TITLE.REPORT_BUILDER" />

      <Grid
        className="scrollbar-hidden"
        container
        spacing={2}
        mt={2}
        height="100%"
        overflow="scroll"
      >
        <Grid item xs={8}>
          <Typography variant="h5" color="#4D4D4D">
            {/* Start from template */}
            {intl.formatMessage({ id: "PAGE.REPORT_TEMPLATE" })}
          </Typography>

          {/* Start from template */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={6}>
              <ReportBuilderTemplate
                title={intl.formatMessage({
                  id: "PAGE.REPORT.CREATE_REPORT_GROUP",
                })}
                state={{
                  reportType: ReportType.Group_Report,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ReportBuilderTemplate
                title={intl.formatMessage({
                  id: "PAGE.REPORT.CREATE_REPORT_INDIVIDUAL",
                })}
                state={{
                  reportType: ReportType.Individual_Report,
                }}
              />
            </Grid>
          </Grid>

          <Stack mt={3}>
            <FormikProvider value={formik}>
              <Form>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  pb={1}
                  alignItems="center"
                >
                  <Box width="100%" maxWidth={470}>
                    <FormikTextField
                      name="search"
                      label=""
                      placeholder={intl.formatMessage({
                        id: "PAGE.REPORT.CREATE_REPORT_FILTER",
                      })}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>

                  <Box>
                    {/* <Button
                      variant="contained"
                      sx={{
                        padding: "8px 16px",
                        minHeight: "auto",
                        height: "auto",
                        fontSize: 14,
                      }}
                    >
                      Add User
                    </Button> */}
                  </Box>
                </Stack>

                <HomeRecentReportsDataGrid />
              </Form>
            </FormikProvider>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Box position="sticky" top={10}>
            <Typography variant="h5" color="#4D4D4D">
              {intl.formatMessage({ id: "PAGE.TITLE.LEARNERS" })}
            </Typography>

            {/* Learners */}
            <Grid container pt={1} spacing={2}>
              <Grid item xs={12}>
                <HomeLearners />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ReportPage;
