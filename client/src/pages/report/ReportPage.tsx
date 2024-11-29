import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import HomeLearners from "pages/home/components/HomeLearners";
import HomeRecentReportsDataGrid from "pages/home/components/HomeRecentReports/HomeRecentReportsDataGrid";

import FormikTextField from "components/forms/FormikTextField";

import ReportBuilderTemplate from "./components/ReportBuilderTemplate/ReportBuilderTemplate";

const ReportPage = () => {
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
    >
      <Typography variant="h1" color="primary.main">
        Report builder
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={8}>
          <Typography variant="h5" color="#4D4D4D">
            Start from template
          </Typography>

          {/* Start from template */}
          <Grid container pt={1} spacing={2}>
            <Grid item xs={3}>
              <ReportBuilderTemplate title="Group Ascend Formula Report" />
            </Grid>
            <Grid item xs={3}>
              <ReportBuilderTemplate title="Ascend Individual Formula Report" />
            </Grid>
            <Grid item xs={3}>
              <ReportBuilderTemplate title="LMS Group Learning Activities Report" />
            </Grid>
            <Grid item xs={3}>
              <ReportBuilderTemplate title="LMS Individual Learning Activities Report" />
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
                      placeholder="Filter report"
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
              Learners
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
