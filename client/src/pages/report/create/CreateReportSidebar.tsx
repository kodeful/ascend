import type { FC } from "react";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { Form, useFormikContext } from "formik";
import { useHistory } from "react-router-dom";

import { ReportRangeDate, ReportType } from "api/generated/models";
import { useUserControllerFilterUsers } from "api/generated/user/user";
import FormikAutocomplete, {
  valueOptions,
} from "components/forms/FormikAutocomplete";
import FormikSwitch from "components/forms/FormikSwitch";
import FormikTextField from "components/forms/FormikTextField";

type CreateReportSidebarProps = {
  isLoading: boolean;
};

const CreateReportSidebar: FC<CreateReportSidebarProps> = ({ isLoading }) => {
  const history = useHistory();

  const { values } = useFormikContext() as any;

  const { data: learners, isLoading: isLoadingLearners } =
    useUserControllerFilterUsers(
      {
        limit: -1,
        filter: "workspaces.role::eq::Learner",
      },
      {
        query: {
          queryKey: ["users", "learner"],
          enabled: values.reportType === ReportType.Individual_Report,
        },
      },
    );

  return (
    <Stack
      width={340}
      bgcolor="#F2F2F2"
      borderRight="1px solid #E1D7CB"
      px={2}
      py={2}
      component={Form}
    >
      <FormikTextField name="title" label="Title" placeholder="Write a title" />

      <FormikTextField
        name="subtitle"
        label="Subtitle"
        placeholder="Write a subtitle"
      />

      <Divider sx={{ my: 2 }} />

      <FormikAutocomplete
        name="reportType"
        label="Select report type"
        options={valueOptions(Object.values(ReportType))}
        sx={{ mb: 0.5 }}
      />

      {values.reportType === ReportType.Individual_Report && (
        <FormikAutocomplete
          name="learner"
          label="Select learner"
          options={(learners?.data || []).map((learner) => ({
            value: learner._id,
            label: learner.fullName!,
          }))}
          loading={isLoadingLearners}
        />
      )}

      <Divider sx={{ my: 2 }} />

      <FormikAutocomplete
        name="rangeDate"
        label="Range Date"
        options={valueOptions(Object.values(ReportRangeDate))}
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
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default CreateReportSidebar;
