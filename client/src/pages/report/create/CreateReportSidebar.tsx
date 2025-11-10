import { useMemo, type FC } from "react";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { Form, useFormikContext } from "formik";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { ReportRangeDate, ReportType } from "api/generated/models";
import { useUserControllerFilterUsers } from "api/generated/user/user";
import FormikAutocomplete from "components/forms/FormikAutocomplete";
import FormikSwitch from "components/forms/FormikSwitch";
import FormikTextField from "components/forms/FormikTextField";

type CreateReportSidebarProps = {
  isLoading: boolean;
};

const CreateReportSidebar: FC<CreateReportSidebarProps> = ({ isLoading }) => {
  const history = useHistory();
  const intl = useIntl();

  const { values } = useFormikContext() as any;

  // Create translated options for ReportType
  const reportTypeOptions = useMemo(
    () => [
      {
        value: ReportType.Group_Report,
        label: intl.formatMessage({
          id: "PAGE.HOME.RECENT_REPORTS_TYPE_GROUP",
        }),
      },
      {
        value: ReportType.Individual_Report,
        label: intl.formatMessage({
          id: "PAGE.HOME.RECENT_REPORTS_TYPE_INDIVIDUAL",
        }),
      },
    ],
    [intl],
  );

  // Create translated options for ReportRangeDate
  const reportRangeDateOptions = useMemo(
    () => [
      {
        value: ReportRangeDate.Last_Week,
        label: intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT.RANGE_DATE_LAST_WEEK",
        }),
      },
    ],
    [intl],
  );

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
      <FormikTextField
        name="title"
        label={intl.formatMessage({ id: "PAGE.REPORT.CREATE_REPORT_TITLE" })}
        placeholder={intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT_TITLE.PLACEHOLDER",
        })}
      />

      <FormikTextField
        name="subtitle"
        label={intl.formatMessage({ id: "PAGE.REPORT.CREATE_REPORT_SUBTITLE" })}
        placeholder={intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT_SUBTITLE.PLACEHOLDER",
        })}
      />

      <Divider sx={{ my: 2 }} />

      <FormikAutocomplete
        name="reportType"
        label={intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT.REPORT_TYPE",
        })}
        options={reportTypeOptions}
        sx={{ mb: 0.5 }}
      />

      {values.reportType === ReportType.Individual_Report && (
        <FormikAutocomplete
          name="learner"
          label={intl.formatMessage({
            id: "PAGE.REPORT.CREATE_REPORT.SELECT_LEARNER",
          })}
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
        label={intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT.RANGE_DATE",
        })}
        options={reportRangeDateOptions}
      />

      <Divider sx={{ my: 2 }} />

      <Typography fontSize={16} fontWeight={700} color="#60646C" pb={1}>
        {intl.formatMessage({ id: "PAGE.REPORT.CREATE_REPORT.EXPORT_FORMAT" })}
      </Typography>

      <FormikSwitch
        name="horizontal"
        label={intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT.EXPORT_FORMAT.HORIZONTAL_ORIENTATION",
        })}
      />

      <Typography fontSize={12} fontWeight={500} color="#808080" mt={0.5}>
        {intl.formatMessage({
          id: "PAGE.REPORT.CREATE_REPORT.EXPORT_FORMAT.HORIZONTAL_ORIENTATION_DESCRI",
        })}
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
              {intl.formatMessage({ id: "PAGE.REPORT.CREATE_REPORT.CANCEL" })}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading}
            >
              {intl.formatMessage({ id: "PAGE.REPORT.CREATE_REPORT.SAVE" })}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default CreateReportSidebar;
