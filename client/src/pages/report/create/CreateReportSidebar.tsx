import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useHistory } from "react-router-dom";

import FormikAutocomplete from "components/forms/FormikAutocomplete";
import FormikSwitch from "components/forms/FormikSwitch";
import FormikTextField from "components/forms/FormikTextField";

const CreateReportSidebar = () => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      horizontal: false,
    },
    onSubmit: () => {},
  });

  return (
    <Stack
      width={340}
      bgcolor="#F2F2F2"
      borderRight="1px solid #E1D7CB"
      px={2}
      py={2}
    >
      <FormikProvider value={formik}>
        <Typography fontSize={16} fontWeight={700} color="#60646C" mb={1.5}>
          Report title goes here
        </Typography>

        <FormikTextField
          name="subtitle"
          label="Subtitle"
          placeholder="Write a subtitle"
        />

        <Divider sx={{ my: 2 }} />

        <FormikAutocomplete
          name="reportType"
          label="Select report type"
          options={[
            {
              value: "individual-report",
              label: "Individual Report",
            },
            {
              value: "group-report",
              label: "Group Report",
            },
          ]}
          sx={{ mb: 0.5 }}
        />
        <FormikAutocomplete
          name="learner"
          label="Select learner"
          options={[]}
        />

        <Divider sx={{ my: 2 }} />

        <FormikAutocomplete
          name="rangeDate"
          label="Range Date"
          options={[
            {
              value: "last-week",
              label: "Last week",
            },
          ]}
        />

        <Divider sx={{ my: 2 }} />

        <Typography fontSize={16} fontWeight={700} color="#60646C" pb={1}>
          Export format
        </Typography>

        <FormikSwitch name="horizontal" label="Horizontal orientation" />

        <Typography fontSize={12} fontWeight={500} color="#808080" mt={0.5}>
          If selected, the pages of the report will be changed to a horizontal
          layout
        </Typography>

        <Box mt="auto">
          <Divider sx={{ my: 1.5 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFF",
                  color: "#0F172A",
                }}
                onClick={() => {
                  history.push("/report");
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" fullWidth>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormikProvider>
    </Stack>
  );
};

export default CreateReportSidebar;
